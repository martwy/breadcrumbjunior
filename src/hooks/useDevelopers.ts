import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL_DEVELOPERS } from "../utils/constants";
import { Developer } from "../utils/types";

type ApiResponse = { results: Developer[] };
export default function useDevelopers() {
  const { data } = useQuery({
    queryKey: ["resultsDevs"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse>(API_URL_DEVELOPERS);
      return data;
    },
  });

  if (!data) {
    return undefined;
  }
  const { results } = data;
  const sanitizedResults = results.map((result) => {
    const { id, name, games } = result;
    return { id, name, games };
  });
  return sanitizedResults;
}
