import React, { useContext } from 'react';
import { ContextoApp } from '../../Contexto/index';
import { ciudades } from '../Ciudades/index';
import './estilos.css';

const FormularioCotizador: React.FC = () => {
  const almacenVariables = useContext(ContextoApp);

  if (!almacenVariables) {
    return <p>Error: Contexto no disponible</p>;
  }

  const {
    ciudadOrigen,
    setCiudadOrigen,
    ciudadDestino,
    setCiudadDestino,
    alto,
    setAlto,
    largo,
    setLargo,
    ancho,
    setAncho,
    valorDeclarado,
    setValorDeclarado,
  } = almacenVariables;

  const manejarCotizacion = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cotización en proceso con datos: 
      Origen: ${ciudadOrigen}, 
      Destino: ${ciudadDestino}, 
      Dimensiones: ${alto}x${largo}x${ancho}, 
      Valor declarado: ${valorDeclarado}`);
  };

  return (
    <form className="FormularioCotizador-container" onSubmit={manejarCotizacion}>
      <div className="FormularioCotizador-select">
        <label>Ciudad Origen</label>
        <select
          value={ciudadOrigen}
          onChange={(e) => setCiudadOrigen(e.target.value)}
        >
          <option value="">Selecciona una ciudad</option>
          {ciudades.map((ciudad, index) => (
            <option key={index} value={ciudad.nombre}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="FormularioCotizador-select">
        <label>Ciudad Destino</label>
        <select
          value={ciudadDestino}
          onChange={(e) => setCiudadDestino(e.target.value)}
        >
          <option value="">Selecciona una ciudad</option>
          {ciudades.map((ciudad, index) => (
            <option key={index} value={ciudad.nombre}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
      </div>

      <p className="FormularioCotizador-tarifa">TARIFA Kg: $3000</p>

      <div className="FormularioCotizador-inputs">
        <input
          type="number"
          placeholder="Alto (cm)"
          value={alto}
          onChange={(e) => setAlto(e.target.value)}
        />
        <input
          type="number"
          placeholder="Largo (cm)"
          value={largo}
          onChange={(e) => setLargo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ancho (cm)"
          value={ancho}
          onChange={(e) => setAncho(e.target.value)}
        />
      </div>

      <p className="FormularioCotizador-restricciones">Peso mínimo: 2 kg</p>

      <input
        type="number"
        placeholder="$ Valor declarado"
        value={valorDeclarado}
        onChange={(e) => setValorDeclarado(e.target.value)}
        className="FormularioCotizador-input"
      />

      <p className="FormularioCotizador-restricciones">Mínimo 1 caja</p>

      <button type="submit" className="FormularioCotizador-boton">
        Cotizar envío
      </button>
    </form>
  );
};

export default FormularioCotizador;
