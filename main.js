/**
 * Príklad vstupných dát pre demonštráciu funkcie.
 */
const dtoIn = {
  count: 6,
  age: { min: 19, max: 35 },
};

const names = ["Jan", "Peter", "Maria", "Lucia"];
const surnames = ["Novak", "Hrasko", "Mrkvicka", "Smetanova"];
const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * Vráti náhodný prvok z daného poľa.
 * @param {Array} arr - Pole, z ktorého sa vyberá náhodný prvok.
 * @returns {*} Náhodný prvok z poľa.
 */
function pickRandom(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

/**
 * Generuje náhodný dátum v ISO formáte medzi dvoma dátumami.
 * @param {Date} minDate - Dolná hranica rozsahu dátumu.
 * @param {Date} maxDate - Horná hranica rozsahu dátumu.
 * @returns {string} Náhodný dátum vo formáte ISO string.
 */
function generateRandomDate(minDate, maxDate) {
  const ts = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * Generuje zoznam zamestnancov podľa vstupných parametrov.
 * @param {object} dtoIn - Vstupné parametre generovania (počet, vekový rozsah).
 * @returns {Array<object>} Zoznam vygenerovaných zamestnancov.
 */
export function generateEmployeeData(dtoIn) {
  const people = [];
  const today = new Date();

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - dtoIn.age.max);

  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    people.push({
      name: pickRandom(names),
      surname: pickRandom(surnames),
      gender: pickRandom(genders),
      workload: pickRandom(workloads),
      birthdate: generateRandomDate(minDate, maxDate),
    });
  }

  return people;
}

/**
 * Vypočíta medián z poľa čísel.
 * @param {Array<number>} arr - Pole čísel, z ktorého sa počíta medián.
 * @returns {number|null} Medián hodnôt alebo null pri prázdnom poli.
 */
function median(arr) {
  if (!arr.length) return null;
  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Vypočíta desatinný vek podľa dátumu narodenia.
 * @param {string} birthdateIso - ISO dátum narodenia.
 * @param {Date} today - Referenčný dátum pre výpočet veku.
 * @returns {number} Desatinný vek v rokoch.
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const msYear = 1000 * 60 * 60 * 24 * 365.25;
  return (today - birth) / msYear;
}

/**
 * Spočíta počty workloadov v podobe workload10, workload20, workload30, workload40.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Objekt s počtami jednotlivých workload hodnôt.
 */
function getWorkloadCounts(employees) {
  const out = { workload10: 0, workload20: 0, workload30: 0, workload40: 0 };

  for (const p of employees) {
    const key = "workload" + p.workload;
    out[key]++;
  }

  return out;
}

/**
 * Vygeneruje štatistiky veku zamestnancov.
 * @param {Array<number>} ages - Zoznam vekov zamestnancov.
 * @returns {object} Objekt s vekovými štatistikami.
 */
function getAgeStats(ages) {
  if (!ages.length)
    return { averageAge: 0, minAge: null, maxAge: null, medianAge: null };

  const sum = ages.reduce((a, b) => a + b, 0);

  return {
    averageAge: Number((sum / ages.length).toFixed(1)),
    minAge: Math.round(Math.min(...ages)),
    maxAge: Math.round(Math.max(...ages)),
    medianAge: Math.round(median(ages)),
  };
}

/**
 * Vypočíta štatistiky workloadov, vrátane mediánu a priemeru workloadu žien.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Objekt s workload štatistikami.
 */
function getWorkloadStats(employees) {
  const workloads = employees.map(e => e.workload);
  const women = employees.filter(e => e.gender === "female").map(e => e.workload);

  const medWorkload = median(workloads) !== null ? Math.round(median(workloads)) : null;

  let avgWomen = null;
  if (women.length > 0) {
    avgWomen = Number((women.reduce((a, b) => a + b, 0) / women.length).toFixed(1));
  }

  return { medianWorkload: medWorkload, averageWomenWorkload: avgWomen };
}

/**
 * Vytvorí kompletné štatistiky zamestnancov.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Objekt obsahujúci všetky požadované štatistiky.
 */
export function getEmployeeStatistics(employees) {
  const today = new Date();

  const ages = employees.map(e => computeAgeDecimal(e.birthdate, today));

  const ageStats = getAgeStats(ages);
  const workloadCounts = getWorkloadCounts(employees);
  const workloadStats = getWorkloadStats(employees);

  const sorted = employees.slice().sort((a, b) => {
    if (a.workload !== b.workload) return a.workload - b.workload;
    if (a.surname !== b.surname) return a.surname.localeCompare(b.surname);
    return a.name.localeCompare(b.name);
  });

  return {
    total: employees.length,
    workload10: workloadCounts.workload10,
    workload20: workloadCounts.workload20,
    workload30: workloadCounts.workload30,
    workload40: workloadCounts.workload40,
    averageAge: ageStats.averageAge,
    minAge: ageStats.minAge,
    maxAge: ageStats.maxAge,
    medianAge: ageStats.medianAge,
    medianWorkload: workloadStats.medianWorkload,
    averageWomenWorkload: workloadStats.averageWomenWorkload,
    sortedByWorkload: sorted,
  };
}

/**
 * Hlavná riadiaca funkcia projektu – generuje dáta a vypočíta ich štatistiky.
 * @param {object} dtoIn - Vstupné parametre generovania.
 * @returns {object} Kompletné štatistiky zamestnancov.
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

console.log(main(dtoIn));
