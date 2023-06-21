export type Game = {
  id: number;
  name: string;
  rating: number;
  genres: {
    name: string;
  }[];
  released: string;
};

export type Developer = {
  id: number;
  name: string;
  gamesCount: number;
  games: {
    id: number;
    name: string;
  }[];
};
