import {Link, useNavigate} from 'react-router-dom';
import "./Navbar.css";
import { getCurrentUser } from "../../../SystemUtils/UserDefinerService/UserDefiner.js";
import { Dropdown, Badge, Avatar, Typography } from 'antd';
import { DownOutlined, UserOutlined, IdcardOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";

const { Text } = Typography;

function Navbar() {
    const [user, setUser] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        const updateCartCount = () => {
            const cartData = JSON.parse(localStorage.getItem("potentialTicketsCart"));
            setCartCount(cartData?.potentialTicketsList?.length ?? 0);
        };

        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);

        const fetchProfileImage = async () => {
            if (!localStorage.getItem("token")) {
                setProfileImageUrl("/unknown.jpg");
                return;
            }
            try {
                const response = await fetch("https://localhost:7230/Client-API/get-profile-image-for-current-user", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (!response.ok) throw new Error();
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                    const data = await response.json();
                    setProfileImageUrl(data.imageUrl);
                } else {
                    const imageBlob = await response.blob();
                    setProfileImageUrl(URL.createObjectURL(imageBlob));
                }
            } catch {
                setProfileImageUrl("/unknown.jpg");
            }
        };
        fetchProfileImage();

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const menuItems = [
        { key: "profile", icon: <UserOutlined />, label: <Link to="/profile">Профіль</Link> },
        { key: "tickets", icon: <IdcardOutlined />, label: <Link to="/user-ticket-bookings/active">Мої квитки</Link> },
        { type: 'divider' },
        { key: "logout", icon: <LoginOutlined />, label: "Вийти", onClick: handleLogout, danger: true },
    ];

    return (
        <header className="navbar-wrapper">
            {/* Старий логотип */}
            <img src="/background_images/44.png" alt="railway-logo" className="logo-image" />

            {/* Стара навігація */}
            <nav className="navbar">
                <ul>
                    <li><Link className="nav-button" to="/">ГОЛОВНА</Link></li>
                    <li><Link className="nav-button" to="/#ticket-search">ПОШУК КВИТКІВ</Link></li>
                    <li><Link className="nav-button" to="/#schedule-board">РОЗКЛАД РУХУ</Link></li>
                </ul>
            </nav>

            {/* Нова права частина */}
            <div className="profile-area">
                {cartCount > 0 && (
                    <div className="cart-badge-wrapper">
                        <Badge count={cartCount} size="small" offset={[5, 0]} onClick={() => navigate("/user-ticket-bookings/in-progress")}>
                            <ShoppingCartOutlined className="navbar-cart-icon" />
                        </Badge>
                    </div>
                )}

                {user ? (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                        <div className="user-profile-integrated">
                            <Avatar src={profileImageUrl} size="large" className="user-avatar-integrated" />
                            <div className="user-info-text">
                                <Text strong className="user-name">{user.name}</Text>
                                <DownOutlined className="user-dropdown-icon" />
                            </div>
                        </div>
                    </Dropdown>
                ) : (
                    <Link to="/login">
                        <button className="auth-btn-primary">УВІЙТИ</button>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Navbar;