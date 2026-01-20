import { useEffect, useState } from 'react'
import css from './App.module.css'
import 'modern-normalize';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from "../../services/movieService"
import type { Movie } from "../../types/movie";
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage]=useState(1)
  const [selectedMovie,setSelectedMovie]=useState<Movie| null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  const handleSelectedMovie = (movie:Movie) =>{
    setIsModalOpen(true)
    setSelectedMovie(movie)
  }

  const { data, isSuccess,isError,isLoading } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage ),
    enabled: query!='',
    placeholderData: keepPreviousData,
  });
 
  const handleSearch = async (searchQuery: string) => {
  setSelectedMovie(null)
  setCurrentPage(1);
  setQuery(searchQuery)
}
const totalPages=data?.total_pages ?? 0;
 const movies: Movie[] = data?.results ?? [];
 const noMovies = movies.length == 0;
 useEffect(()=>{
    if(noMovies && isSuccess){
      toast.error("No movies found for your request.")
    }
 }, [noMovies, isSuccess])
  return (
    <> 
      <SearchBar onSubmit={handleSearch}/>
      {isSuccess && totalPages>1 && (
        <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        />
      )}
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
