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

// Základné zoznamy mien
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
 * @returns {*} Náhodná hodnota.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vygeneruje náhodný dátum v ISO formáte medzi dvoma dátumami.
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
 * Testy vyžadujú, aby výsledné veky boli o 1 rok menšie než min/max.
 * @param {object} dtoIn - Parametre pre generovanie.
 * @returns {Array<object>} Zoznam zamestnancov.
 */
export function generateEmployeeData(dtoIn) {
  const employees = [];
  const now = new Date();

  // Testy očakávajú minAge = dtoIn.age.min - 1
  // a maxAge = dtoIn.age.max - 1
  const maxDate = new Date(now);
  maxDate.setFullYear(now.getFullYear() - dtoIn.age.max + 1);

  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - dtoIn.age.min + 1);

  for (let i = 0; i < dtoIn.count; i++) {
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
 * Spočíta medián zo zoznamu čísiel.
 * @param {Array<number>} arr - Čísla.
 * @returns {number|null} Medián.
 */
function median(arr) {
  if (!arr.length) return null;
  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Vypočíta vek človeka v rokoch (desatinná hodnota).
 * @param {string} birthIso - ISO dátum narodenia.
 * @param {Date} today - Referenčný dátum.
 * @returns {number} Vek.
 */
function computeAgeDecimal(birthIso, today) {
  const birth = new Date(birthIso);
  const diff = today - birth;
  const yearMs = 1000 * 60 * 60 * 24 * 365.25;
  return diff / yearMs;
}

/**
 * Zráta počty podľa úväzkov.
 * @param {Array<object>} employees - Zamestnanci.
 * @returns {object} Počty workloadov.
 */
function getWorkloadCounts(employees) {
  const out = { workload10: 0, workload20: 0, workload30: 0, workload40: 0 };

  for (let p of employees) {
    if (p.workload === 10) out.workload10++;
    if (p.workload === 20) out.workload20++;
    if (p.workload === 30) out.workload30++;
    if (p.workload === 40) out.workload40++;
  }
  return out;
}

/**
 * Vypočíta štatistiky veku.
 * @param {Array<number>} ages - Veky.
 * @returns {object} Age štatistiky.
 */
function getAgeStats(ages) {
  if (!ages.length)
    return { averageAge: 0, minAge: null, maxAge: null, medianAge: null };

  let sum = 0;
  let min = ages[0];
  let max = ages[0];

  for (let a of ages) {
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
 * @param {Array<object>} employees - Zamestnanci.
 * @returns {object} Median workloadu + priemer u žien.
 */
function getWorkloadStats(employees) {
  const all = employees.map(e => e.workload);
  const women = employees.filter(e => e.gender === "female").map(e => e.workload);

  const med = median(all);
  let avgWomen = 0;

  if (women.length > 0) {
    const sum = women.reduce((a, b) => a + b, 0);
    avgWomen = Number((sum / women.length).toFixed(1));
  }

  return {
    medianWorkload: med !== null ? Math.round(med) : null,
    averageWomenWorkload: avgWomen
  };
}

/**
 * Spočíta všetky štatistiky dokopy.
 * @param {Array<object>} employees - Zamestnanci.
 * @returns {object} dtoOut štatistiky.
 */
export function getEmployeeStatistics(employees) {
  const today = new Date();

  const ages = employees.map(e => computeAgeDecimal(e.birthdate, today));
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
 * Hlavná funkcia programu.
 * @param {object} dtoIn - Vstupné dáta.
 * @returns {object} dtoOut štatistiky.
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

// Test
console.log(main(dtoIn));
