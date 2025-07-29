
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../css/Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-logo">
            <span className="logo-icon">W</span>ewelcom
          </h3>
          <p className="footer-about">
            La plataforma líder para la gestión y descubrimiento de restaurantes.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Enlaces rápidos</h4>
          <ul className="footer-links">
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Restaurantes</a></li>
            <li><a href="#">Sobre nosotros</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li><a href="#">Términos de servicio</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">Aviso legal</a></li>
          </ul>
        </div>
      </div>

    </footer>
  );
};

export default Footer;