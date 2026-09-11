import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BreedList from "./components/BreedList";
import BreedDetail from "./components/BreedDetail";
import SpotLog from "./components/SpotLog";
import UserProfile from "./components/UserProfile";
import Footer from "./components/Footer";
import ScrollTopButton from "./components/ScrollTopButton";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* each Route maps a URL path to a page component */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/breeds" element={<BreedList />} />
          {/* :slug is only for a readable URL (e.g. /breeds/1/affenpinscher) -
              BreedDetail still looks the breed up by :id */}
          <Route path="/breeds/:id/:slug" element={<BreedDetail />} />
          <Route path="/spot-log" element={<SpotLog />} />
          <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
      </main>

      <Footer />

      {/* Rendered once here (not per-page) so it floats over every route
          without each page needing to remember to include it. */}
      <ScrollTopButton />
    </div>
  );
}

export default App;
