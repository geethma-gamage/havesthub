import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';

import CustomerLogin from './CustomerLogin';
import CustomerRegister from './CustomerRegister';
import CustomerDashboard from './CustomerDashboard';


import ProductItems from './ProductItems';

import AdminDashboard from './AdminDashboard';

import FarmerLogin from './FarmerLogin';
import FarmerRegister from './FarmerRegister';
import FarmerDashboard from './FarmerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />


        <Route path="/product-items" element={<ProductItems />} />

        <Route path="/admin" element={<AdminDashboard />} />

        {/* Farmer */}
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/farmer-register" element={<FarmerRegister />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
