import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Space, Badge } from 'antd';
import {
    DashboardOutlined,
    GlobalOutlined,
    RocketOutlined,
    UserOutlined,
    SettingOutlined,
    BellOutlined,
    ContainerOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const MainAdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Головна' },
        { key: '/admin/train-routes-list', icon: <GlobalOutlined />, label: 'Маршрути' },
        { key: '/admin/stations', icon: <SettingOutlined />, label: 'Станції' },
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
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                        {collapsed ? 'ПКЗ' : 'Панель керування залізницею'}
                    </Title>
                </div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Space size="large">
                        <Badge count={5}>
                            <BellOutlined style={{ fontSize: '20px' }} />
                        </Badge>
                        <Space>
                            <Avatar icon={<UserOutlined />} />
                            <span style={{ fontWeight: 500 }}>Admin</span>
                        </Space>
                    </Space>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 0, minHeight: 360 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainAdminLayout;