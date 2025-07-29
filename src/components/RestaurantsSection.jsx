import React from 'react';
import RestaurantCard from './RestaurantCard';
import '../css/RestaurantsSection.css';
const RestaurantsSection = ({ restaurantes, onEdit, onDelete, noResults }) => {
  return (
    <section className="restaurants-section">
      <div className="section-header">
        <h2 className="section-title">Nuestros Restaurantes</h2>
        <p className="section-subtitle">Descubre los mejores lugares para disfrutar</p>
      </div>

      <div className="restaurants-grid">
        {noResults ? (
          <p className="no-results-message">
            No se encontró ningún restaurante con ese nombre.
          </p>
        ) : (
          restaurantes.map((restaurante) => (
            <RestaurantCard
              key={restaurante.id_restaurante}
              restaurante={restaurante}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default RestaurantsSection;