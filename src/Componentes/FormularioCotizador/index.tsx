import React, { useContext, useState } from "react";
import { ContextoApp } from "../../Contexto/index";
import municipios from "../Ciudades/municipios.json"; 
import combinaciones from "../Combinaciones/combinaciones.json"; 
import Swal from 'sweetalert2'; // Importa Swal
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

  const [cajas, setCajas] = useState<number>(0); 
  const [peso, setPeso] = useState<number>(0); 
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<string[]>([]); 
  const [sugerenciasDestino, setSugerenciasDestino] = useState<string[]>([]); 

  const ciudadesPermitidas = [
    "Funza - Cundinamarca",
    "Barranquilla - Atlantico",
    "Bucaramanga - Santander",
    "Cali - Valle Del Cauca",
    "Medellin - Antioquia"
  ];

  const filtrarCiudades = (input: string, esOrigen: boolean) => {
    const listaFiltrada = municipios.filter((municipio) =>
      municipio.CIUDAD_DEPARTAMENTO.toLowerCase().includes(input.toLowerCase())
    );
    
    return listaFiltrada
      .map((municipio) => municipio.CIUDAD_DEPARTAMENTO)
      .filter((ciudad) => esOrigen ? ciudadesPermitidas.includes(ciudad) : true)
      .slice(0, 10); // Limitar a los primeros 10 resultados
  };

  const validarValor = (valor: string): number => Math.max(0, Number(valor));

  const obtenerCostoKg = (origenDestino: string) => {
    const combinacion = combinaciones.find(
      (item) => item.ORIGEN_DESTINO === origenDestino
    );
    return combinacion ? combinacion.COSTO_KG : "No disponible";
  };

  const factorPeso = 400;

  const pesoVolumetrico = (alto && largo && ancho)
    ? (alto / 100) * (largo / 100) * (ancho / 100) * factorPeso
    : 0;

  const porcentajeDeclarado = valorDeclarado
    ? Math.max(2500, valorDeclarado * 0.005)
    : 2500;

  const pesoFinal = Math.max(
    pesoVolumetrico,
    peso,
    25
  );

  const manejarCotizacion = (e: React.FormEvent) => {
    e.preventDefault();

    // Lista de campos vacíos
    const camposVacios: string[] = [];

    if (!ciudadOrigen) camposVacios.push('Ciudad de origen');
    if (!ciudadDestino) camposVacios.push('Ciudad de destino');
    if (!alto) camposVacios.push('Alto');
    if (!largo) camposVacios.push('Largo');
    if (!ancho) camposVacios.push('Ancho');
    if (!peso) camposVacios.push('Peso');
    if (!cajas) camposVacios.push('Cantidad de cajas');
    if (!valorDeclarado) camposVacios.push('Valor declarado');

    if (camposVacios.length > 0) {
      // Mostrar alerta con los campos vacíos
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: `Por favor, complete los siguientes campos: ${camposVacios.join(', ')}`,
      });
      return;
    }
    
    const formatearMoneda = (valor: number) => {
        // Redondea al múltiplo de 50 más cercano
        const valorRedondeado = Math.round(valor / 50) * 50;
      
        // Formatea como moneda sin decimales
        return new Intl.NumberFormat('es-CO', { 
          style: 'currency', 
          currency: 'COP',
          minimumFractionDigits: 0, // Sin decimales
          maximumFractionDigits: 0  // Sin decimales
        }).format(valorRedondeado);
      };      

    const origenDestinoConcatenado = `${ciudadOrigen}/${ciudadDestino}`;
    const costoKg = Number(obtenerCostoKg(origenDestinoConcatenado));
    const valorDeclaradoFormateado = formatearMoneda(valorDeclarado);
    const flete=formatearMoneda(cajas * pesoFinal * costoKg + porcentajeDeclarado);
    // Mostrar el resultado de la cotización en una ventana emergente (modal) con el botón de cerrar
    Swal.fire({
        icon: 'success',
        title: 'Calculo de tu flete',
        html: `
          <strong>Origen/Destino:</strong> ${ciudadOrigen}/${ciudadDestino} <br>
          <strong>Costo por kg:</strong> ${costoKg} <br>
          <strong>Dimensiones:</strong> ${alto}x${largo}x${ancho} <br>
          <strong>Peso digitado:</strong> ${peso} <br>
          <strong>Volumetrico:</strong> ${pesoVolumetrico} <br>
          <strong>Peso elegido:</strong> ${pesoFinal} <br>
          <strong>Cajas:</strong> ${cajas} <br>
          <strong>Valor declarado:</strong> ${valorDeclaradoFormateado} <br>
          <strong>Costo manejo:</strong> ${porcentajeDeclarado} <br>
          <strong>Flete:</strong> ${flete}
        `,
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
      });      
  };
  

  const limpiarFormulario = () => {
    setCiudadOrigen('');
    setCiudadDestino('');
    setAlto(0);
    setLargo(0);
    setAncho(0);
    setPeso(0);
    setCajas(0);
    setValorDeclarado(0);
  };

  return (
    <>
      <form className="formulario-cotizador-contenedor" onSubmit={manejarCotizacion}>
        {/* Ciudad Origen */}
        <div className="formulario-cotizador-select">
          <label htmlFor="ciudadOrigen">Ciudad de origen</label>
          <input
            id="ciudadOrigen"
            type="text"
            placeholder="Ciudad de origen"
            value={ciudadOrigen}
            onChange={(e) => {
              setCiudadOrigen(e.target.value);
              setSugerenciasOrigen(filtrarCiudades(e.target.value, true));
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
          <label htmlFor="ciudadDestino">Ciudad de destino</label>
          <input
            id="ciudadDestino"
            type="text"
            placeholder="Ciudad de destino"
            value={ciudadDestino}
            onChange={(e) => {
              setCiudadDestino(e.target.value);
              setSugerenciasDestino(filtrarCiudades(e.target.value, false));
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
          <div className="entrada-titulo">
            <label htmlFor="alto">Alto (cm)</label>
            <input
              id="alto"
              type="number"
              placeholder="Alto (cm)"
              value={alto}
              onChange={(e) => setAlto(validarValor(e.target.value))}
            />
          </div>
          <div className="entrada-titulo">
            <label htmlFor="largo">Largo (cm)</label>
            <input
              id="largo"
              type="number"
              placeholder="Largo (cm)"
              value={largo}
              onChange={(e) => setLargo(validarValor(e.target.value))}
            />
          </div>
          <div className="entrada-titulo">
            <label htmlFor="ancho">Ancho (cm)</label>
            <input
              id="ancho"
              type="number"
              placeholder="Ancho (cm)"
              value={ancho}
              onChange={(e) => setAncho(validarValor(e.target.value))}
            />
          </div>
        </div>

        {/* Peso, Cajas y Valor declarado */}
        <div className="formulario-cotizador-entradas-fila">
          <div className="entrada-titulo">
            <label htmlFor="peso">Peso (kg)</label>
            <input
              id="peso"
              type="number"
              placeholder="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(validarValor(e.target.value))}
            />
          </div>
          <div className="entrada-titulo">
            <label htmlFor="cajas">Cajas</label>
            <input
              id="cajas"
              type="number"
              placeholder="Cantidad de cajas"
              value={cajas}
              onChange={(e) => setCajas(validarValor(e.target.value))}
            />
          </div>
          <div className="entrada-titulo">
            <label htmlFor="valorDeclarado">$ Valor declarado</label>
            <input
              id="valorDeclarado"
              type="number"
              placeholder="Valor declarado"
              value={valorDeclarado}
              onChange={(e) => setValorDeclarado(validarValor(e.target.value))}
            />
          </div>
        </div>

        <button type="submit" className="formulario-boton-enviar">
          Cotizar
        </button>
        <button type="button" className="boton-limpiar" onClick={limpiarFormulario}>
            Limpiar
        </button>
      </form>
    </>
  );
};
    
export default FormularioCotizador;
