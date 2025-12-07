/**
 * Vstupný príklad (použite svoj dtoIn pri testovaní).
 */
const dtoIn = {
  count: 6,
  age: {
    min: 19,
    max: 35,
  },
};

const names = [
  "Jan","Petr","Pavel","Martin","Tomáš","Jakub","Lukáš","Jiří","David","Josef",
  "Adam","Matěj","Filip","Václav","Daniel","Marek","Jaroslav","Štěpán","Ondřej","Karel",
  "Vojtěch","Michal","Roman","Zdeněk","Radek","Oldřich","Robert","Aleš","Milan","Richard",
  "Tereza","Anna","Eliška","Karolína","Adéla","Kristýna","Natálie","Veronika","Markéta","Barbora",
  "Lucie","Klára","Kateřina","Nikola","Monika","Gabriela","Simona","Alena","Iveta","Jana"
];

const surnames = [
  "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
  "Mareš","Pospíšil","Hájek","Jelínek","Král","Růžička","Beneš","Fiala","Sedláček","Doležal",
  "Zeman","Urban","Vaněk","Kolář","Štěpánek","Polák","Kříž","Pokorný","Konečný","Malý",
  "Kovář","Bláha","Strnad","Holý","Soukup","Matoušek","Tichý","Hlaváček","Kočí","Bečka",
  "Suchý","Zajíček","Pazdera","Leoš","Staňek","Burda","Mašek","Čížek","Stehlík","Gregor"
];

const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * Vyberie náhodnú položku z poľa.
 * @param {Array} arr - Pole, z ktorého sa vyberá náhodný prvok.
 * @returns {*} Náhodný prvok z poľa.
 */
function pickRandom(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

/**
 * Vráti náhodný ISO dátum medzi minDate a maxDate.
 * @param {Date} minDate - dolná hranica (najstarší dátum).
 * @param {Date} maxDate - horná hranica (najnovší dátum).
 * @returns {string} ISO reťazec náhodného dátumu.
 */
function generateRandomDate(minDate, maxDate) {
  const ts = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * Vygeneruje pole zamestnancov podľa dtoIn (predchádzajúci "main" z úlohy 3).
 * @param {object} dtoIn - objekt {count, age: {min, max}}.
 * @returns {Array<object>} Pole vygenerovaných zamestnancov (objekty s name,surname,gender,workload,birthdate).
 */
export function generateEmployeeData(dtoIn) {
  const people = [];

  const today = new Date();

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - dtoIn.age.max);

  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    const person = {
      name: pickRandom(names),
      surname: pickRandom(surnames),
      gender: pickRandom(genders),
      workload: pickRandom(workloads),
      birthdate: generateRandomDate(minDate, maxDate),
    };
    people.push(person);
  }

  return people;
}

/**
 * Vypočíta medián z číselného poľa.
 * @param {Array<number>} arr - pole čísel (môže byť prázdne).
 * @returns {number|null} Medián (ako číslo) alebo null ak prázdne pole.
 */
function median(arr) {
  if (!arr || arr.length === 0) return null;
  const copy = arr.slice();
  copy.sort(function (a, b) { return a - b; });
  const mid = Math.floor(copy.length / 2);
  if (copy.length % 2 === 1) {
    return copy[mid];
  }
  return (copy[mid - 1] + copy[mid]) / 2;
}

/**
 * Prevedie dátum narodenia na vek (v rokoch, desatinné číslo).
 * @param {string} birthdateIso - ISO string dátumu narodenia.
 * @param {Date} today - referenčný dátum (zvyčajne new Date()).
 * @returns {number} vek v rokoch (desatinné).
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const age = (today.getTime() - birth.getTime()) / msPerYear;
  return age;
}

/**
 * Zoberie pole zamestnancov a vypočíta požadované štatistiky podľa zadania.
 * @param {Array<object>} employees - pole objektov {name,surname,gender,workload,birthdate}.
 * @returns {object} Objekt so štatistikami (total, workload10..40, averageAge, minAge, maxAge, medianAge, medianWorkload, averageWomenWorkload, sortedByWorkload).
 */
