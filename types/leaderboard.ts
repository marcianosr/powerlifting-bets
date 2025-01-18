export type LeaderboardEntry = {
  name: string;
  email: string;
  points: number;
  menFirst?: string;
  menSecond?: string;
  menThird?: string;
  womenFirst?: string;
  womenSecond?: string;
  womenThird?: string;
};

export type CompetitionResult = {
  menFirst: string;
  menSecond: string;
  menThird: string;
  womenFirst: string;
  womenSecond: string;
  womenThird: string;
  createdAt: string;
};

export type LifterInfo = {
  name: string;
  displayName: string;
  wilks?: number;
};

export type Gender = "men" | "women";
