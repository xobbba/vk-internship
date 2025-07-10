import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Slider, Checkbox, FormControlLabel } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { runInAction } from 'mobx';

const FilterPanel: React.FC = observer(() => {
  const store = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const genres = searchParams.get('genres')?.split(',') || [];
    const ratingFrom = Number(searchParams.get('ratingFrom')) || 0;
    const ratingTo = Number(searchParams.get('ratingTo')) || 10;
    const yearFrom = Number(searchParams.get('yearFrom')) || 1990;
    const yearTo = Number(searchParams.get('yearTo')) || new Date().getFullYear();
    if (genres.length || ratingFrom || ratingTo !== 10 || yearFrom !== 1990 || yearTo !== new Date().getFullYear()) {
      runInAction(() => {
        store.selectedGenres = genres;
        store.ratingRange = [ratingFrom, ratingTo];
        store.yearRange = [yearFrom, yearTo];
        store.movies = [];
        store.page = 1;
        store.fetchMovies();
      });
    }
  }, [searchParams, store]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (store.selectedGenres.length) params.set('genres', store.selectedGenres.join(','));
    if (store.ratingRange[0] !== 0 || store.ratingRange[1] !== 10) {
      params.set('ratingFrom', store.ratingRange[0].toString());
      params.set('ratingTo', store.ratingRange[1].toString());
    }
    if (store.yearRange[0] !== 1990 || store.yearRange[1] !== new Date().getFullYear()) {
      params.set('yearFrom', store.yearRange[0].toString());
      params.set('yearTo', store.yearRange[1].toString());
    }
    setSearchParams(params);
  }, [store.selectedGenres, store.ratingRange, store.yearRange, setSearchParams]);

  return (
    <div>
      <Slider
        value={store.ratingRange}
        onChange={(e, v) => store.setRatingRange(v as number[])}
        min={0}
        max={10}
        valueLabelDisplay="auto"
      />
      <Slider
        value={store.yearRange}
        onChange={(e, v) => store.setYearRange(v as number[])}
        min={1990}
        max={new Date().getFullYear()}
        valueLabelDisplay="auto"
      />
      {store.genres.map((genre) => (
        <FormControlLabel
          control={<Checkbox checked={store.selectedGenres.includes(genre)} onChange={() => store.toggleGenre(genre)} />}
          label={genre}
          key={genre}
        />
      ))}
    </div>
  );
});

export default FilterPanel;