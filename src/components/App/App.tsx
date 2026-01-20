import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import 'modern-normalize';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from "../../services/movieService"
import type { Movie } from "../../types/movie";
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie,setSelectedMovie]=useState<Movie| null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [isError, setIsError]= useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  const handleSelectedMovie = (movie:Movie) =>{
    setIsModalOpen(true)
    setSelectedMovie(movie)
  }

 
  const handleSearch = async (query: string) => {
  setMovies([]);
  setSelectedMovie(null)
  setIsLoading(true);
  setIsError(false);

  try {
    const data = await fetchMovies({ query });

    if (data.results.length === 0) {
      toast.error("No movies found for your request.");
      return;
    }

    setMovies(data.results);
  } catch {
    setIsError(true);
    toast.error("Something went wrong. Try again.");
  } finally {
    setIsLoading(false);
  }
}


  return (
    <>
       <Toaster
      position="top-center"
      reverseOrder={false}
      />
      <SearchBar onSubmit={handleSearch}/>
      {isLoading && <Loader/>}
      {isError && <ErrorMessage />}
      {!isError && movies.length > 0 && (
      <MovieGrid movies={movies} onSelect={handleSelectedMovie} />
      )}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

    </>
  )
}
