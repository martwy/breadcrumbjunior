import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Game } from "../utils/types";

type ApiResponse = { results: Game[] };
export default function useGames(gameId: number | undefined) {
  const { data } = useQuery({
    queryKey: ["gameDetails", gameId],
    enabled: gameId ? true : false,
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse>(
        `https://api.rawg.io/api/games?key=e75bdf42b8ea43e5bd76af97ba42c1b1&page_size=10&developers=${gameId}`
      );
      return data;
    },
  });
  if (!data) {
    return null;
  }

  const { results } = data;
  const sanitizedResultsGame = results.map((result) => {
    const { id, name, rating, genres, released } = result;
    return { id, name, rating, genres, released };
  });

  return sanitizedResultsGame;
}
