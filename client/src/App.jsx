import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Meals from './pages/Meals';
import MealPlans from './pages/MealPlans';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      {user && <Navbar user={user} logout={logout} />}
      
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />
        } />
        
        <Route path="/signup" element={
          user ? <Navigate to="/dashboard" /> : <Signup onLogin={login} />
        } />
        
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} token={token} /> : <Navigate to="/login" />
        } />
        
        <Route path="/meals" element={
          user ? <Meals token={token} /> : <Navigate to="/login" />
        } />
        
        <Route path="/mealplans" element={
          user ? <MealPlans token={token} /> : <Navigate to="/login" />
        } />
        
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
