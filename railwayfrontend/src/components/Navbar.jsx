import { Link } from 'react-router-dom';
import "./Navbar.css";
import {getCurrentUser} from "../utils/UserDefiner.js";
import { Dropdown, Button, Menu } from 'antd';
import { DownOutlined, UserOutlined, IdcardOutlined, LoginOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";
function Navbar()
{
    const [user, setUser] = useState(null);
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, [])
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

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
            <div className="profile-area">
                {user ? (
                    <Dropdown overlayClassName="custom-dropdown-menu" menu={{
                        items: [
                            {
                                key: "profile",
                                icon: <UserOutlined />,
                                label: <Link to="/profile">Профіль</Link>,
                            },
                            {
                                key: "tickets",
                                icon: <IdcardOutlined />,
                                label: <Link to="/profile">Мої квитки</Link>,
                            },
                            {
                                key: "logout",
                                icon: <LoginOutlined />,
                                label: "Вийти",
                                onClick: handleLogout
                            },
                        ],
                    }}>
                        <Button className="account-button-authenticated" type="default">
                            {user.name} <DownOutlined />
                        </Button>
                    </Dropdown>
                ) : (
                    <Link to = "/login">
                        <Button className="account-button-not-authenticated" type="primary">УВІЙТИ</Button>
                    </Link>
                )}
                <div className="profile-icon">
                    <img src = "/test.png" alt = "profile" />
                </div>
            </div>

        </header>
    );
}
export default Navbar;  