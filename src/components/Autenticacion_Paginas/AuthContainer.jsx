
import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Loader from '../../ui/Loader'
import '../../css/AuthStyles.css';

const AuthContainer = () => {
  //Estados para saber si el login esta activo o no y poder ir cambiando entre login y registro
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  //Función para cambiar entre login y registro.
  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };
  
  //Función que nos ayuda a saber cuando alguno de los dos hijos está haciendo alguna petición
  const handleSetLoading = (loadingState) => {
    setIsLoading(loadingState);
  };


  return (
    <div className='auth-app'>
      <Loader isLoading={isLoading} />
      <div className={`auth-container ${isLoginActive ? '' : 'right-panel-active'}`}>
        <div className="forms-wrapper">
          <div className={`form-container sign-in-container ${isLoginActive ? 'active' : ''}`}>
            <LoginForm onSetLoading={handleSetLoading} />
          </div>

          <div className={`form-container sign-up-container ${!isLoginActive ? 'active' : ''}`}>
            <RegisterForm toggleForm={() => setIsLoginActive(false)} onSetLoading={handleSetLoading} />
          </div>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>¡Bienvenido de vuelta!</h2>
              {/* <p>Para acceder a reservas y promociones exclusivas, inicia sesión</p> */}
              <button className="ghost" onClick={toggleForm}>Iniciar Sesión</button>
            </div>

            <div className="overlay-panel overlay-right">
              <h2>¡Primera vez aquí?</h2>
              {/* <p>Regístrate para disfrutar de descuentos y beneficios exclusivos</p> */}
              <button className="ghost" onClick={toggleForm}>Registrarse</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AuthContainer;