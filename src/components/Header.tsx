import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Movie App
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Главная</Button>
        <Button color="inherit" onClick={() => navigate('/favorites')}>Избранное</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;