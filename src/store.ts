import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { useLocalObservable } from 'mobx-react-lite';

interface Movie {
  id: number;
  name: string | null;
  year: number;
  rating: { kp: number; imdb: number; filmCritics: number; russianFilmCritics: number; await: number };
  poster?: { url: string } | null;
  description?: string;
  releaseDate?: string;
  genres?: { name: string }[];
  shortDescription?: string;
  ageRating?: string | null;
}

interface ApiResponse {
  docs: Movie[];
  page: number;
  limit: number;
}

class MovieStore {
  movies: Movie[] = [];
  favorites: Movie[] = JSON.parse(localStorage.getItem('favorites') || '[]');
  selectedMovie: Movie | null = null;
  page = 1;
  hasMore = true;
  ratingRange = [0, 10];
  yearRange = [1990, new Date().getFullYear()];
  selectedGenres: string[] = [];
  genres: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies() {
    if (!this.hasMore) return;
    try {
      console.log('Fetching movies, page:', this.page, 'filters:', { ratingRange: this.ratingRange, yearRange: this.yearRange, genres: this.selectedGenres });
      const response = await axios.get<ApiResponse>('https://api.kinopoisk.dev/v1.4/movie', {
        params: {
          page: this.page,
          limit: 50,
          ratingFrom: this.ratingRange[0],
          ratingTo: this.ratingRange[1],
          yearFrom: this.yearRange[0],
          yearTo: this.yearRange[1],
          genres: this.selectedGenres.join(','),
        },
        headers: {
          'X-API-KEY': process.env.REACT_APP_KINOPOISK_API_KEY,
        },
      });
      runInAction(() => {
        // Проверка на дубликаты перед добавлением
        const newMovies = response.data.docs.filter(newMovie => !this.movies.some(existing => existing.id === newMovie.id));
        this.movies = this.page === 1 ? newMovies : [...this.movies, ...newMovies];
        this.page += 1;
        this.hasMore = response.data.docs.length === 50;
        if (this.genres.length === 0) this.genres = [...new Set(response.data.docs.flatMap(m => m.genres?.map(g => g.name) || []))];
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  async fetchMovieDetail(id: string) {
    try {
      const response = await axios.get<Movie>(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
        headers: {
          'X-API-KEY': process.env.REACT_APP_KINOPOISK_API_KEY,
        },
      });
      runInAction(() => {
        this.selectedMovie = response.data;
      });
    } catch (error) {
      console.error('Error fetching movie detail:', error);
    }
  }

  setRatingRange(range: number[]) {
    runInAction(() => {
      this.ratingRange = range;
      this.movies = [];
      this.page = 1;
      this.fetchMovies();
    });
  }

  setYearRange(range: number[]) {
    runInAction(() => {
      this.yearRange = range;
      this.movies = [];
      this.page = 1;
      this.fetchMovies();
    });
  }

  toggleGenre(genre: string) {
    runInAction(() => {
      this.selectedGenres = this.selectedGenres.includes(genre)
        ? this.selectedGenres.filter(g => g !== genre)
        : [...this.selectedGenres, genre];
      this.movies = [];
      this.page = 1;
      this.fetchMovies();
    });
  }

  addToFavorites(movie: Movie) {
    const confirm = window.confirm(`Добавить ${movie.name || 'фильм'} в избранное?`);
    if (confirm && !this.favorites.some(f => f.id === movie.id)) {
      runInAction(() => {
        this.favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      });
    }
  }

  removeFromFavorites(id: number) {
    runInAction(() => {
      this.favorites = this.favorites.filter(f => f.id !== id);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    });
  }
}

const store = new MovieStore();
export const useStore = () => useLocalObservable(() => store);