import React from 'react';
import './Loader.css';
//Usamos la prop isLoading para que no haya errores y se muestre siempre
const Loader = ({ isLoading }) => {
    if (!isLoading) {
        return null; // Si isLoading es falso, el componente no renderiza nada
    }
    return (
        <div className='loader-container'>
            <div className="hourglassBackground">
                <div className="hourglassContainer">
                    <div className="hourglassCurves" />
                    <div className="hourglassCapTop" />
                    <div className="hourglassGlassTop" />
                    <div className="hourglassSand" />
                    <div className="hourglassSandStream" />
                    <div className="hourglassCapBottom" />
                    <div className="hourglassGlass" />
                </div>
            </div>
        </div >
    );
}

export default Loader;
