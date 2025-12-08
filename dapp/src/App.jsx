import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BlockchainProvider } from "./context/BlockchainContext"; // Import this
import Home from "./pages/Home";
import Projects from "./pages/Projects";

function App() {
  return (
    <BlockchainProvider> {/* Add this wrapper */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Router>
    </BlockchainProvider>
  );
}

export default App;