/**
 * Vstupný príklad
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
 * @param {Array} arr
 * @returns {*}
 */
function pickRandom(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

/**
 * @param {Date} minDate
 * @param {Date} maxDate
 * @returns {string}
 */
function generateRandomDate(minDate, maxDate) {
  const ts = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * @param {object} dtoIn
 * @returns {Array<object>}
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
 * @param {Array<number>} arr
 * @returns {number|null}
 */
function median(arr) {
  if (!arr.length) return null;
  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * @param {string} birthdateIso
 * @param {Date} today
 * @returns {number}
 */
function computeAgeDecimal(birthdateIso, today) {
  const birth = new Date(birthdateIso);
  const msYear = 1000 * 60 * 60 * 24 * 365.25;
  return (today - birth) / msYear;
}

/**
 * @param {Array<object>} employees
 * @returns {object}
 */
function getWorkloadCounts(employees) {
  const out = { workload10: 0, workload20: 0, workload30: 0, workload40: 0 };

  for (const p of employees) {
    out["workload" + p.workload]++;
  }
  return out;
}

/**
 * @param {Array<number>} ages
 * @returns {object}
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
 * @param {Array<object>} employees
 * @returns {object}
 */
function getWorkloadStats(employees) {
  const workloads = employees.map(e => e.workload);
  const women = employees.filter(e => e.gender === "female").map(e => e.workload);

  const medianWorkload = median(workloads) !== null ? Math.round(median(workloads)) : null;

  let avgWomen = null;
  if (women.length > 0) {
    avgWomen = Number((women.reduce((a, b) => a + b, 0) / women.length).toFixed(1));
  }

  return { medianWorkload, averageWomenWorkload: avgWomen };
}

/**
 * @param {Array<object>} employees
 * @returns {object}
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
 * @param {object} dtoIn
 * @returns {object}
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

console.log(main(dtoIn));
