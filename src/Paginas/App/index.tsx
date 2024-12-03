import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from '../Inicio/index';
import "./estilos.css";
import { ProveedorVariables } from '../../Contexto/index';

const App: React.FC = () => {
  return (
    // Encerramos todo en el ProveedorVariables para que puedan acceder a ellas
    <ProveedorVariables 
      hijo={
    <Router basename="/cotizadorfmc">
      <Routes>
        <Route path="/" element={<Inicio />} />      
      </Routes>
    </Router>
    }
  />
  );
}

export default App;
