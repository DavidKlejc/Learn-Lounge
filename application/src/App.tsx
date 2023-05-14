import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Sets from "./pages/Sets";
import { AuthProvider } from "./hooks/Auth";
import Nav from "./components/Nav";

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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
