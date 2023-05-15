import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Sets from "./pages/Sets";
import { AuthProvider } from "./hooks/Auth";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/sets"
            element={
              <ProtectedRoute>
                <Sets />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
