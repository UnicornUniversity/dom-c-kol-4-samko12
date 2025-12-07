const dtoIn = {
  count: 6,
  age: {
    min: 19,
    max: 35,
  },
};

const names = [
  "Jan","Petr","Pavel","Martin","Tomáš","Jakub","Lukáš","Jiří","David","Josef",
  "Adam","Matěj","Filip","Václav","Daniel","Marek","Jaroslav","Štěpán","Ondřej","Karel",
  "Vojtěch","Michal","Roman","Zdeněk","Radek","Oldřich","Robert","Aleš","Milan","Richard",
  "Tereza","Anna","Eliška","Karolína","Adéla","Kristýna","Natálie","Veronika","Markéta","Barbora",
  "Lucie","Klára","Kateřina","Nikola","Monika","Gabriela","Simona","Alena","Iveta","Jana"
];

const surnames = [
  "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
  "Mareš","Pospíšil","Hájek","Jelínek","Král","Růžička","Beneš","Fiala","Sedláček","Doležal",
  "Zeman","Urban","Vaněk","Kolář","Štěpánek","Polák","Kříž","Pokorný","Konečný","Malý",
  "Kovář","Bláha","Strnad","Holý","Soukup","Matoušek","Tichý","Hlaváček","Kočí","Bečka",
  "Suchý","Zajíček","Pazdera","Leoš","Staňek","Burda","Mašek","Čížek","Stehlík","Gregor"
];

const gender = ["male", "female"];
const workload = [10, 20, 30, 40];

/**
 * Vyberie náhodnú položku z poľa.
 * @param {Array} 
 * @returns {*} - random číslo
 */
function pickRandom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Vygeneruje náhodný dátum v rozsahu.
 * @param {Date} 
 * @param {Date} 
 * @returns {string} - ISO dátum
 */
function generateRandomDate(minDate, maxDate) {
  const ts = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  return new Date(ts).toISOString();
}

/**
 * Vytvorí jednu osobu.
 * @param {Date} 
 * @param {Date} 
 * @returns {object} - vytvorenie osoby
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
 * @returns {{people: Array, workloadStats: object}} - generovanie zamestnancov
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

// Test výstupu
console.log(main(dtoIn));