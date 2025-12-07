/**
 * Vyberie náhodnú položku z poľa.
 * @param {Array} arr
 * @returns {*}
 */
function pickRandom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Vygeneruje náhodný dátum v rozsahu.
 * @param {Date} minDate
 * @param {Date} maxDate
 * @returns {string} ISO dátum
 */
function generateRandomDate(minDate, maxDate) {
  const ts = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * Vytvorí jednu osobu.
 * @param {Date} minDate
 * @param {Date} maxDate
 * @returns {object}
 */
function generatePerson(minDate, maxDate) {
  return {
    name: pickRandom(names),
    surname: pickRandom(surnames),
    gender: pickRandom(gender),
    workload: pickRandom(workload),
    birthdate: generateRandomDate(minDate, maxDate),
  };
}

/**
 * Generovanie zamestnancov.
 * @param {object} dtoIn - vstupné parametre
 * @returns {{people: Array, workloadStats: object}}
 */
export function main(dtoIn) {
  const today = new Date();

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - dtoIn.age.max);

  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - dtoIn.age.min);

  const people = [];
  const workloadStats = { 10: 0, 20: 0, 30: 0, 40: 0 };

  for (let i = 0; i < dtoIn.count; i++) {
    const person = generatePerson(minDate, maxDate);
    people.push(person);

    workloadStats[person.workload] += 1;
  }

  return { people, workloadStats };
}