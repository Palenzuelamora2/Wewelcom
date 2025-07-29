import React, { useState } from 'react';
import { FaUtensils, FaSearch, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import '../css/Navbar.css';

const Navbar = ({ onSearch, onCreateRestaurant, onLogout }) => {
    //Iniciamos el buscador a vacio
    const [searchQuery, setSearchQuery] = useState('');
    //Funcion que usaremos despues para el buscador consultando a la API
    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };
    return (
        <nav className="navbar">
            <a href="#" className="logo">
                <FaUtensils className="logo-icon" />
                Wewelcom
            </a>

            <form onSubmit={handleSearch}>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar restaurantes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <FaSearch className="search-icon" />
                    </button>
                </div>
            </form>

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
