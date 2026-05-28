import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AnalisadorCurriculo from "./pages/AnalisadorCurriculo";
import AnalisadorContrato from "./pages/AnalisadorContrato";
import CriadorContrato from "./pages/CriadorContrato";
import AnalisadorDiretrizes from "./pages/AnalisadorDiretrizes";
import ComparadorContratos from "./pages/ComparadorContratos";
import GeradorEmail from "./pages/GeradorEmail";
import SimuladorRescisao from "./pages/SimuladorRescisao";
import TradutorJuridico from "./pages/TradutorJuridico";
import GeradorAta from "./pages/GeradorAta";
import AnalisadorDadosEmpresariais from "./pages/AnalisadorDadosEmpresariais";
import CriadorPoliticaInterna from "./pages/CriadorPoliticaInterna";

export default function App() {
  const location = useLocation();

  const pageMap = {
    "/analisador-curriculo": "curriculo",
    "/analisador-diretrizes": "diretrizes",
    "/analisador-contrato": "contrato",
    "/criador-contrato": "criador",
    "/comparador-contratos": "comparador",
    "/gerador-email": "email",
    "/simulador-rescisao": "rescisao",
    "/tradutor-juridico": "tradutor",
    "/gerador-ata": "ata",
    "/analisador-dados": "dados",
    "/criador-politica": "politica",
  };

  return (
    <div className="min-h-screen flex flex-col" data-page={pageMap[location.pathname] || ""}>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analisador-curriculo" element={<AnalisadorCurriculo />} />
          <Route path="/analisador-contrato" element={<AnalisadorContrato />} />
          <Route path="/criador-contrato" element={<CriadorContrato />} />
          <Route path="/analisador-diretrizes" element={<AnalisadorDiretrizes />} />
          <Route path="/comparador-contratos" element={<ComparadorContratos />} />
          <Route path="/gerador-email" element={<GeradorEmail />} />
          <Route path="/simulador-rescisao" element={<SimuladorRescisao />} />
          <Route path="/tradutor-juridico" element={<TradutorJuridico />} />
          <Route path="/gerador-ata" element={<GeradorAta />} />
          <Route path="/analisador-dados" element={<AnalisadorDadosEmpresariais />} />
          <Route path="/criador-politica" element={<CriadorPoliticaInterna />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
