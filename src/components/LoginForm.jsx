

import './AuthStyles.css';
import React, { useState } from 'react';
import ErrorTooltip from '../ui/ErrorTooltip'


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const validateLoginForm = (data) => {
  const errors = {};
  // email
  if (!data.email?.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Formato de correo electrónico inválido.';
  }

  // Contraseña
  if (!data.password) {
    errors.password = 'La contraseña es obligatoria.';
  }
  return errors;
};



const LoginForm = ({ onSetLoading }) => {
  // Estado para los valores del formulario.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // Estado para mostrar los errores de validación
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    api: ''
  });

  // Función para limpiar errores dinámicamente
  const cleanErrors = (fieldName, value) => {
    //Hacemos una copia de los errores para luego ir limpiandolos
    const updatedErrors = { ...errors };
    switch (fieldName) {
      case 'email':
        if (EMAIL_REGEX.test(value)) {
          updatedErrors.email = '';
        }
        break;
      case 'password':
        if (PASSWORD_REGEX.test(value)) {
          updatedErrors.password = '';
        }
        break;
      default:
        break;
    }
    //Guardamos el estado de los errores actualizados.
    setErrors(updatedErrors);
  };

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    cleanErrors(name, value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    onSetLoading(true);
    //Limpiamos los errores para no arrastrar errores de intentos anteriores
    setErrors({
      email: '',
      password: '',
      api: ''
    });
    // Realizamos las validaciones del frontend
    const newErrors = validateLoginForm(formData);
    // Actualizamos el estado de errors con newErrors, para que si hay errores de validacion en el frontend se muestren antes de mandar la peticion.
    setErrors(prev => ({ ...prev, ...newErrors }));
    // Cuando no haya errores enviamos la petición a la API
    if (Object.keys(newErrors).length === 0) {
      try {
        const loginRes = await fetch('https://wewelcom-api-production.up.railway.app/api/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        //Leemos la respuesta que nos devuelve el servidor.
        const LoginData = await loginRes.json();
        if (loginRes.ok) {
          //Guardamos el token de acceso que luego nos permitirá hacer las correspondientes funciones de la página
          sessionStorage.setItem('token', LoginData.token);
          console.log("Hola");
        } else {
          if (loginRes.status === 401) {
            setErrors(prev => ({ ...prev, api: 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.' }));
          }
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, api: 'No se pudo conectar con el servidor. Por favor, inténtelo de nuevo.' }));
      } finally {
          onSetLoading(false); // Quitamos el estado de carga independientemente del exito que haya tenido nuestra petición
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Iniciar Sesión</h1>
        <div>
          <ErrorTooltip message={errors.email}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}

              className={errors.email ? 'input-error-border' : ''}
            />
          </ErrorTooltip>
        </div>

        <div>
          <ErrorTooltip message={errors.password}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error-border' : ''}
            />
          </ErrorTooltip>
        </div>
        <button type="submit">Iniciar Sesión</button>
        {errors.api && <p className="error-message">{errors.api}</p>}
      </form>
    </>

  );
};

export default LoginForm;