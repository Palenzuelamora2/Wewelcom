import React from 'react';
import { FaEdit, FaTrash, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
const RestaurantCard = ({ restaurante, onEdit, onDelete }) => {
  return (
    <div className="restaurant-card">
      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurante.nombre_restaurante}</h3>
        
        <div className="restaurant-details">
          <div className="detail-item">
            <FaPhone className="detail-icon" />
            <span>{restaurante.telefono_restaurante}</span>
          </div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{restaurante.direccion_restaurante}</span>
          </div>
        </div>
        
        <div className="restaurant-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(restaurante)}
          >
            <FaEdit /> Editar
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(restaurante.id_restaurante)}
          >
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;