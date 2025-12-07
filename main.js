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

const genders = ["male", "female"];
const workloads = [10, 20, 30, 40];

function main(dtoIn) {
  const people = [];

  const today = new Date();

  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() - dtoIn.age.max);

  const minDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - dtoIn.age.min);

  for (let i = 0; i < dtoIn.count; i++) {
    const birthTimestamp =
      minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
    const birthdate = new Date(birthTimestamp).toISOString();

    const person = {
      name: names[Math.floor(Math.random() * names.length)],
      surname: surnames[Math.floor(Math.random() * surnames.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      workload: workloads[Math.floor(Math.random() * workloads.length)],
      birthdate: birthdate
    };

    people.push(person);
  }

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;


  const ages = [];

  const womenWorkloads = [];

  for (let i = 0; i < people.length; i++) {
    const person = people[i];

    if (person.workload === 10) workload10++;
    if (person.workload === 20) workload20++;
    if (person.workload === 30) workload30++;
    if (person.workload === 40) workload40++;


    const birth = new Date(person.birthdate);
    const diff = today - birth;
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    ages.push(age);

    if (person.gender === "female") {
      womenWorkloads.push(person.workload);
    }
  }

  let sumAge = 0;
  for (let i = 0; i < ages.length; i++) {
    sumAge += ages[i];
  }
  const averageAge = Math.round((sumAge / ages.length) * 10) / 10;

  let minAge = ages[0];
  let maxAge = ages[0];
  for (let i = 1; i < ages.length; i++) {
    if (ages[i] < minAge) minAge = ages[i];
    if (ages[i] > maxAge) maxAge = ages[i];
  }

  const agesSorted = ages.slice();
  agesSorted.sort(function (a, b) { return a - b; });

  let medianAge;
  if (agesSorted.length % 2 === 1) {
    medianAge = agesSorted[Math.floor(agesSorted.length / 2)];
  } else {
    const a = agesSorted[agesSorted.length / 2 - 1];
    const b = agesSorted[agesSorted.length / 2];
    medianAge = (a + b) / 2;
  }

  const workloadsCopy = workloads.slice();
  workloadsCopy.sort(function (a, b) { return a - b; });

  const wlen = workloadsCopy.length;
  let medianWorkload;
  if (wlen % 2 === 1) {
    medianWorkload = workloadsCopy[Math.floor(wlen / 2)];
  } else {
    medianWorkload = (workloadsCopy[wlen/2 - 1] + workloadsCopy[wlen/2]) / 2;
  }

  let womenAvg = 0;
  if (womenWorkloads.length > 0) {
    let sum = 0;
    for (let i = 0; i < womenWorkloads.length; i++) {
      sum += womenWorkloads[i];
    }
    womenAvg = sum / womenWorkloads.length;
  }


  const sortedPeople = people.slice();
  sortedPeople.sort(function (a, b) {
    return a.workload - b.workload;
  });

  return {
    total: people.length,
    workload10: workload10,
    workload20: workload20,
    workload30: workload30,
    workload40: workload40,
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: womenAvg,
    sortedByWorkload: sortedPeople
  };
}

console.log(main(dtoIn));