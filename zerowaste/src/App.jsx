import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DonorRegistration from './pages/DonorRegistration';
import NGORegistration from './pages/NGORegistration';
import DonationForm from './pages/DonationForm';
import Listings from './pages/Listings';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor" element={<DonorRegistration />} />
        <Route path="/ngo" element={<NGORegistration />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/listings" element={<Listings />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
