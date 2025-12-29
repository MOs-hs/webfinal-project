import { Link } from 'react-router-dom';

function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">🍽️ Meal Planner</div>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/meals">Meals</Link>
          <Link to="/mealplans">Meal Plans</Link>
          <span>👤 {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
