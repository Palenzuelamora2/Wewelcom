import React, { useState } from 'react';
import { FaUtensils, FaSearch, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import '../css/Navbar.css';

const Navbar = ({ onSearch, onCreateRestaurant, onLogout }) => {
    //Iniciamos el buscador a vacio
    const [searchQuery, setSearchQuery] = useState('');
    //Funcion que usaremos despues para el buscador consultando a la API
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value); 
    };
    return (
        <nav className="navbar">
            <a href="#" className="logo">
                <FaUtensils className="logo-icon" />
                Wewelcom
            </a>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar restaurantes..."
                    value={searchQuery}
                    onChange={handleChange}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    <FaSearch className="search-icon" />
                </button>
            </div>
            <div className="nav-buttons">
                <button className="add-restaurant" onClick={onCreateRestaurant}>
                    <FaPlus className="add-icon" />
                    Nuevo Restaurante
                </button>


                <button className="logout-button" onClick={onLogout}>
                    <FaSignOutAlt className="logout-icon" />
                    Cerrar Sesión
                </button>

            </div>
        </nav>
    );
};

export default Navbar;
