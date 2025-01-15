interface Lifter {
    name: string;
    birthYear: number;
    country: string;
    squat: number;
    bench: number;
    deadlift: number;
    total: number;
    points: number;
    isReserve: boolean;
}

export const liftersData: Lifter[] = [
    {
        name: "Perkins Austin",
        birthYear: 1999,
        country: "U.S.America",
        squat: 311.0,
        bench: 200.0,
        deadlift: 325.0,
        total: 836.0,
        points: 123.82,
        isReserve: false,
    },
    {
        name: "Bakkelund Kjell",
        birthYear: 1988,
        country: "Norway",
        squat: 270.0,
        bench: 205.0,
        deadlift: 340.0,
        total: 815.0,
        points: 119.9,
        isReserve: false,
    },
    {
        name: "Omisakin Ade",
        birthYear: 1998,
        country: "Great Britain",
        squat: 305.5,
        bench: 192.5,
        deadlift: 363.0,
        total: 861.0,
        points: 119.37,
        isReserve: false,
    },
    {
        name: "Hedlund Gustav",
        birthYear: 1995,
        country: "Sweden",
        squat: 327.5,
        bench: 212.5,
        deadlift: 355.0,
        total: 895.0,
        points: 117.39,
        isReserve: false,
    },
    {
        name: "Rouska Ashton",
        birthYear: 1997,
        country: "U.S.America",
        squat: 365.0,
        bench: 210.0,
        deadlift: 365.0,
        total: 940.5,
        points: 117.22,
        isReserve: false,
    },
    {
        name: "Kengamu Jurins",
        birthYear: 1988,
        country: "Great Britain",
        squat: 310.0,
        bench: 185.0,
        deadlift: 350.0,
        total: 845.0,
        points: 117.22,
        isReserve: false,
    },
    {
        name: "Orhii Russel",
        birthYear: 1994,
        country: "U.S.America",
        squat: 321.0,
        bench: 187.5,
        deadlift: 335.0,
        total: 843.5,
        points: 117.01,
        isReserve: false,
    },
    {
        name: "Garcia Jonathan",
        birthYear: 1988,
        country: "U.S.America",
        squat: 278.0,
        bench: 178.0,
        deadlift: 265.0,
        total: 715.5,
        points: 111.94,
        isReserve: true,
    },
    {
        name: "Tarinidis Panagiotis",
        birthYear: 1994,
        country: "France",
        squat: 250.0,
        bench: 178.0,
        deadlift: 285.0,
        total: 713.0,
        points: 111.41,
        isReserve: false,
    },
    {
        name: "Senumong Kasemsand",
        birthYear: 1995,
        country: "Thailand",
        squat: 255.0,
        bench: 155.0,
        deadlift: 297.5,
        total: 707.5,
        points: 110.91,
        isReserve: false,
    },
    {
        name: "Olivares Jesus",
        birthYear: 1998,
        country: "U.S.America",
        squat: 455.0,
        bench: 262.5,
        deadlift: 395.0,
        total: 1112.5,
        points: 110.79,
        isReserve: false,
    },
    {
        name: "Carpio Wascar",
        birthYear: 1997,
        country: "U.S.America",
        squat: 222.5,
        bench: 147.5,
        deadlift: 267.5,
        total: 637.5,
        points: 105.49,
        isReserve: false,
    },
    {
        name: "Krastev Emil",
        birthYear: 1997,
        country: "Bulgaria",
        squat: 312.5,
        bench: 237.5,
        deadlift: 350.0,
        total: 895.0,
        points: 105.45,
        isReserve: false,
    },
].sort((a, b) => b.points - a.points);
