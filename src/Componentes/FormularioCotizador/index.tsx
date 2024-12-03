import React, { useContext, useState } from "react";
import { ContextoApp } from "../../Contexto/index";
import { ciudades } from "../Ciudades/index";
import "./estilos.css";

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

  const [cajas, setCajas] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<string[]>([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState<string[]>([]);

  // Filtra ciudades según el texto ingresado
  const filtrarCiudades = (input: string) => {
    return ciudades
      .filter((ciudad) =>
        ciudad.nombre.toLowerCase().includes(input.toLowerCase())
      )
      .map((ciudad) => ciudad.nombre);
  };

  // No permite valores negativos
  const validarValor = (valor: string) => Math.max(0, Number(valor)).toString();

  const manejarCotizacion = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cotización en proceso con datos: 
      Origen: ${ciudadOrigen}, 
      Destino: ${ciudadDestino}, 
      Dimensiones: ${alto}x${largo}x${ancho}, 
      Peso: ${peso} kg, 
      Cajas: ${cajas}, 
      Valor declarado: ${valorDeclarado}`);
  };

  return (
    <form className="formulario-cotizador-contenedor" onSubmit={manejarCotizacion}>
      {/* Ciudad Origen */}
      <div className="formulario-cotizador-select">
        <input
          type="text"
          placeholder="Ciudad de origen"
          value={ciudadOrigen}
          onChange={(e) => {
            setCiudadOrigen(e.target.value);
            setSugerenciasOrigen(filtrarCiudades(e.target.value));
          }}
        />
        <span
          className="icono-limpiar"
          onClick={() => {
            setCiudadOrigen("");
            setSugerenciasOrigen([]);
          }}
        >
          &times;
        </span>
        {sugerenciasOrigen.length > 0 && (
          <ul className="formulario-cotizador-sugerencias">
            {sugerenciasOrigen.map((sugerencia, index) => (
              <li
                key={index}
                onClick={() => {
                  setCiudadOrigen(sugerencia);
                  setSugerenciasOrigen([]);
                }}
              >
                {sugerencia}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ciudad Destino */}
      <div className="formulario-cotizador-select">
        <input
          type="text"
          placeholder="Ciudad de destino"
          value={ciudadDestino}
          onChange={(e) => {
            setCiudadDestino(e.target.value);
            setSugerenciasDestino(filtrarCiudades(e.target.value));
          }}
        />
        <span
          className="icono-limpiar"
          onClick={() => {
            setCiudadDestino("");
            setSugerenciasDestino([]);
          }}
        >
          &times;
        </span>
        {sugerenciasDestino.length > 0 && (
          <ul className="formulario-cotizador-sugerencias">
            {sugerenciasDestino.map((sugerencia, index) => (
              <li
                key={index}
                onClick={() => {
                  setCiudadDestino(sugerencia);
                  setSugerenciasDestino([]);
                }}
              >
                {sugerencia}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dimensiones */}
      <div className="formulario-cotizador-entradas-fila">
        <input
          type="number"
          placeholder="Alto (cm)"
          value={alto}
          onChange={(e) => setAlto(validarValor(e.target.value))}
        />
        <input
          type="number"
          placeholder="Largo (cm)"
          value={largo}
          onChange={(e) => setLargo(validarValor(e.target.value))}
        />
        <input
          type="number"
          placeholder="Ancho (cm)"
          value={ancho}
          onChange={(e) => setAncho(validarValor(e.target.value))}
        />
      </div>

      {/* Peso, Cajas y Valor declarado en el mismo grupo */}
      <div className="formulario-cotizador-entradas">
        <input
          className="input-peso"
          type="number"
          inputMode="decimal"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(validarValor(e.target.value))}
        />
        <input
          className="input-cajas"
          type="number"
          inputMode="decimal"
          placeholder="Cantidad de cajas"
          value={cajas}
          onChange={(e) => setCajas(validarValor(e.target.value))}
        />
        <input
          className="input-declarado"
          type="number"
          inputMode="decimal"
          placeholder="Valor declarado ($)"
          value={valorDeclarado}
          onChange={(e) => setValorDeclarado(validarValor(e.target.value))}
        />
      </div>

      <button type="submit" className="formulario-cotizador-boton">
        Cotizar envío
      </button>
    </form>
  );
};

export default FormularioCotizador;
