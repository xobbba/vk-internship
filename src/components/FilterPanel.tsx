import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Slider, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { runInAction } from 'mobx';

const FilterPanel: React.FC = observer(() => {
  const store = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLoad = useRef(true);

  useEffect(() => {
    const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
    const ratingFrom = Number(searchParams.get('ratingFrom')) || 0;
    const ratingTo = Number(searchParams.get('ratingTo')) || 10;
    const yearFrom = Number(searchParams.get('yearFrom')) || 1900;
    const yearTo = Number(searchParams.get('yearTo')) || new Date().getFullYear();

    if (initialLoad.current) {
      initialLoad.current = false;
      if (genres.length || ratingFrom !== 0 || ratingTo !== 10 || yearFrom !== 1900 || yearTo !== new Date().getFullYear()) {
        runInAction(() => {
          store.selectedGenres = genres;
          store.ratingRange = [ratingFrom, ratingTo];
          store.yearRange = [yearFrom, yearTo];
          store.movies = [];
          store.page = 1;
          store.hasMore = true;
          store.fetchMovies();
        });
      }
    }
  }, [searchParams, store]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (store.selectedGenres.length) params.set('genres', store.selectedGenres.join(','));
    if (store.ratingRange[0] !== 0 || store.ratingRange[1] !== 10) {
      params.set('ratingFrom', store.ratingRange[0].toString());
      params.set('ratingTo', store.ratingRange[1].toString());
    }
    if (store.yearRange[0] !== 1900 || store.yearRange[1] !== new Date().getFullYear()) {
      params.set('yearFrom', store.yearRange[0].toString());
      params.set('yearTo', store.yearRange[1].toString());
    }

    const currentParams = new URLSearchParams(searchParams);
    const paramsChanged = [...params.entries()].some(([key, value]) => currentParams.get(key) !== value) ||
      [...currentParams.entries()].some(([key]) => !params.has(key));

    if (paramsChanged) {
      setSearchParams(params, { replace: true });
    }
  }, [store.selectedGenres, store.ratingRange, store.yearRange, searchParams, setSearchParams]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-white rounded-xl shadow-2xl my-6 transform transition-all duration-300 hover:shadow-3xl" style={{ maxWidth: '1020px', width: '100%', marginLeft: '10px' }}>
      <Typography variant="h5" className="text-blue-900 mb-6 font-bold text-center border-b-2 border-blue-200 pb-2">
        Фильтры
      </Typography>
      <div className="mb-6">
        <Typography className="text-blue-800 mb-3 font-semibold text-center">Рейтинг: {store.ratingRange[0]} - {store.ratingRange[1]}</Typography>
        <Slider
          value={store.ratingRange}
          onChange={(e, v) => store.setRatingRange(v as number[])}
          min={0}
          max={10}
          valueLabelDisplay="auto"
          className="text-blue-600"
          sx={{
            '& .MuiSlider-thumb': { backgroundColor: '#3b82f6' },
            '& .MuiSlider-track': { backgroundColor: '#3b82f6' },
            '& .MuiSlider-rail': { backgroundColor: '#bfdbfe' },
          }}
        />
      </div>
      <div className="mb-6">
        <Typography className="text-blue-800 mb-3 font-semibold text-center">Годы: {store.yearRange[0]} - {store.yearRange[1]}</Typography>
        <Slider
          value={store.yearRange}
          onChange={(e, v) => store.setYearRange(v as number[])}
          min={1900}
          max={new Date().getFullYear()}
          valueLabelDisplay="auto"
          className="text-blue-600"
          sx={{
            '& .MuiSlider-thumb': { backgroundColor: '#3b82f6' },
            '& .MuiSlider-track': { backgroundColor: '#3b82f6' },
            '& .MuiSlider-rail': { backgroundColor: '#bfdbfe' },
          }}
        />
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {store.genres.map((genre) => (
          <FormControlLabel
            key={genre}
            control={
              <Checkbox
                checked={store.selectedGenres.includes(genre)}
                onChange={() => store.toggleGenre(genre)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 w-6"
                sx={{ '&.Mui-checked': { color: '#3b82f6' } }}
              />
            }
            label={<span className="text-blue-900 hover:text-blue-700 transition-colors duration-200">{genre}</span>}
            className="m-1 bg-white rounded-full px-3 py-1 shadow-md hover:shadow-lg"
          />
        ))}
      </div>
      {store.isLoading && <p className="text-center text-blue-600 mt-4 animate-pulse">Загрузка фильтров...</p>}
    </div>
  );
});

export default FilterPanel;