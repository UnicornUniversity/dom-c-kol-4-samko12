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

const names = ["Jan", "Petr", "Pavel", "Martin", "Tomáš", "Jakub"];
const surnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera"];
const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * Vyberie náhodnú položku z poľa.
 * @param {Array<any>} arr - Pole, z ktorého sa vyberá.
 * @returns {*} Náhodný prvok z poľa.
 */
function pickRandom(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

/**
 * Vráti náhodný ISO dátum medzi minDate a maxDate.
 * @param {Date} minDate - Dolná hranica dátumu.
 * @param {Date} maxDate - Horná hranica dátumu.
 * @returns {string} ISO dátum vygenerovanej náhodnej hodnoty.
 */
function generateRandomDate(minDate, maxDate) {
  const ts = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * Vygeneruje pole zamestnancov vrátane mena, priezviska, pohlavia,
 * úväzku a dátumu narodenia.
 * @param {object} dtoIn - Vstupné dáta obsahujúce počet ľudí a vekové hranice.
 * @param {number} dtoIn.count - Počet zamestnancov na vygenerovanie.
 * @param {object} dtoIn.age - Vekové rozpätie.
 * @param {number} dtoIn.age.min - Minimálny vek.
 * @param {number} dtoIn.age.max - Maximálny vek.
 * @returns {Array<object>} Pole vygenerovaných zamestnancov.
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
 * Vypočíta medián zo zoznamu čísiel.
 * @param {Array<number>} arr - Zoznam čísel.
 * @returns {number|null} Medián alebo null pri prázdnom poli.
 */
function median(arr) {
  if (!arr.length) return null;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Vypočíta vek v desatinných rokoch z dátumu narodenia.
 * @param {string} birthdateIso - ISO dátum narodenia.
 * @param {Date} today - Referenčný dátum.
 * @returns {number} Vek v rokoch (desatinné číslo).
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const msYear = 1000 * 60 * 60 * 24 * 365.25;
  return (today - birth) / msYear;
}

/**
 * Spočíta počty zamestnancov podľa výšky úväzku.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {{workload10:number, workload20:number, workload30:number, workload40:number}}
 * Počty zamestnancov podľa úväzkov.
 */
function getWorkloadCounts(employees) {
  const out = { workload10: 0, workload20: 0, workload30: 0, workload40: 0 };
  for (const p of employees) {
    out["workload" + p.workload]++;
  }
  return out;
}

/**
 * Vypočíta štatistiky veku.
 * @param {Array<number>} ages - Zoznam vekov.
 * @returns {{
 * averageAge:number,
 * minAge:number|null,
 * maxAge:number|null,
 * medianAge:number|null
 * }} Štatistiky veku.
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
 * Vypočíta štatistiky úväzkov.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {{
 * medianWorkload:number|null,
 * averageWomenWorkload:number
 * }} Median úväzku a priemerný úväzok žien.
 */
function getWorkloadStats(employees) {
  const workloads = employees.map(e => e.workload);
  const women = employees.filter(e => e.gender === "female").map(e => e.workload);

  const med = median(workloads);
  const medianWorkload = med !== null ? Math.round(med) : null;

  let avgWomen = 0;
  if (women.length) {
    avgWomen = Number((women.reduce((a, b) => a + b, 0) / women.length).toFixed(1));
  }

  return { medianWorkload, averageWomenWorkload: avgWomen };
}

/**
 * Spočíta všetky potrebné štatistiky podľa zadania.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Kompletné štatistiky vrátane triedeného zoznamu.
 */
export function getEmployeeStatistics(employees) {
  const today = new Date();

  const ages = employees.map(e => computeAgeDecimal(e.birthdate, today));
  const ageStats = getAgeStats(ages);
  const workloadCounts = getWorkloadCounts(employees);
  const workloadStats = getWorkloadStats(employees);

  return {
    total: employees.length,
    ...workloadCounts,
    ...ageStats,
    ...workloadStats,
    sortedByWorkload: employees.slice().sort((a, b) => a.workload - b.workload),
  };
}

/**
 * Hlavná funkcia — generuje dáta a vracia výstup dtoOut.
 * @param {object} dtoIn - Vstupné hodnoty.
 * @returns {object} Výsledné štatistiky dtoOut.
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

// TEST
console.log(main(dtoIn));
