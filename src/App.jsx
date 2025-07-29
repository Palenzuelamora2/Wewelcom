import './App.css';
import AuthContainer from './components/Autenticacion_Paginas/AuthContainer';
import MainRestaurants from './components/MainRestaurants';
import { BrowserRouter,Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para el Login */}
        <Route path="/" element={
          <AuthContainer />
        }></Route>
        {/* Ruta que usaremos para mostrar todo el panel de restaurantes etc.. */}
        <Route path="/restaurantes" element={
          <MainRestaurants />
        }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;