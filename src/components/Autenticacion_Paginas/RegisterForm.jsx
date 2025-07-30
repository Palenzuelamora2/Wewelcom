import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/AuthStyles.css';
import ErrorTooltip from '../../ui/ErrorTooltip'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Regex para las validaciones de los campos email y password
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
// Funcion para validar los datos de entrada.
const validateRegisterForm = (data) => {
  
  const errors = {};
  // nombre
  if (!data.name?.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }
  // email
  if (!data.email?.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Formato de correo electrónico inválido.';
  }
  // Contraseña
  if (!data.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (!PASSWORD_REGEX.test(data.password)) {
    errors.password = 'Debe tener mínimo 6 caracteres, mayúsculas, minúsculas, números y un carácter especial.';
  }
  // Confirmacion de contraseña
  if (!data.password_confirmation) {
    errors.password_confirmation = 'Debes confirmar la contraseña.';
  } else if (data.password !== data.password_confirmation) {
    errors.password_confirmation = 'Las contraseñas no coinciden.';
  }

  return errors;
};

const RegisterForm = ({ toggleForm, onSetLoading }) => {
  const navigate = useNavigate();
  // Estado para los valores del formulario.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Estado para mostrar los errores de validación
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    api: ''
  });

  //Inicializamos un estado para manejar los mensajes de exito
  const [successMessage, setSuccessMessage] = useState('');

  // Función para limpiar errores dinámicamente
  const cleanErrors = (fieldName, value) => {
    const updatedErrors = { ...errors };
    switch (fieldName) {
      case 'name':
        if (value.trim() !== '') {
          updatedErrors.name = '';
        }
        break;
      case 'email':
        if (EMAIL_REGEX.test(value)) {
          updatedErrors.email = '';
        }
        break;
      case 'password':
        if (PASSWORD_REGEX.test(value)) {
          updatedErrors.password = '';
        }

        if (PASSWORD_REGEX.test(value) && formData.password_confirmation && value === formData.password_confirmation) {
          updatedErrors.password_confirmation = '';
        }
        break;
      case 'password_confirmation':
        if (value === formData.password && PASSWORD_REGEX.test(formData.password)) {
          updatedErrors.password_confirmation = '';
        }
        break;
      default:
        break;
    }
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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Limpiamos los errores para no arrastrar errores de intentos anteriores
    setErrors({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      api: ''
    });
    setSuccessMessage('');
    // Realizamos las validaciones del frontend
    const newErrors = validateRegisterForm(formData);
    // Actualizamos el estado de errors con newErrors, para que si hay errores de validacion en el frontend se muestren antes de mandar la peticion.
    setErrors(prev => ({ ...prev, ...newErrors }));

    // Cuando no haya errores enviamos la petición a la API
    if (Object.keys(newErrors).length === 0) {
      onSetLoading(true);
      try {
        const registroRes = await fetch(`${API_BASE_URL}/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const registroData = await registroRes.json();

        if (registroRes.ok) {
          // Si el registro fue exitoso
          setSuccessMessage('¡Usuario registrado con éxito! Iniciando sesión...');
          // Limpiamos el formulario una vez el usuario se haya registrado
          setFormData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
          });
          try {
            const loginRes = await fetch(`${API_BASE_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const loginData = await loginRes.json(); 
            if (loginRes.ok) {
              sessionStorage.setItem('token', loginData.token); 
              navigate("/restaurantes"); 
            } else {
              setErrors(prev => ({ ...prev, api: loginData.message || 'Error al iniciar sesión después del registro.' }));
            }
          } catch (loginError) {
            setErrors(prev => ({ ...prev, api: 'No se pudo conectar con el servidor para iniciar sesión. Por favor, inténtelo de nuevo.' }));
          }
        } else {
          if (registroData.errores) {
            //Comprobamos que el email no exista
            if (registroData.errores.email) {
              setErrors(prev => ({ ...prev, email: "El correo electrónico ya existe. Inténtalo de nuevo" }));
            }
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
        <h1>Crear Cuenta</h1>
        {/* Campo Nombre */}
        <div>
          <ErrorTooltip message={errors.name}>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error-border' : ''}
              maxLength={255}
            />
          </ErrorTooltip>
        </div>

        {/* Campo email  */}
        <div>
          <ErrorTooltip message={errors.email}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error-border' : ''}
              maxLength={255}
            />
          </ErrorTooltip>
        </div>

        {/* Campo Contraseña  */}
        <div>
          <ErrorTooltip message={errors.password}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error-border' : ''}
              maxLength={255}
            />
          </ErrorTooltip>
        </div>

        {/* Campo Confirmar Contraseña  */}
        <div>
          <ErrorTooltip message={errors.password_confirmation}>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmar contraseña"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? 'input-error-border' : ''}
            />
          </ErrorTooltip>
        </div>

        <button type="submit">Registrarse</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.api && <p className="error-message form-general-error">{errors.api}</p>}

      </form>
    </>

  );
};

export default RegisterForm;