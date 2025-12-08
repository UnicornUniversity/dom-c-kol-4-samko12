const names = ["Jan", "Peter", "Maria", "Lucia"];
const surnames = ["Novak", "Hrasko", "Mrkvicka", "Smetanova"];
const gender = ["male", "female"];
const workload = [10, 20, 30, 40];

/**
 * Vyberie náhodný prvok z poľa.
 * @param {Array<*>} arr - Pole, z ktorého sa vyberá náhodná hodnota.
 * @returns {*} Náhodný prvok z dostupného poľa.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Vypočíta integer vek osoby podľa dátumu narodenia.
 * @param {string} birthIso - ISO dátum narodenia.
 * @returns {number} Integer vek osoby vypočítaný k dnešnému dátumu.
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
 * Vygeneruje náhodný dátum v ISO formáte medzi dvoma hranicami.
 * @param {Date} minDate - Dolná hranica rozsahu dátumu.
 * @param {Date} maxDate - Horná hranica rozsahu dátumu.
 * @returns {string} Náhodný ISO dátum v určenom rozsahu.
 */
function generateRandomDate(minDate, maxDate) {
  const timestamp =
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(timestamp).toISOString();
}

/**
 * Generuje zoznam zamestnancov podľa vstupných parametrov.
 * @param {{count:number, age:{min:number, max:number}}} dtoIn - Parametre generovania.
 * @returns {Array<object>} Pole vygenerovaných zamestnancov.
 */
function generateEmployeeData(dtoIn) {
  const people = [];
  const today = new Date();

  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - dtoIn.age.max);

  const maxDate = new Date(today);
  maxDate.setFullFullYear(today.getFullYear() - dtoIn.age.min);

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
 * Vráti medián číselného poľa.
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
 * @returns {{workload10:number, workload20:number, workload30:number, workload40:number}} Objekt s počtami workloadov.
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
 * Vráti štatistiky veku pre zoznam vekov.
 * @param {Array<number>} ages - Pole vekov zamestnancov.
 * @returns {{averageAge:number, minAge:number, maxAge:number, medianAge:number}} Objekt vekových štatistík.
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
 * Vráti štatistiky workloadov, vrátane mediánu a priemeru workloadu žien.
 * @param {Array<object>} employees - Zoznam zamestnancov.
 * @returns {{medianWorkload:number|null, averageWomenWorkload:number|null}} Objekt workload štatistík.
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
 * @returns {object} Kompletný objekt štatistík.
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
 * Hlavná funkcia - vygeneruje dáta a vráti ich štatistiky.
 * @param {{count:number, age:{min:number, max:number}}} dtoIn - Vstupné parametre.
 * @returns {object} Kompletné štatistiky vygenerovaných zamestnancov.
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
