export interface Lifter {
  name: string;
  birthYear: number;
  country: string;
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
  wilks: number;
  gender: 'male' | 'female';
}

export const liftersData: Lifter[] = [
  // Men's data
  {
    name: "Perkins Austin",
    birthYear: 1999,
    country: "U.S.America",
    squat: 311.0,
    bench: 200.0,
    deadlift: 325.0,
    total: 836.0,
    wilks: 123.82,
    gender: 'male'
  },
  {
    name: "Bakkelund Kjell",
    birthYear: 1988,
    country: "Norway",
    squat: 270.0,
    bench: 205.0,
    deadlift: 340.0,
    total: 815.0,
    wilks: 119.9,
    gender: 'male'
  },
  {
    name: "Omisakin Ade",
    birthYear: 1998,
    country: "Great Britain",
    squat: 305.5,
    bench: 192.5,
    deadlift: 363.0,
    total: 861.0,
    wilks: 119.37,
    gender: 'male'
  },
  {
    name: "Hedlund Gustav",
    birthYear: 1995,
    country: "Sweden",
    squat: 327.5,
    bench: 212.5,
    deadlift: 355.0,
    total: 895.0,
    wilks: 117.39,
    gender: 'male'
  },
  {
    name: "Rouska Ashton",
    birthYear: 1997,
    country: "U.S.America",
    squat: 365.0,
    bench: 210.0,
    deadlift: 365.0,
    total: 940.5,
    wilks: 117.22,
    gender: 'male'
  },
  {
    name: "Kengamu Jurins",
    birthYear: 1988,
    country: "Great Britain",
    squat: 310.0,
    bench: 185.0,
    deadlift: 350.0,
    total: 845.0,
    wilks: 117.22,
    gender: 'male'
  },
  {
    name: "Orhii Russel",
    birthYear: 1994,
    country: "U.S.America",
    squat: 321.0,
    bench: 187.5,
    deadlift: 335.0,
    total: 843.5,
    wilks: 117.01,
    gender: 'male'
  },
  {
    name: "Garcia Jonathan",
    birthYear: 1988,
    country: "U.S.America",
    squat: 278.0,
    bench: 178.0,
    deadlift: 265.0,
    total: 715.5,
    wilks: 111.94,
    gender: 'male'
  },
  {
    name: "Tarinidis Panagiotis",
    birthYear: 1994,
    country: "France",
    squat: 250.0,
    bench: 178.0,
    deadlift: 285.0,
    total: 713.0,
    wilks: 111.41,
    gender: 'male'
  },
  {
    name: "Senumong Kasemsand",
    birthYear: 1995,
    country: "Thailand",
    squat: 255.0,
    bench: 155.0,
    deadlift: 297.5,
    total: 707.5,
    wilks: 110.91,
    gender: 'male'
  },
  {
    name: "Olivares Jesus",
    birthYear: 1998,
    country: "U.S.America",
    squat: 455.0,
    bench: 262.5,
    deadlift: 395.0,
    total: 1112.5,
    wilks: 110.79,
    gender: 'male'
  },
  {
    name: "Carpio Wascar",
    birthYear: 1997,
    country: "U.S.America",
    squat: 222.5,
    bench: 147.5,
    deadlift: 267.5,
    total: 637.5,
    wilks: 105.49,
    gender: 'male'
  },
  {
    name: "Krastev Emil",
    birthYear: 1997,
    country: "Bulgaria",
    squat: 312.5,
    bench: 237.5,
    deadlift: 350.0,
    total: 895.0,
    wilks: 105.45,
    gender: 'male'
  },
  // Women's data
  {
    name: "Sitko Agata",
    birthYear: 2002,
    country: "Poland",
    squat: 205.0,
    bench: 160.0,
    deadlift: 262.0,
    total: 627.0,
    wilks: 127.35,
    gender: 'female'
  },
  {
    name: "Muluh Sonita",
    birthYear: 1996,
    country: "Belgium",
    squat: 311.0,
    bench: 152.5,
    deadlift: 267.5,
    total: 731.0,
    wilks: 123.94,
    gender: 'female'
  },
  {
    name: "Bavoil Prescillia",
    birthYear: 1993,
    country: "France",
    squat: 225.0,
    bench: 125.0,
    deadlift: 237.5,
    total: 585.0,
    wilks: 123.83,
    gender: 'female'
  },
  {
    name: "Jacob Jade",
    birthYear: 2001,
    country: "France",
    squat: 188.0,
    bench: 100.0,
    deadlift: 231.5,
    total: 519.5,
    wilks: 122.55,
    gender: 'female'
  },
  {
    name: "Lawrence Amanda",
    birthYear: 1997,
    country: "U.S.America",
    squat: 247.5,
    bench: 135.0,
    deadlift: 260.0,
    total: 642.5,
    wilks: 121.85,
    gender: 'female'
  },
  {
    name: "Bostrom Alba",
    birthYear: 2001,
    country: "Sweden",
    squat: 193.0,
    bench: 133.5,
    deadlift: 227.5,
    total: 554.0,
    wilks: 121.39,
    gender: 'female'
  },
  {
    name: "Scanlon Meghan",
    birthYear: 1988,
    country: "U.S.America",
    squat: 202.5,
    bench: 140.0,
    deadlift: 220.0,
    total: 552.5,
    wilks: 121.38,
    gender: 'female'
  },
  {
    name: "Espinal Jessica",
    birthYear: 2001,
    country: "U.S.America",
    squat: 150.0,
    bench: 97.5,
    deadlift: 186.0,
    total: 433.5,
    wilks: 121.07,
    gender: 'female'
  },
  {
    name: "Corrigan Evie",
    birthYear: 1996,
    country: "New Zealand",
    squat: 170.0,
    bench: 107.5,
    deadlift: 200.0,
    total: 477.5,
    wilks: 120.87,
    gender: 'female'
  },
  {
    name: "Chapon Tiffany",
    birthYear: 2001,
    country: "France",
    squat: 165.5,
    bench: 97.5,
    deadlift: 170.0,
    total: 433.0,
    wilks: 120.54,
    gender: 'female'
  },
  {
    name: "Tongotea Karlina",
    birthYear: 1992,
    country: "New Zealand",
    squat: 217.5,
    bench: 130.0,
    deadlift: 245.0,
    total: 592.5,
    wilks: 117.33,
    gender: 'female'
  },
  {
    name: "Butters Bobbie",
    birthYear: 1994,
    country: "Great Britain",
    squat: 188.5,
    bench: 113.0,
    deadlift: 190.0,
    total: 491.5,
    wilks: 117.01,
    gender: 'female'
  },
  {
    name: "Schlater Brittany",
    birthYear: 1991,
    country: "Canada",
    squat: 285.0,
    bench: 157.5,
    deadlift: 267.5,
    total: 710.0,
    wilks: 116.33,
    gender: 'female'
  }
].sort((a, b) => b.wilks - a.wilks);
