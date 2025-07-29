import React from 'react';
import RestaurantForm from './RestaurantForm'; // Comenta temporalmente
import '../css/RestaurantFormModal.css';

const RestaurantFormModal = ({ isOpen, onClose, onSubmit, restaurante}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <RestaurantForm
          initialData={restaurante}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEditing={!!restaurante}
        />
      </div>
    </div>
  );
};

export default RestaurantFormModal;