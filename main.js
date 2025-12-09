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

const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

/**
 * @param {number[]} numbers
 * @returns {number}
 */
function median(numbers) {
  if (numbers.length === 0) return 0;
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = ((sorted.length / 2) | 0);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

/**
 * Vygeneruje zoznam zamestnancov.
 * @param {{count:number, age:{min:number,max:number}}} dtoIn
 * @returns {Array<{name:string,surname:string,gender:string,workload:number,birthdate:string}>}
 */
export function generateEmployeeData(dtoIn) {
  const dtoOut = [];
  const count = dtoIn.count;

  const today = new Date();

  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() - dtoIn.age.max);

  const minDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - dtoIn.age.min);

  const usedTimestamps = new Set();

  for (let i = 0; i < count; i++) {
    let birthTimestamp;
    do {
      birthTimestamp =
        minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
    } while (usedTimestamps.has(birthTimestamp));
    usedTimestamps.add(birthTimestamp);

    const birthdate = new Date(birthTimestamp).toISOString();

    dtoOut.push({
      name: names[Math.floor(Math.random() * names.length)],
      surname: surnames[Math.floor(Math.random() * surnames.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      workload: workloads[Math.floor(Math.random() * workloads.length)],
      birthdate,
    });
  }

  return dtoOut;
}

/**
 * Vypočíta štatistiky zo zoznamu zamestnancov.
 * @param {Array<{name:string,surname:string,gender:string,workload:number,birthdate:string}>} employees
 * @returns {{
 *  total:number,
 *  workload10:number,
 *  workload20:number,
 *  workload30:number,
 *  workload40:number,
 *  averageAge:number,
 *  minAge:number,
 *  maxAge:number,
 *  medianAge:number,
 *  medianWorkload:number,
 *  averageWomenWorkload:number,
 *  sortedByWorkload:Array<object>
 * }}
 */
export function getEmployeeStatistics(employees) {
  const total = employees.length;
  const now = new Date();

  const ages = [];
  const workloadsArr = [];
  let sumAge = 0;

  let minAgeReal = Infinity;
  let maxAgeReal = -Infinity;

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  let womenWorkloadSum = 0;
  let womenCount = 0;

  for (let i = 0; i < employees.length; i++) {
    const e = employees[i];

    const age =
      (now - new Date(e.birthdate)) / (1000 * 60 * 60 * 24 * 365.25);

    ages.push(age);
    sumAge += age;

    if (age < minAgeReal) minAgeReal = age;
    if (age > maxAgeReal) maxAgeReal = age;

    workloadsArr.push(e.workload);

    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    if (e.gender === "female") {
      womenWorkloadSum += e.workload;
      womenCount++;
    }
  }

  const averageAgeReal = sumAge / employees.length;
  const averageAge = Number(averageAgeReal.toFixed(1)); // 1 desatinné miesto

  const minAge = Math.floor(minAgeReal);
  const maxAge = Math.floor(maxAgeReal);
  const medianAgeReal = median(ages);
  const medianAge = Math.floor(medianAgeReal);

  const medianWorkload = median(workloadsArr);

  const averageWomenWorkload =
    womenCount > 0
      ? Number((womenWorkloadSum / womenCount).toFixed(1))
      : 0;

  const sortedByWorkload = Array.from(employees).sort(
    (a, b) => a.workload - b.workload
  );

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload,
  };
}

/**
 * @param {{count:number, age:{min:number,max:number}}} dtoIn
 * @returns {object}
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const statistics = getEmployeeStatistics(employees);
  return statistics;
}
