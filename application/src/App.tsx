import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Sets from "./pages/Sets";
import { AuthProvider } from "./hooks/Auth";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CreateSet from "./pages/CreateSet";
import NotFound from "./pages/NotFound";
import Set from "./pages/Set";

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
          <Route
            path="/create-set"
            element={
              <ProtectedRoute>
                <CreateSet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/set/:id"
            element={
              <ProtectedRoute>
                <Set />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
