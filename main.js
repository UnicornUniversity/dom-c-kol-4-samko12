/**
 * Vstupné dáta
 */
const dtoIn = {
  count: 6,
  age: {
    min: 19,
    max: 35
  }
};

// Jednoduché zoznamy mien a priezvisk
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
 * @param {Array<any>} arr
 * @returns {*}
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Náhodný dátum medzi dvoma dátumami.
 * @param {Date} minDate
 * @param {Date} maxDate
 * @returns {string}
 */
function generateRandomDate(minDate, maxDate) {
  const min = minDate.getTime();
  const max = maxDate.getTime();
  const rand = min + Math.random() * (max - min);
  return new Date(rand).toISOString();
}

/**
 * Vytvorí zoznam zamestnancov.
 * @param {object} dtoIn
 * @returns {Array<object>}
 */
export function generateEmployeeData(dtoIn) {
  const employees = [];

  const now = new Date();

  // hranice pre výpočet dátumu narodenia
  const maxDate = new Date(now);
  maxDate.setFullYear(now.getFullYear() - dtoIn.age.max);

  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    const person = {
      name: pickRandom(names),
      surname: pickRandom(surnames),
      gender: pickRandom(genders),
      workload: pickRandom(workloads),
      birthdate: generateRandomDate(minDate, maxDate)
    };
    employees.push(person);
  }

  return employees;
}

/**
 * Výpočet mediánu.
 * @param {Array<number>} arr
 * @returns {number|null}
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
 * Prepočíta vek človeka.
 * @param {string} birthdateIso
 * @param {Date} today
 * @returns {number}
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const diff = today - birth;
  const year = 1000 * 60 * 60 * 24 * 365.25;
  return diff / year;
}

/**
 * Počty zamestnancov podľa úväzkov.
 * @param {Array<object>} employees
 * @returns {object}
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
 * Výpočet štatistík veku.
 * @param {Array<number>} ages
 * @returns {object}
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
 * Štatistiky workloadov.
 * @param {Array<object>} employees
 * @returns {object}
 */
function getWorkloadStats(employees) {
  const allWorkloads = [];

  const women = [];

  for (let i = 0; i < employees.length; i++) {
    allWorkloads.push(employees[i].workload);

    if (employees[i].gender === "female") {
      women.push(employees[i].workload);
    }
  }

  const med = median(allWorkloads);
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
 * Spojí všetky štatistiky dokopy.
 * @param {Array<object>} employees
 * @returns {object}
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
 * Hlavná funkcia.
 * @param {object} dtoIn
 * @returns {object}
 */
export function main(dtoIn) {
  const list = generateEmployeeData(dtoIn);
  const stats = getEmployeeStatistics(list);
  return stats;
}

// Test:
console.log(main(dtoIn));
