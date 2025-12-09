/**
 * Vyberie náhodnú položku z poľa.
 * @param {Array<any>} arr
 * @returns {*}
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vygeneruje náhodný dátum narodenia v ISO formáte.
 * @param {Date} minDate
 * @param {Date} maxDate
 * @returns {string}
 */
function generateRandomDate(minDate, maxDate) {
  const min = minDate.getTime();
  const max = maxDate.getTime();
  const randomTime = min + Math.random() * (max - min);
  return new Date(randomTime).toISOString();
}

/**
 * Vygeneruje zoznam zamestnancov.
 * @param {object} dtoIn
 * @returns {Array<object>}
 */
export function generateEmployeeData(dtoIn) {
  const result = [];

  const now = new Date();

  // Vypočítanie hraníc dátumu narodenia
  const maxDate = new Date(now);
  maxDate.setFullYear(now.getFullYear() - dtoIn.age.max);

  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    result.push({
      name: pickRandom(names),
      surname: pickRandom(surnames),
      gender: pickRandom(genders),
      workload: pickRandom(workloads),
      birthdate: generateRandomDate(minDate, maxDate)
    });
  }

  return result;
}

/**
 * Spočíta medián.
 * @param {Array<number>} arr
 * @returns {number|null}
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
 * Prepočíta vek v rokoch.
 * @param {string} birthdateIso
 * @param {Date} today
 * @returns {number}
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const diff = today - birth;
  const yearMs = 1000 * 60 * 60 * 24 * 365.25;
  return diff / yearMs;
}

/**
 * Spočíta workloady.
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
 * Štatistiky veku.
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
 * Štatistiky úväzkov.
 * @param {Array<object>} employees
 * @returns {object}
 */
function getWorkloadStats(employees) {
  const workloadsArr = employees.map(e => e.workload);
  const med = median(workloadsArr);

  const women = employees.filter(e => e.gender === "female");
  let avgWomen = 0;

  if (women.length > 0) {
    let sum = 0;
    for (let i = 0; i < women.length; i++) {
      sum += women[i].workload;
    }
    avgWomen = Number((sum / women.length).toFixed(1));
  }

  return {
    medianWorkload: med !== null ? Math.round(med) : null,
    averageWomenWorkload: avgWomen
  };
}

/**
 * Kompletné štatistiky zamestnancov.
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
  const data = generateEmployeeData(dtoIn);
  const stats = getEmployeeStatistics(data);
  return stats;
}

// test run
console.log(main(dtoIn));
