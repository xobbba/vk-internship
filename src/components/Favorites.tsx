import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Grid, GridProps, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  width: '100%',
  height: '300px', // Фиксированная высота
  display: 'flex',
  flexDirection: 'column',
});

const Favorites: React.FC = observer(() => {
  const store = useStore();

  return (
    <Grid container spacing={2}>
      {store.favorites.map((movie) => (
        <Grid {...({ item: true, xs: 12, sm: 6, md: 4 } as GridProps)} key={movie.id}>
          <StyledCard>
            {movie.poster && <CardMedia component="img" height="140" image={movie.poster.url} alt={movie.name || 'Без названия'} style={{ objectFit: 'cover' }} />}
            <CardContent style={{ flexGrow: 1 }}>
              <Typography>{movie.name || 'Без названия'}</Typography>
              <Typography>{movie.year}</Typography>
              <Typography>{(movie.rating.kp || movie.rating.imdb || 0).toFixed(1)}</Typography>
              <button onClick={() => store.removeFromFavorites(movie.id)}>Удалить из избранного</button>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
});

export default Favorites;