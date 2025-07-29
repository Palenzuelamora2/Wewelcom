
import React, { useState, useEffect } from 'react';
import { FaUtensils, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../css/RestaurantForm.css'; 

const RestaurantForm = ({ initialData,  onSubmit, onCancel,isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre_restaurante: '',     
    telefono_restaurante: '',   
    direccion_restaurante: ''   
  });
  //Estado para los errores.
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales si estamos en modo edición o si initialData cambia
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre_restaurante: initialData.nombre_restaurante || '',
        telefono_restaurante: initialData.telefono_restaurante || '',
        direccion_restaurante: initialData.direccion_restaurante || ''
      });
    } else {
      // Limpiar el formulario si no hay datos iniciales
      setFormData({
        nombre_restaurante: '',
        telefono_restaurante: '',
        direccion_restaurante: ''
      });
    }
    console.log(formData)
    setErrors({}); 
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
  };

  // Función de validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre_restaurante.trim()) {
      newErrors.nombre_restaurante = 'El nombre es requerido';
    }

    if (!formData.telefono_restaurante.trim()) {
      newErrors.telefono_restaurante = 'El teléfono es requerido';
    } else if (!/^[0-9+ ]+$/.test(formData.telefono_restaurante)) {
      newErrors.telefono_restaurante = 'Teléfono no válido (solo números, +, espacio)';
    }

    if (!formData.direccion_restaurante.trim()) {
      newErrors.direccion_restaurante = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (validateForm()) { 
      onSubmit(formData); 
    }
  };

  return (
    <>
      <h2 className="form-title">
        <FaUtensils className="title-icon" />
        {isEditing ? 'Editar Restaurante' : 'Nuevo Restaurante'}
      </h2>

      <form onSubmit={handleSubmit} className="restaurant-form">
        <div className={`form-group ${errors.nombre_restaurante ? 'has-error' : ''}`}>
          <label htmlFor="nombre_restaurante">Nombre del Restaurante</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="nombre_restaurante"
              name="nombre_restaurante" // Nombre del campo para el estado
              value={formData.nombre_restaurante}
              onChange={handleChange}
              placeholder="Ej: La Buena Mesa"
            />
          </div>
          {errors.nombre_restaurante && <span className="error-message">{errors.nombre_restaurante}</span>}
        </div>

        <div className={`form-group ${errors.telefono_restaurante ? 'has-error' : ''}`}>
          <label htmlFor="telefono_restaurante">Teléfono</label>
          <div className="input-wrapper">
            <FaPhone className="input-icon" />
            <input
              type="text"
              id="telefono_restaurante"
              name="telefono_restaurante" // Nombre del campo para el estado
              value={formData.telefono_restaurante}
              onChange={handleChange}
              placeholder="Ej: +34 912 345 678"
            />
          </div>
          {errors.telefono_restaurante && <span className="error-message">{errors.telefono_restaurante}</span>}
        </div>

        <div className={`form-group ${errors.direccion_restaurante ? 'has-error' : ''}`}>
          <label htmlFor="direccion_restaurante">Dirección</label>
          <div className="input-wrapper">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              id="direccion_restaurante"
              name="direccion_restaurante" // Nombre del campo para el estado
              value={formData.direccion_restaurante}
              onChange={handleChange}
              placeholder="Ej: Calle Principal 123, Madrid"
            />
          </div>
          {errors.direccion_restaurante && <span className="error-message">{errors.direccion_restaurante}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            {isEditing ? 'Guardar Cambios' : 'Guardar Restaurante'}
          </button>
        </div>
      </form>
    </>
  );
};

export default RestaurantForm;
