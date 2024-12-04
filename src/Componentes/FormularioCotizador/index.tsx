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
    valorDeclarado,
    setValorDeclarado,
  } = almacenVariables;

  const [cajas, setCajas] = useState<number>(0); 
  const [peso, setPeso] = useState<number>(0); 
  const [volumen, setVolumen] = useState<number>(0.2); // Nuevo estado para volumen
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
    
    // Solo aplicar el filtro de ciudadesPermitidas para el destino
    return listaFiltrada
      .map((municipio) => municipio.CIUDAD_DEPARTAMENTO)
      .filter((ciudad) => esOrigen ? true : ciudadesPermitidas.includes(ciudad)) // Cambié aquí
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

  // Actualización del cálculo de peso volumétrico usando el volumen
  const pesoVolumetrico = volumen ? volumen * factorPeso : 0;

  const porcentajeDeclarado = valorDeclarado
    ? Math.max(2500, valorDeclarado * 0.01)
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
    if (!volumen) camposVacios.push('Volumen'); // Verificar volumen
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
    const flete=formatearMoneda(pesoFinal * costoKg + porcentajeDeclarado);
    // Mostrar el resultado de la cotización en una ventana emergente (modal) con el botón de cerrar
    Swal.fire({
        icon: 'success',
        title: 'Calculo de tu flete',
        html: `
          <strong>Origen/Destino:</strong> ${ciudadOrigen}/${ciudadDestino} <br>
          <strong>Costo por kg:</strong> ${costoKg} <br>
          <strong>Volumen:</strong> ${volumen} <br> <!-- Muestra el volumen -->
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
    setVolumen(0.2); // Resetear volumen
    setPeso(1);
    setCajas(1);
    setValorDeclarado(500000);
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

        {/* Volumen */}
        <div className="formulario-cotizador-entradas-fila">
          <div className="entrada-titulo">
            <label htmlFor="volumen">Volumen m³ (use separador coma)</label>
            <input
              id="volumen"
              type="number"
              step="any"
              placeholder="Volumen"
              value={volumen}
              onChange={(e) => setVolumen(Number(e.target.value))}
            />
          </div>
        </div>


        {/* Peso */}
        <div className="formulario-cotizador-entradas-fila">
          <div className="entrada-titulo">
            <label htmlFor="peso">Peso (kg)</label>
            <input
              id="peso"
              type="number"
              placeholder="Peso"
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Cajas */}
        <div className="formulario-cotizador-entradas-fila">
          <div className="entrada-titulo">
            <label htmlFor="cajas">Cantidad de cajas</label>
            <input
              id="cajas"
              type="number"
              value={cajas}
              onChange={(e) => setCajas(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Valor Declarado */}
        <div className="formulario-cotizador-entradas-fila">
          <div className="entrada-titulo">
            <label htmlFor="valorDeclarado">Valor declarado</label>
            <input
              id="valorDeclarado"
              type="number"
              value={valorDeclarado}
              onChange={(e) => setValorDeclarado(validarValor(e.target.value))}
            />
          </div>
        </div>
        <div className="formulario-cotizador-contenedor-botones">
          <div className="formulario-cotizador-boton-calculo">
            <button type="submit">Calcular Flete</button>
          </div>
          <div className="formulario-cotizador-boton-limpiar">
            <button type="button" onClick={limpiarFormulario}>Limpiar formulario</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormularioCotizador;
