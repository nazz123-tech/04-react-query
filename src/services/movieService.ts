import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesResponse{
    page: number;
    results: Movie[];
    total_pages: number;
}

const API_URL = "https://api.themoviedb.org/3/search/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesParams {
  query: string;
  page?: number;
}

export const fetchMovies = async (
  params: FetchMoviesParams
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(API_URL, {
    params,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  });

  return response.data;
};