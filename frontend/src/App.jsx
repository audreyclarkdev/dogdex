import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BreedList from "./components/BreedList";
import BreedDetail from "./components/BreedDetail";
import SpottedLog from "./components/SpottedLog";
import UserProfile from "./components/UserProfile";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* each Route maps a URL path to a page component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breeds" element={<BreedList />} />
        <Route path="/breeds/:id" element={<BreedDetail />} />
        <Route path="/spotted" element={<SpottedLog />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
