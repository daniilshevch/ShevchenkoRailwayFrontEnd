import { Link } from 'react-router-dom';
import "./Navbar.css";
function Navbar()
{
    return (
        <header className="navbar-wrapper">
            <img src="/background_images/images.png" alt="railway-logo" className="logo-image" />
            <nav className="navbar">
                <ul>
                    <li><Link className ="nav-button" to="/">ГОЛОВНА</Link></li>
                    <li><Link className="nav-button" to="/">ПОШУК КВИТКІВ</Link></li>
                    <li><Link className="nav-button" to="/">РОЗКЛАД РУХУ</Link></li>
                </ul>
            </nav>
            <Link to="/profile" className="profile-icon">
                <img src = "/test.png" alt = "profile" />
            </Link>
        </header>
    );
}
export default Navbar;  