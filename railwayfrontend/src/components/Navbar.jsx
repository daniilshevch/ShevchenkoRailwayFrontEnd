import { Link } from 'react-router-dom';
import "./Navbar.css";
import {getCurrentUser} from "../utils/UserDefiner.js";
import { Dropdown, Button, Menu } from 'antd';
import { DownOutlined, UserOutlined, IdcardOutlined, LoginOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";
function Navbar()
{
    const [user, setUser] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        const fetchProfileImage = async () =>
        {
            if(!localStorage.getItem("token"))
            {
                setProfileImageUrl("/unknown.jpg");
                return;
            }
            try
            {
                const response = await fetch("https://localhost:7230/Client-API/get-profile-image-for-current-user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                if(!response.ok) throw new Error("Помилка при завантаженні зображення");
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setProfileImageUrl(imageUrl);
            }
            catch(error)
            {
                console.warn("Не вдалося завантажити зображення профілю:", error);
                setProfileImageUrl("/unknown.jpg");
            }
        };
        fetchProfileImage();
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
                    <img src = {profileImageUrl} alt = "profile" />
                    <div className="profile-popup">
                        <img src={profileImageUrl} alt="profile-large" />
                    </div>
                </div>
            </div>

        </header>
    );
}
export default Navbar;  