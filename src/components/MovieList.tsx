import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Grid, GridProps, Card, CardMedia, CardContent, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';

const MovieList = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.fetchMovies();
  }, [store]);

  if (store.movies.length === 0) {
    return <div>Загрузка...</div>;
  }

  return (
    <InfiniteScroll
      dataLength={store.movies.length}
      next={store.fetchMovies}
      hasMore={store.hasMore}
      loader={<h4>Загрузка еще...</h4>}
    >
      <Grid container spacing={2}>
        {store.movies.map((movie) => (
          <Grid {...({ item: true, xs: 12, sm: 6, md: 4 } as GridProps)} key={movie.id}>
            <Card>
              {movie.poster?.url ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={movie.poster.url}
                  alt={movie.name || 'Без названия'}
                />
              ) : (
                <div style={{ height: '140px' }} />
              )}
              <CardContent>
                <Typography variant="h6">{movie.name || 'Без названия'}</Typography>
                <Typography variant="body2">Год: {movie.year || 'N/A'}</Typography>
                <Typography variant="body2">Рейтинг: {(movie.rating.kp || movie.rating.imdb || 0).toFixed(1)}</Typography>
                <button onClick={() => store.addToFavorites(movie)}>Добавить в избранное</button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
});

export default MovieList;