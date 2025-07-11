import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Grid, GridProps } from '@mui/material';
import { Link } from 'react-router-dom';

const Favorites: React.FC = observer(() => {
  const store = useStore();

  return (
    <Grid container spacing={2} className="p-4">
      {store.favorites.length === 0 ? (
        <p className="text-center text-gray-500">Нет избранных фильмов</p>
      ) : (
        store.favorites.map((movie) => (
          <Grid {...({ item: true, xs: 12, sm: 6, md: 4 } as GridProps)} key={movie.id}>
            <Link to={`/movie/${movie.id}`} className="block">
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300" style={{ width: '240px', height: '400px' }}>
                <div className="w-full h-48 overflow-hidden">
                  {movie.poster?.url ? (
                    <img
                      src={movie.poster.url}
                      alt={movie.name || 'Без названия'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/img/noImage.png"
                      alt="No image available"
                      className="w-full h-full object-cover bg-gray-200"
                    />
                  )}
                </div>
                <div className="p-2 flex-grow flex flex-col justify-between overflow-hidden" style={{ height: 'calc(400px - 192px)' }}>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{movie.name || 'Без названия'}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">Год: {movie.year || 'N/A'}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">Рейтинг: {(movie.rating.kp || movie.rating.imdb || 0).toFixed(1)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); store.removeFromFavorites(movie.id); }}
                    className="mt-2 w-full bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    style={{ height: '32px' }}
                  >
                    Удалить из избранного
                  </button>
                </div>
              </div>
            </Link>
          </Grid>
        ))
      )}
    </Grid>
  );
});

export default Favorites;