/**
 * Vstupný príklad
 */
const dtoIn = {
  count: 6,
  age: {
    min: 19,
    max: 35,
  },
};

const names = ["Jan", "Peter", "Maria", "Lucia"];
const surnames = ["Novak", "Hrasko", "Mrkvicka", "Smetanova"];
const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * Vyberie náhodnú položku z poľa.
 * @param {Array} arr - Pole, z ktorého sa vyberá.
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
 * @returns {string} Náhodný ISO dátum vo formáte stringu.
 */
function generateRandomDate(minDate, maxDate) {
  const ts =
    minDate.getTime() +
    Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * Vygeneruje zoznam zamestnancov.
 * @param {object} dtoIn - Vstupné dáta (count, age interval).
 * @returns {Array<object>} Zoznam zamestnancov.
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
 * Spočíta medián z poľa čísel.
 * @param {Array<number>} arr - Pole čísel.
 * @returns {number|null} Medián alebo null.
 */
function median(arr) {
  if (!arr.length) return null;
  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Vypočíta desatinný vek.
 * @param {string} birthdateIso - ISO dátum narodenia.
 * @param {Date} today - Referenčný dátum.
 * @returns {number} Vek v rokoch.
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const msYear = 1000 * 60 * 60 * 24 * 365.25;
  return (today - birth) / msYear;
}

/**
 * Spočíta počty workloadov v tvare workload10, workload20, workload30, workload40.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Počty workloadov.
 */
function getWorkloadCounts(employees) {
  const out = {
    workload10: 0,
    workload20: 0,
    workload30: 0,
    workload40: 0,
  };

  for (const p of employees) {
    const key = "workload" + p.workload;
    out[key]++;
  }

  return out;
}

/**
 * Vypočíta vekové štatistiky.
 * @param {Array<number>} ages - Zoznam vekov.
 * @returns {object} age štatistiky.
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
 * Vypočíta workload štatistiky.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} workload štatistiky.
 */
function getWorkloadStats(employees) {
  const workloads = employees.map((e) => e.workload);
  const women = employees
    .filter((e) => e.gender === "female")
    .map((e) => e.workload);

  const mw = median(workloads);
  const medWorkload = mw !== null ? Math.round(mw) : null;

  let avgWomen = 0;
  if (women.length) {
    const avg = women.reduce((a, b) => a + b, 0) / women.length;
    avgWomen = Number(avg.toFixed(1));
  }

  return { medianWorkload: medWorkload, averageWomenWorkload: avgWomen };
}

/**
 * Spočíta štatistiky zamestnancov.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Kompletné štatistiky.
 */
export function getEmployeeStatistics(employees) {
  const today = new Date();

  const ages = employees.map((e) => computeAgeDecimal(e.birthdate, today));
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
 * Hlavná funkcia.
 * @param {object} dtoIn - Vstupné dáta.
 * @returns {object} Štatistiky.
 */
export function main(dtoIn) {
  const e = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(e);
}

// test
console.log(main(dtoIn));
