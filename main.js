/**
 * Príklad vstupných dát pre demonštráciu funkcie.
 */
const dtoIn = {
  count: 6,
  age: { min: 19, max: 35 },
};

const names = ["Jan", "Peter", "Maria", "Lucia"];
const surnames = ["Novak", "Hrasko", "Mrkvicka", "Smetanova"];
const gender = ["male", "female"];
const workload = [10, 20, 30, 40];

/**
 * Vráti náhodný prvok z poľa.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vygeneruje reálny vek (integer) podľa dátumu narodenia.
 */
function getAge(birthIso) {
  const birth = new Date(birthIso);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  if (beforeBirthday) age--;

  return age;
}

/**
 * Vygeneruje náhodný dátum v danom rozsahu.
 */
function generateRandomDate(minDate, maxDate) {
  const timestamp =
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(timestamp).toISOString();
}

/**
 * Generuje zamestnancov podľa dtoIn.
 */
function generateEmployeeData(dtoIn) {
  const people = [];
  const today = new Date();

  // najstarší možný = today - maxAge
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - dtoIn.age.max);

  // najmladší možný = today - minAge
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    people.push({
      name: pickRandom(names),
      surname: pickRandom(surnames),
      gender: pickRandom(gender),
      workload: pickRandom(workload),
      birthdate: generateRandomDate(minDate, maxDate),
    });
  }

  return people;
}

/**
 * Medián.
 */
function median(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return arr.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Štatistiky workloadov.
 */
function getWorkloadCounts(employees) {
  return employees.reduce(
    (acc, e) => {
      acc["workload" + e.workload]++;
      return acc;
    },
    { workload10: 0, workload20: 0, workload30: 0, workload40: 0 }
  );
}

/**
 * Štatistiky veku.
 */
function getAgeStats(ages) {
  const avg = ages.reduce((a, b) => a + b, 0) / ages.length;
  return {
    averageAge: Number(avg.toFixed(1)),
    minAge: Math.min(...ages),
    maxAge: Math.max(...ages),
    medianAge: median(ages),
  };
}

/**
 * Štatistiky workloadu.
 */
function getWorkloadStats(employees) {
  const workloads = employees.map(e => e.workload);
  const women = employees.filter(e => e.gender === "female").map(e => e.workload);

  const med = median(workloads);
  const avgWomen =
    women.length ? Number((women.reduce((a, b) => a + b, 0) / women.length).toFixed(1)) : 0;

  return {
    medianWorkload: med,
    averageWomenWorkload: avgWomen,
  };
}

/**
 * Hlavná funkcia – štatistiky.
 */
function getEmployeeStatistics(employees) {
  const ages = employees.map(e => getAge(e.birthdate));

  const ageStats = getAgeStats(ages);
  const workloadCounts = getWorkloadCounts(employees);
  const workloadStats = getWorkloadStats(employees);

  const sorted = [...employees].sort((a, b) => a.workload - b.workload);

  return {
    total: employees.length,
    ...workloadCounts,
    ...ageStats,
    ...workloadStats,
    sortedByWorkload: sorted,
  };
}

/**
 * Entry point.
 */
function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

module.exports = {
  generateEmployeeData,
  getEmployeeStatistics,
  main,
};

// Demo
// console.log(main(dtoIn));
