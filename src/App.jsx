import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Songs from "./pages/Songs";
import Artists from "./pages/Artists";
import SongDetail from "./pages/SongDetail";
import Albums from "./pages/Albums";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Listen from "./pages/Listen";
import NotFound from "./pages/NotFound";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC — no navbar */}
        <Route path="/listen/:id" element={<Listen />} />

        {/* APP — with navbar */}
        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/songs/:id" element={<SongDetail />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
