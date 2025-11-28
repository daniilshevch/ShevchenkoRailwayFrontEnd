import { Link } from 'react-router-dom';
import "./Navbar.css";
import {getCurrentUser} from "../../../SystemUtils/UserDefinerService/UserDefiner.js";
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

                if(!response.ok) throw new Error("Помилка завантаження");

                // Перевіряємо тип контенту
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    // ВАРІАНТ 1: Прийшов JSON (це посилання на Google)
                    const data = await response.json();
                    setProfileImageUrl(data.imageUrl); // Просто ставимо URL в src
                } else {
                    // ВАРІАНТ 2: Прийшла картинка (Blob з нашої бази)
                    const imageBlob = await response.blob();
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setProfileImageUrl(imageUrl);
                }
            }
            catch(error)
            {
                console.warn("Не вдалося завантажити зображення:", error);
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
                                label: <Link to="/user-ticket-bookings  ">Мої квитки</Link>,
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