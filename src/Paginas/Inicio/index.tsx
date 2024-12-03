import logo from "../../Imagenes/albatros.png";
import logofmc from "../../Imagenes/logofmc.png";
import "./estilos.css";
import FormularioCotizador from "../../Componentes/FormularioCotizador/index";

const Inicio: React.FC = () => {
  return (
    <div className="Inicio-contenedor">
      <div className="Inicio-contenedor-logos">
        <img src={logo} alt="Logo Integra" className="Inicio-logo-integra" />
        <img src={logofmc} alt="Logo fmc" className="Inicio-logo-fmc" />
      </div>
      <FormularioCotizador />
    </div>
  );
};

export default Inicio;
