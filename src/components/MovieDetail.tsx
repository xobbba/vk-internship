import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useEffect } from 'react';

const MovieDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const store = useStore();

  useEffect(() => {
    if (id) store.fetchMovieDetail(id);
  }, [id, store]);

  const movie = store.selectedMovie;

  if (!movie) return <div>Загрузка...</div>;

  return (
    <Card style={{ maxWidth: '500px', margin: '20px auto' }}>
      {movie.poster && <CardMedia component="img" height="400" image={movie.poster.url} alt={movie.name || 'Без названия'} />}
      <CardContent>
        <Typography variant="h5">{movie.name || 'Без названия'}</Typography>
        <Typography>Описание: {movie.description || movie.shortDescription || 'Нет описания'}</Typography>
        <Typography>Рейтинг: {(movie.rating.kp || movie.rating.imdb || 0).toFixed(1)}</Typography>
        <Typography>Дата выхода: {movie.year}</Typography>
        <Typography>Жанры: {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</Typography>
        <button onClick={() => store.addToFavorites(movie)}>Добавить в избранное</button>
      </CardContent>
    </Card>
  );
});

export default MovieDetail;