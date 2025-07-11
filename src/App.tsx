import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import Favorites from './components/Favorites';
import FilterPanel from './components/FilterPanel';
import { useStore } from './store';
import { Container, CssBaseline } from '@mui/material';
import Header from './components/Header';

const App: React.FC = observer(() => {
  const store = useStore();

  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container>
        <FilterPanel />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Container>
    </Router>
  );
});

export default App;