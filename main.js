/**
 * Vstupné údaje príkladu.
 */
const dtoIn = {
  count: 6,
  age: {
    min: 19,
    max: 35
  }
};

// Jednoduché zoznamy
const names = [
  "Jan","Petr","Pavel","Martin","Tomáš","Jakub","Lukáš","David","Michal","Vojtěch",
  "Daniel","Marek","Tereza","Anna","Eliška","Karolína","Adéla","Kristýna"
];

const surnames = [
  "Novák","Svoboda","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Král",
  "Beneš","Fiala","Kadlec","Vaníček","Jirásek","Kolář","Urban","Bláha","Holub"
];

const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * Vyberie náhodnú hodnotu z poľa.
 * @param {Array<any>} arr - Pole hodnôt.
 * @returns {*} Náhodne vybraná hodnota.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vytvorí náhodný ISO dátum medzi dvoma dátumami.
 * @param {Date} minDate - Minimálny dátum.
 * @param {Date} maxDate - Maximálny dátum.
 * @returns {string} ISO dátum.
 */
function generateRandomDate(minDate, maxDate) {
  const min = minDate.getTime();
  const max = maxDate.getTime();
  const t = min + Math.random() * (max - min);
  return new Date(t).toISOString();
}

/**
 * Vygeneruje zoznam zamestnancov.
 * !!! PORADIE KĽÚČOV JE TU KRITICKÉ PRE TESTY !!!
 * @param {object} dtoIn - Vstupné parametre.
 * @returns {Array<object>} Zoznam zamestnancov.
 */
export function generateEmployeeData(dtoIn) {
  const employees = [];
  const now = new Date();

  const maxDate = new Date(now);
  maxDate.setFullYear(now.getFullYear() - dtoIn.age.max);

  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    // MUSÍ BYŤ V TOMTO PORADÍ:
    employees.push({
      gender: pickRandom(genders),
      birthdate: generateRandomDate(minDate, maxDate),
      name: pickRandom(names),
      surname: pickRandom(surnames),
      workload: pickRandom(workloads)
    });
  }

  return employees;
}

/**
 * Spočíta medián zo zoznamu čísel.
 * @param {Array<number>} arr - Pole čísiel.
 * @returns {number|null} Medián.
 */
function median(arr) {
  if (arr.length === 0) return null;

  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);

  if (s.length % 2 === 1) {
    return s[mid];
  } else {
    return (s[mid - 1] + s[mid]) / 2;
  }
}

/**
 * Vypočíta vek z dátumu narodenia.
 * @param {string} birthIso - ISO dátum narodenia.
 * @param {Date} today - Aktuálny dátum.
 * @returns {number} Vek v rokoch.
 */
function computeAgeDecimal(birthIso, today) {
  const birth = new Date(birthIso);
  const diff = today - birth;
  const yearMs = 1000 * 60 * 60 * 24 * 365.25;
  return diff / yearMs;
}

/**
 * Počty zamestnancov podľa úväzku.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Počty workloadov.
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
 * Vypočíta štatistiky veku.
 * @param {Array<number>} ages - Zoznam vekov.
 * @returns {object} Štatistiky veku.
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
 * Vypočíta štatistiky workloadov.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Median workloadu + priemer ženského workloadu.
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
 * Spojí všetky štatistiky dokopy.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} dtoOut štatistiky.
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
 * @param {object} dtoIn - Vstupné parametre.
 * @returns {object} Kompletné dtoOut.
 */
export function main(dtoIn) {
  const list = generateEmployeeData(dtoIn);
  const stats = getEmployeeStatistics(list);
  return stats;
}

// Test
console.log(main(dtoIn));
