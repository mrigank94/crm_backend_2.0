import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LandingPage from "./pages/LandingPage/landingPage";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Client from "./pages/ClientPage/client";
import Admin from "./pages/AdminPage/admin";
import Customer from "./pages/CustomerPage/customer";
import MovieDetails from "./pages/MovieDetails/movieDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/client" element={<Client />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/movie/:id/details" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;
