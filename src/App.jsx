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

export default function App() {
  const location = useLocation();

  const pageMap = {
    "/analisador-curriculo": "curriculo",
    "/analisador-diretrizes": "diretrizes",
    "/analisador-contrato": "contrato",
    "/criador-contrato": "criador",
    "/comparador-contratos": "comparador",
    "/gerador-email": "email",
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
