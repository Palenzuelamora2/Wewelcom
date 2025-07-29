
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MainRestaurants.css';
import Navbar from './Navbar';
import Carousel from './Carousel';
import RestaurantsSection from './RestaurantsSection';
import Footer from './Footer';
import RestaurantFormModal from './RestaurantFormModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import debounce from 'lodash.debounce';
const MySwal = withReactContent(Swal);
const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MainRestaurants = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const api_key_desarrollo = "dev_sk_f8d7e6c5b4a3210987654321fedcba9876543210"
    const api_key_produccion = "prod_sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"

    //Array donde guardaremos todos los restaurantes que tengamos.
    const [restaurantes, setRestaurantes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState({});
    const [searchRestaurant, setsearchRestaurant] = useState("");
    // Función para abrir el modal en modo creación
    const openCreateRestaurantModal = () => {
        setCurrentRestaurant(null);
        setIsModalOpen(true);
    };

    const openEditModal = (restaurant) => {
        setCurrentRestaurant(restaurant);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal del formulario
    const closeFormModal = () => {
        setIsModalOpen(false);
        setCurrentRestaurant(null);
    };
    //Funcion que nos devuelve todos los restaurantes que tengamos en la base de datos ademas le pasamos un parametro de busqueda por si el usuario quiere buscar algun restaurante.
    const getAllRestaurants = async (query = "") => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const headers = {
                'X-API-KEY': api_key_produccion,
                'Accept': 'application/json',
                "Authorization": `Bearer ${token}`
            };
            //Ruta general para que cargue todos los restaurantes si no hay nada escrito en el buscador.
            let url = `${API_BASE_URL}/restaurantes`;  
            //Ahora si hay algun valor en el buscador cambiamos la ruta por la que consultamos a la api.
            if (query.trim() !== "") {
                //Usamos encodeURIComponent para proteger la busqueda por si por ejemplo buscamos Pizza & Pasta que no de ningun error al interpretarlo.
                url = `${API_BASE_URL}/restaurantes/${encodeURIComponent(query)}`;
            }

            const response = await fetch(url, { headers });
            const data = await response.json();
            if (response.ok) {
                // Mapear los nombres de las propiedades de la API a los nombres usados en el frontend
                const restaurantesMapeados = data.restaurantes.map(res => ({
                    id_restaurante: res.id_restaurante,
                    nombre_restaurante: res.nombre_restaurante,
                    direccion_restaurante: res.direccion_restaurante,
                    telefono_restaurante: res.telefono_restaurante,
                }));
                setRestaurantes(restaurantesMapeados);
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al cargar',
                    text: `Error al cargar restaurantes: ${data.message || 'Error desconocido'}`,
                    confirmButtonText: 'Entendido'
                });
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor para cargar los restaurantes. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Entendido'
            });
        }
    };

    // debounce con useCallback para que no se cree en cada render, es una libreria de React que permite evitar que cada vez que el usuario escriba llamar a la API y no saturarla por tanto.
    const debouncedFetch = useCallback(
        debounce((query) => {
            getAllRestaurants(query);
        }, 500), []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setsearchRestaurant(value);
        debouncedFetch(value);
    };
    //Funcion para enviar el formulario de edicion o de creacion del restaurante.
    const handleSubmitForm = async (formData) => {
        if (!token) {
            navigate('/login');
            return;
        }
        //Al ser una función que nos puede servir para editar como para crear, creamos estas variables para no repetir codigo.
        try {
            let response;
            let url;
            let metodo;
            let successMessage;
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': api_key_produccion,
                "Authorization": `Bearer ${token}`
            };
            if (currentRestaurant) {
                // Lógica para EDITAR restaurante
                url = `${API_BASE_URL}/editarRestaurante/${currentRestaurant.id_restaurante}`;
                metodo = 'PUT';
                successMessage = `Restaurante "${formData.nombre_restaurante}" actualizado con éxito.`;
            } else {
                // Lógica para CREAR restaurante
                url = `${API_BASE_URL}/crearRestaurante`;
                metodo = 'POST';
                successMessage = `Restaurante "${formData.nombre_restaurante}" creado con éxito.`;
            }
            response = await fetch(url, {
                method: metodo,
                headers: headers,
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                MySwal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: successMessage,
                    confirmButtonText: 'Ok'
                });
                getAllRestaurants();
                closeFormModal();
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: errorMessage,
                    confirmButtonText: 'Entendido'
                });
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Entendido'
            });
        }
    };

    // Función  para eliminar un restaurante
    const deleteRestaurant = async (id_restaurante) => {
        // Verificamos que haya token y si no lo hay mandamos a la pagina de login
        if (!token) {
            navigate('/login');
            return;
        }
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: `¿Realmente quieres eliminar el restaurante? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            
            try {
                const headers = {
                    'X-API-KEY': api_key_produccion,
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`
                };
                const response = await fetch(`${API_BASE_URL}/eliminarRestaurante/${id_restaurante}`, {
                    method: 'DELETE',
                    headers: headers,
                });
                const data = await response.json();

                if (response.ok) {
                    MySwal.fire(
                        '¡Eliminado!',
                        `Restaurante ha sido eliminado.`,
                        'success'
                    );
                    getAllRestaurants();
                } else {
                    if (response.status === 401 || response.status === 403) {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Sesión expirada',
                            text: 'Tu sesión ha expirado o no estás autorizado. Por favor, inicia sesión de nuevo.',
                            confirmButtonText: 'Entendido'
                        }).then(() => {
                            sessionStorage.removeItem("token");
                            navigate('/login');
                        });
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Error al eliminar',
                            text: `Error al eliminar el restaurante`,
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            } catch (error) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para eliminar el restaurante. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    };
    const handleLogout = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': api_key_produccion,
                "Authorization": `Bearer ${token}`
            };
            const response = await fetch(`${API_BASE_URL}/logout`,
                {
                    headers: headers,
                    method: "POST",
                });
            if (response.ok) {
                sessionStorage.removeItem("token");
                navigate('/');
            }
        } catch {
            MySwal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Entendido'
            });
        }
    };

    // Cargar restaurantes al montar el componente
    useEffect(() => {
        getAllRestaurants();
    }, []);

    return (
        <>
            <Navbar
                onSearch={handleSearchChange}
                onCreateRestaurant={openCreateRestaurantModal}
                onLogout={handleLogout} />
            <Carousel images={images} />
            <RestaurantFormModal
                isOpen={isModalOpen}
                onClose={closeFormModal}
                onSubmit={handleSubmitForm}
                restaurante={currentRestaurant}
            />
            <RestaurantsSection
                restaurantes={restaurantes}
                onEdit={openEditModal}
                onDelete={deleteRestaurant}
            />
            <Footer />
        </>
    );
};

export default MainRestaurants;