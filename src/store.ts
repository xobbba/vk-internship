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
  total: number;
}

class MovieStore {
  movies: Movie[] = [];
  favorites: Movie[] = JSON.parse(localStorage.getItem('favorites') || '[]');
  selectedMovie: Movie | null = null;
  page = 1;
  hasMore = true;
  ratingRange = [0, 10];
  yearRange = [1900, new Date().getFullYear()];
  selectedGenres: string[] = [];
  genres: string[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies() {
    if (!this.hasMore || this.isLoading) return;
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const params: any = {
        page: this.page,
        limit: 50,
        selectFields: ['id', 'name', 'year', 'rating', 'poster', 'genres', 'description', 'shortDescription', 'ageRating'],
      };
      if (this.ratingRange[0] !== 0 || this.ratingRange[1] !== 10) {
        params['rating.kp'] = `${this.ratingRange[0]}-${this.ratingRange[1]}`;
      }
      if (this.yearRange[0] !== 1900 || this.yearRange[1] !== new Date().getFullYear()) {
        params.year = `${this.yearRange[0]}-${this.yearRange[1]}`;
      }
      if (this.selectedGenres.length) {
        params['genres.name'] = this.selectedGenres.join(',');
      }
      console.log('Request params:', params);
      const response = await axios.get<ApiResponse>('https://api.kinopoisk.dev/v1.4/movie', {
        params,
        headers: {
          'X-API-KEY': process.env.REACT_APP_KINOPOISK_API_KEY,
        },
      });
      runInAction(() => {
        const newMovies = response.data.docs.filter(movie => movie.name && movie.name.trim() !== '' && movie.poster?.url);
        const filteredNewMovies = newMovies.filter(newMovie => !this.movies.some(existing => existing.id === newMovie.id));
        this.movies = this.page === 1 ? filteredNewMovies : [...this.movies, ...filteredNewMovies];
        this.page += 1;
        this.hasMore = filteredNewMovies.length === 50 && (response.data.total === 0 || this.movies.length < response.data.total);
        this.isLoading = false;
        if (this.genres.length === 0) {
          this.genres = [...new Set(response.data.docs.flatMap(m => m.genres?.map(g => g.name) || []))].filter(Boolean);
        }
        console.log('API Response:', { docs: response.data.docs.length, filtered: filteredNewMovies.length, total: response.data.total, hasMore: this.hasMore });
      });
    } catch (error: any) {
      console.error('Error fetching movies:', error.response?.data || error.message);
      runInAction(() => {
        this.hasMore = false;
        this.isLoading = false;
      });
    }
  }

  async fetchMovieDetail(id: string) {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await axios.get<Movie>(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
        headers: {
          'X-API-KEY': process.env.REACT_APP_KINOPOISK_API_KEY,
        },
      });
      runInAction(() => {
        this.selectedMovie = response.data;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error fetching movie detail:', error);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  setRatingRange(range: number[]) {
    runInAction(() => {
      this.ratingRange = range;
      this.movies = [];
      this.page = 1;
      this.hasMore = true;
      this.fetchMovies();
    });
  }

  setYearRange(range: number[]) {
    runInAction(() => {
      this.yearRange = range;
      this.movies = [];
      this.page = 1;
      this.hasMore = true;
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
      this.hasMore = true;
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