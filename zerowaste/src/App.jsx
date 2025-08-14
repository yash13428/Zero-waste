import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FeederRegistration from './pages/FeederRegistration';
import NGORegistration from './pages/NGORegistration';
import DonationForm from './pages/DonationForm';
import Listings from './pages/Listings';
import AboutUs from './pages/AboutUs';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Donation from './pages/Donation';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feeder" element={<FeederRegistration />} />
        <Route path="/ngo" element={<NGORegistration />} />
        <Route path="/donate" element={<DonationForm />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/listings" element={<Listings />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