export function getEmployeeStatistics(employees) {
  const today = new Date();

  const total = employees.length;

  // počítadlá workloadov
  const workload10 = 0;
  const workload20 = 0;
  const workload30 = 0;
  const workload40 = 0;
  // použijeme objekt na mutáciu (prehľadné)
  const workloadCounts = { 10: 0, 20: 0, 30: 0, 40: 0 };

  // veky (desatinné), workloady a workloady žien
  const agesDecimal = [];
  const workloadsAll = [];
  const womenWorkloads = [];

  for (let i = 0; i < employees.length; i++) {
    const p = employees[i];

    // workloads
    if (p.workload === 10) workloadCounts[10] += 1;
    else if (p.workload === 20) workloadCounts[20] += 1;
    else if (p.workload === 30) workloadCounts[30] += 1;
    else if (p.workload === 40) workloadCounts[40] += 1;

    // vek (desatinný)
    const ageDec = computeAgeDecimal(p.birthdate, today);
    agesDecimal.push(ageDec);

    // workloads array
    workloadsAll.push(p.workload);

    // ženy
    if (p.gender === "female") {
      womenWorkloads.push(p.workload);
    }
  }

  // averageAge (1 desatinné miesto)
  let averageAge = 0;
  if (agesDecimal.length > 0) {
    let sum = 0;
    for (let i = 0; i < agesDecimal.length; i++) sum += agesDecimal[i];
    averageAge = Number((sum / agesDecimal.length).toFixed(1)); // 1 desatinné
  }

  // minAge, maxAge -> zaokrúhlené na celé čísla (podľa zadania)
  let minAge = null;
  let maxAge = null;
  if (agesDecimal.length > 0) {
    minAge = Math.round( Math.min.apply(null, agesDecimal) );
    maxAge = Math.round( Math.max.apply(null, agesDecimal) );
  }

  // medianAge -> spočítať z desatinných hodnôt, potom zaokrúhliť na celé číslo
  let medianAge = null;
  if (agesDecimal.length > 0) {
    const med = median(agesDecimal);
    medianAge = Math.round(med);
  }

  // medianWorkload -> spočítať a vrátiť celé číslo (zaokrúhľujem na najbližšie celé)
  let medianWorkload = null;
  if (workloadsAll.length > 0) {
    const medW = median(workloadsAll);
    medianWorkload = Math.round(medW);
  }

  // averageWomenWorkload -> môže byť 1 des. alebo celé číslo; my vrátime 1 des. miesto ak to nie je celé
  let averageWomenWorkload = 0;
  if (womenWorkloads.length > 0) {
    let sumW = 0;
    for (let i = 0; i < womenWorkloads.length; i++) sumW += womenWorkloads[i];
    const avgW = sumW / womenWorkloads.length;
    averageWomenWorkload = (Math.round(avgW) === avgW) ? avgW : Number(avgW.toFixed(1));
  } else {
    averageWomenWorkload = 0;
  }

  // sortedByWorkload -> zoradené numericky od najmenšieho po najväčší
  const sortedByWorkload = employees.slice().sort(function (a, b) {
    return a.workload - b.workload;
  });

  // zostavíme výsledný dtoOut podľa štruktúry zadania
  const dtoOut = {
    total: total,
    workload10: workloadCounts[10],
    workload20: workloadCounts[20],
    workload30: workloadCounts[30],
    workload40: workloadCounts[40],
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: averageWomenWorkload,
    sortedByWorkload: sortedByWorkload,
  };

  return dtoOut;
}

/**
 * Hlavná entry funkcia, ktorá zavolá generateEmployeeData a getEmployeeStatistics.
 * @param {object} dtoIn - vstup pre generovanie (count, age:{min,max}).
 * @returns {object} Výsledné DTO so štatistikami (podľa zadania).
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const stats = getEmployeeStatistics(employees);
  return stats;
}

// test run
console.log(main(dtoIn));