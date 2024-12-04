import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Si quiere usar una variable de aquí en alguna parte de la App, siga estos pasos:
// 1. En el componente elegido, importa { useContext } desde 'react';
// 2. En el componente elegido, trae el proveedor así: import { ContextoApp } from '../../Contexto/index'
// 3. Antes del return del componente, crea lo siguiente: const almacenVariables = useContext(ContextoApp)
// 4. Usa la variable que desees del ProveedorVariables, por ejemplo: almacenVariables.esFavorito

//-------------------------------------------------------------------------------------
// 1. Define la interfaz para el contexto
//-------------------------------------------------------------------------------------

interface ContextProps {
  // Estados de apertura y cierre
  estaAbiertoAlgo: boolean;
  setEstaAbiertoAlgo: Dispatch<SetStateAction<boolean>>;
  abrirAlgo: () => void; 
  cerrarAlgo: () => void; 

  // Variables del formulario cotizador
  ciudadOrigen: string;
  setCiudadOrigen: Dispatch<SetStateAction<string>>;
  ciudadDestino: string;
  setCiudadDestino: Dispatch<SetStateAction<string>>;
  alto: number; // Definido como number para tratarlo como número
  setAlto: Dispatch<SetStateAction<number>>; // Aseguramos que 'setAlto' maneje números
  largo: number; // Definido como number
  setLargo: Dispatch<SetStateAction<number>>; // 'setLargo' también maneja números
  ancho: number; // Definido como number
  setAncho: Dispatch<SetStateAction<number>>; // 'setAncho' maneja números
  valorDeclarado: number; // Definido como number para manejar el valor declarado como número
  setValorDeclarado: Dispatch<SetStateAction<number>>; // 'setValorDeclarado' también es para números
}

// Crea el contexto con un valor inicial undefined
export const ContextoApp = createContext<ContextProps | undefined>(undefined);

// Props para el proveedor de variables
interface ProveedorVariablesProps {
  hijo: ReactNode;
}

//-------------------------------------------------------------------------------------
// 2. Proveedor de variables que utiliza el contexto 
//-------------------------------------------------------------------------------------

export const ProveedorVariables: React.FC<ProveedorVariablesProps> = ({ hijo }) => {
  
  // Estado para abrir y cerrar el Algo
  const [estaAbiertoAlgo, setEstaAbiertoAlgo] = useState(false);
  const abrirAlgo = () => setEstaAbiertoAlgo(true);
  const cerrarAlgo = () => setEstaAbiertoAlgo(false);

  // Estados para el formulario cotizador
  const [ciudadOrigen, setCiudadOrigen] = useState<string>(''); // Ciudad de origen como string
  const [ciudadDestino, setCiudadDestino] = useState<string>(''); // Ciudad de destino como string
  const [alto, setAlto] = useState<number>(0); // Alto como number
  const [largo, setLargo] = useState<number>(0); // Largo como number
  const [ancho, setAncho] = useState<number>(0); // Ancho como number
  const [valorDeclarado, setValorDeclarado] = useState<number>(0); // Valor declarado como number

  //-------------------------------------------------------------------------------------
  // 3. Crea el objeto de contexto con los valores y funciones necesarios que quieres proveer
  //-------------------------------------------------------------------------------------
  
  const contextValue: ContextProps = {
    estaAbiertoAlgo,
    setEstaAbiertoAlgo,
    abrirAlgo,
    cerrarAlgo,

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
  };
  
  // Renderiza el proveedor de contexto con el valor proporcionado
  return (
    <ContextoApp.Provider value={contextValue}>
      {hijo}
    </ContextoApp.Provider>
  );
};  
