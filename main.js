/**
 * Vstupné dáta pre generovanie zamestnancov.
 */
const dtoIn = {
  count: 6,
  age: {
    min: 19,
    max: 35
  }
};

const names = [
  "Jan", "Petr", "Pavel", "Martin", "Tomáš", "Jakub",
  "Lukáš", "David", "Michal", "Vojtěch", "Daniel", "Marek",
  "Tereza", "Anna", "Eliška", "Karolína", "Adéla", "Kristýna"
];

const surnames = [
  "Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera",
  "Veselý", "Horák", "Král", "Beneš", "Fiala", "Kadlec",
  "Vaníček", "Jirásek", "Kolář", "Urban", "Bláha", "Holub"
];

const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * Vyberie náhodnú hodnotu z poľa.
 * @param {Array<any>} arr - Pole hodnôt.
 * @returns {*} Náhodne vybraná hodnota z poľa.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vygeneruje náhodný ISO dátum medzi dvoma dátumami.
 * @param {Date} minDate - Minimálny možný dátum.
 * @param {Date} maxDate - Maximálny možný dátum.
 * @returns {string} Náhodný ISO dátum.
 */
function generateRandomDate(minDate, maxDate) {
  const min = minDate.getTime();
  const max = maxDate.getTime();
  const rand = min + Math.random() * (max - min);
  return new Date(rand).toISOString();
}

/**
 * Vytvorí zoznam zamestnancov s náhodnými hodnotami.
 * @param {object} dtoIn - Vstupné parametre.
 * @param {number} dtoIn.count - Počet zamestnancov.
 * @param {object} dtoIn.age - Vekové rozpätie.
 * @param {number} dtoIn.age.min - Minimálny vek.
 * @param {number} dtoIn.age.max - Maximálny vek.
 * @returns {Array<object>} Vygenerovaný zoznam zamestnancov.
 */
export function generateEmployeeData(dtoIn) {
  const employees = [];
  const now = new Date();

  const maxDate = new Date(now);
  maxDate.setFullYear(now.getFullYear() - dtoIn.age.max);

  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    employees.push({
      name: pickRandom(names),
      surname: pickRandom(surnames),
      gender: pickRandom(genders),
      workload: pickRandom(workloads),
      birthdate: generateRandomDate(minDate, maxDate)
    });
  }

  return employees;
}

/**
 * Vypočíta medián zo zoznamu čísel.
 * @param {Array<number>} arr - Zoznam čísiel.
 * @returns {number|null} Medián alebo null pri prázdnom poli.
 */
function median(arr) {
  if (arr.length === 0) return null;

  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[mid];
  } else {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

/**
 * Prepočíta vek človeka v rokoch z dátumu narodenia.
 * @param {string} birthdateIso - ISO dátum narodenia.
 * @param {Date} today - Referenčný dátum (dnes).
 * @returns {number} Vek ako desatinné číslo.
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const diff = today - birth;
  const year = 1000 * 60 * 60 * 24 * 365.25;
  return diff / year;
}

/**
 * Spočíta počet zamestnancov podľa úväzku.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {{
 * workload10:number,
 * workload20:number,
 * workload30:number,
 * workload40:number
 * }} Počty zamestnancov podľa úväzkov.
 */
function getWorkloadCounts(employees) {
  const out = { workload10: 0, workload20: 0, workload30: 0, workload40: 0 };

  for (let i = 0; i < employees.length; i++) {
    const w = employees[i].workload;
    if (w === 10) out.workload10++;
    if (w === 20) out.workload20++;
    if (w === 30) out.workload30++;
    if (w === 40) out.workload40++;
  }

  return out;
}

/**
 * Vypočíta štatistiky veku zamestnancov.
 * @param {Array<number>} ages - Pole vekov.
 * @returns {{
 * averageAge:number,
 * minAge:number|null,
 * maxAge:number|null,
 * medianAge:number|null
 * }} Štatistiky veku.
 */
function getAgeStats(ages) {
  if (ages.length === 0) {
    return { averageAge: 0, minAge: null, maxAge: null, medianAge: null };
  }

  let sum = 0;
  let min = ages[0];
  let max = ages[0];

  for (let i = 0; i < ages.length; i++) {
    const a = ages[i];
    sum += a;
    if (a < min) min = a;
    if (a > max) max = a;
  }

  return {
    averageAge: Number((sum / ages.length).toFixed(1)),
    minAge: Math.round(min),
    maxAge: Math.round(max),
    medianAge: Math.round(median(ages))
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
  const workloadsArr = [];
  const women = [];

  for (let i = 0; i < employees.length; i++) {
    workloadsArr.push(employees[i].workload);

    if (employees[i].gender === "female") {
      women.push(employees[i].workload);
    }
  }

  const med = median(workloadsArr);
  let avgWomen = 0;

  if (women.length > 0) {
    let sum = 0;
    for (let j = 0; j < women.length; j++) {
      sum += women[j];
    }
    avgWomen = Number((sum / women.length).toFixed(1));
  }

  return {
    medianWorkload: med !== null ? Math.round(med) : null,
    averageWomenWorkload: avgWomen
  };
}

/**
 * Spojí všetky štatistiky dokopy a vráti výstup dtoOut.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Výsledné štatistiky dtoOut.
 */
export function getEmployeeStatistics(employees) {
  const today = new Date();

  const ages = [];

  for (let i = 0; i < employees.length; i++) {
    ages.push(computeAgeDecimal(employees[i].birthdate, today));
  }

  const ageStats = getAgeStats(ages);
  const workloadCounts = getWorkloadCounts(employees);
  const workloadStats = getWorkloadStats(employees);

  const sorted = employees.slice().sort((a, b) => a.workload - b.workload);

  return {
    total: employees.length,
    ...workloadCounts,
    ...ageStats,
    ...workloadStats,
    sortedByWorkload: sorted
  };
}

/**
 * Hlavná funkcia, ktorá vygeneruje dáta a vráti štatistiky.
 * @param {object} dtoIn - Vstupné hodnoty.
 * @returns {object} Kompletné výstupné štatistiky.
 */
export function main(dtoIn) {
  const list = generateEmployeeData(dtoIn);
  const stats = getEmployeeStatistics(list);
  return stats;
}

// Test výpis:
console.log(main(dtoIn));
