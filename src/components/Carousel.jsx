import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/Carousel.css';
//Componente al cual le pasamos una propm que sean las imagenes que queramos usar ( yo he cogido algunas de internet pero en un futuro se pueden poner imágenes del mismo restaurante etc...) 
const Carousel = ({ images }) => {
  //Iniciamos el estado a 0
  const [currentIndex, setCurrentIndex] = useState(0);
  //Función para avanzar de "diapositiva".
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  //Función para retroceder de "diapositiva".
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  //Inicializamos segun entremos a la pagina un intervalo para que vaya pasando de diapositiva cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="carousel-container">
      <div className="carousel">
        {/* Recorremos el array de imagenes */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className="carousel-image"
            />
          </div>
        ))}
      </div>

      <button className="carousel-control prev" onClick={prevSlide}>
        <FaChevronLeft />
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;