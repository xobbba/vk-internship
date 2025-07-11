import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { useEffect } from 'react';

const MovieDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const store = useStore();

  useEffect(() => {
    if (id) store.fetchMovieDetail(id);
  }, [id, store]);

  const movie = store.selectedMovie;

  if (!movie) return <div className="text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="my-8 p-6 ml-2 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl" style={{ maxWidth: '1020px', width: '100%'}}>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/3">
          {movie.poster?.url ? (
            <img
              src={movie.poster.url}
              alt={movie.name || 'Без названия'}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          ) : (
            <img
              src="/img/noImage.png"
              alt="No image available"
              className="w-full h-auto rounded-lg shadow-md bg-gray-200 object-cover"
            />
          )}
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">{movie.name || 'Без названия'}</h2>
          <p className="text-gray-700 mb-4">{movie.description || movie.shortDescription || 'Нет описания'}</p>
          <p className="text-gray-600 mb-2"><strong>Рейтинг:</strong> {(movie.rating.kp || movie.rating.imdb || 0).toFixed(1)}</p>
          <p className="text-gray-600 mb-2"><strong>Год выпуска:</strong> {movie.year || 'N/A'}</p>
          <p className="text-gray-600 mb-2"><strong>Жанры:</strong> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
          <button
            onClick={() => store.addToFavorites(movie)}
            className="mt-4 w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Добавить в избранное
          </button>
        </div>
      </div>
    </div>
  );
});

export default MovieDetail;