import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesResponse{
    page: number;
    results: Movie[];
    total_pages: number;
}

const API_URL = "https://api.themoviedb.org/3/search/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;


export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  if (!TMDB_TOKEN) {
    throw new Error('TMDB token is missing');
  }

  const response = await axios.get<MoviesResponse>(API_URL, {
    params: {
      query,
      page
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  });

  return response.data;
};