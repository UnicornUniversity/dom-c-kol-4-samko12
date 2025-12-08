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
 * Vyberie náhodný prvok z poľa.
 * @param {Array<*>} arr - Pole, z ktorého chceme vybrať náhodnú hodnotu.
 * @returns {*} Náhodný prvok z poľa.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vypočíta presný integer vek osoby podľa dátumu narodenia.
 * @param {string} birthIso - Dátum narodenia vo formáte ISO (string).
 * @returns {number} Integer vek osoby.
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
 * Vygeneruje náhodný dátum medzi dvoma hranicami.
 * @param {Date} minDate - Najstarší možný dátum.
 * @param {Date} maxDate - Najmladší možný dátum.
 * @returns {string} Náhodný dátum vo formáte ISO.
 */
function generateRandomDate(minDate, maxDate) {
  const timestamp =
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(timestamp).toISOString();
}

/**
 * Vygeneruje zoznam zamestnancov na základe vstupných parametrov.
 * @param {{count:number, age:{min:number, max:number}}} dtoIn - Parametre generovania.
 * @returns {Array<object>} Generovaný zoznam zamestnancov.
 */
function generateEmployeeData(dtoIn) {
  const people = [];
  const today = new Date();

  // Najstarší povolený dátum (today - max age)
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - dtoIn.age.max);

  // Najmladší povolený dátum (today - min age)
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
 * Vráti medián z číselného poľa.
 * @param {Array<number>} arr - Pole čísel.
 * @returns {number|null} Medián hodnôt alebo null pri prázdnom poli.
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
 * Spočíta počty jednotlivých workload hodnôt.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {{workload10:number, workload20:number, workload30:number, workload40:number}}
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
 * Vráti štatistiky veku zo zoznamu vekov.
 * @param {Array<number>} ages - Zoznam vekov.
 * @returns {{averageAge:number, minAge:number, maxAge:number, medianAge:number}}
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
 * Spočíta median workload a priemerný workload žien.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {{medianWorkload:number|null, averageWomenWorkload:number|null}}
 */
function getWorkloadStats(employees) {
  const workloads = employees.map(e => e.workload);
  const women = employees.filter(e => e.gender === "female").map(e => e.workload);

  const med = median(workloads);
  const avgWomen =
    women.length ? Number((women.reduce((a, b) => a + b, 0) / women.length).toFixed(1)) : null;

  return {
    medianWorkload: med,
    averageWomenWorkload: avgWomen,
  };
}

/**
 * Vráti kompletné štatistiky zamestnancov.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {object} Kompletné štatistiky.
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
 * Hlavný vstupný bod – vygeneruje dáta a vráti ich štatistiky.
 * @param {{count:number, age:{min:number,max:number}}} dtoIn - Vstupné parametre.
 * @returns {object} Štatistiky zamestnancov.
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
