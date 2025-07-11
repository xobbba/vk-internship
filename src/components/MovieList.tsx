import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { Grid, GridProps } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MovieList = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.fetchMovies();
  }, [store]);

  if (store.movies.length === 0) {
    return <div className="text-center text-gray-500">Загрузка...</div>;
  }

  return (
    <InfiniteScroll
      dataLength={store.movies.length}
      next={store.fetchMovies}
      hasMore={store.hasMore}
      loader={<h4 className="text-center text-gray-500">Загрузка еще...</h4>}
      endMessage={<p className="text-center text-gray-500">Больше фильмов нет</p>}
    >
      <Grid container spacing={2} className="p-4">
        {store.movies.map((movie) => (
          <Grid {...({ item: true, xs: 12, sm: 6, md: 4 } as GridProps)} key={movie.id}>
            <Link to={`/movie/${movie.id}`} className="block">
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300" style={{ width: '240px', height: '400px' }}>
                <div className="w-full h-90 overflow-hidden">
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
                <div className="p-2 flex-grow flex flex-col justify-between overflow-hidden" style={{ height: 'calc(460px - 192px)' }}>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{movie.name || 'Без названия'}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">Год: {movie.year || 'N/A'}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">Рейтинг: {(movie.rating.kp || movie.rating.imdb || 0).toFixed(1)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); store.addToFavorites(movie); }}
                    className="mt-2 w-full bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    style={{ height: '32px' }}
                  >
                    Добавить в избранное
                  </button>
                </div>
              </div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
});

export default MovieList;