import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Avatar, Space, Badge, Dropdown } from 'antd';
import {
    DashboardOutlined,
    GlobalOutlined,
    UserOutlined,
    SettingOutlined,
    BellOutlined,
    ContainerOutlined,
    DownOutlined,
    IdcardOutlined,
    LoginOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    userAuthenticationService
} from "../../../SystemUtils/UserAuthenticationService/UserAuthenticationService.js";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const MainAdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentUser = userAuthenticationService.getCurrentUser();
        setUser(currentUser);

        const fetchProfileImage = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setProfileImageUrl("/unknown.jpg");
                return;
            }
            try {
                const response = await fetch("https://localhost:7230/Client-API/get-profile-image-for-current-user", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Повне перезавантаження для очищення стейту
    };

    // 2. Меню для Dropdown
    const profileMenuItems = [
        { key: "profile", icon: <UserOutlined />, label: <Link to="/profile">Мій профіль</Link> },
        { key: "tickets", icon: <IdcardOutlined />, label: <Link to="/">Основний сайт</Link> },
        { type: 'divider' },
        { key: "logout", icon: <LoginOutlined />, label: "Вийти", onClick: handleLogout, danger: true },
    ];

    const sidebarItems = [
        { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Головна' },
        { key: '/admin/train-routes-list', icon: <GlobalOutlined />, label: 'Маршрути' },
        { key: '/admin/stations-list', icon: <SettingOutlined />, label: 'Станції' },
        { key: '/admin/carriages-list', icon: <ContainerOutlined />, label: 'Вагони' },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
                style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}
            >
                <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Логотип залізниці в сайдбарі */}
                    <img
                        src="/background_images/44.png"
                        alt="logo"
                        style={{ height: collapsed ? '32px' : '40px', transition: 'all 0.2s' }}
                    />
                </div>
                <Menu
                    theme="light"
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={sidebarItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between', // Змінено для розміщення назви та профілю
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                    zIndex: 1
                }}>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                        {collapsed ? 'ПКЗ' : 'Панель керування залізницею'}
                    </Title>

                    <Space size="large">
                        {user ? (
                            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
                                <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
                                    <Avatar src={profileImageUrl} icon={<UserOutlined />} />
                                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                        <Text strong>{user.name || "Адміністратор"}</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>Admin Role</Text>
                                    </div>
                                    <DownOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                                </Space>
                            </Dropdown>
                        ) : (
                            <Avatar icon={<UserOutlined />} />
                        )}
                    </Space>
                </Header>

                <Content style={{ margin: '16px' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainAdminLayout;