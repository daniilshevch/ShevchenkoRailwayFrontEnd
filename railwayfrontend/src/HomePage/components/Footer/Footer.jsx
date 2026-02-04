import React from 'react';
import { Row, Col, Typography, Space, Divider } from 'antd';
import {
    GithubOutlined,
    LinkedinOutlined,
    SendOutlined,
    MailOutlined,
    PhoneOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Footer.css';

const { Title, Text } = Typography;

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-container">
                <Row gutter={[32, 32]} justify="space-between">
                    {/* Секція Бренду */}
                    <Col xs={24} sm={12} md={8}>
                        <div className="footer-brand">
                            <RocketOutlined className="footer-logo-icon" />
                            <Title level={3} className="footer-brand-name">Shevchenko Railway</Title>
                        </div>
                        <Text className="footer-slogan">
                            Перша приватна залізнична компанія України. <br />
                            Комфорт, безпека та сучасні технології у кожній подорожі.
                        </Text>
                    </Col>

                    {/* Секція Навігації */}
                    <Col xs={12} sm={6} md={4}>
                        <Title level={5} className="footer-title">Пасажирам</Title>
                        <Space direction="vertical" className="footer-links">
                            <Link to="/#ticket-search">Пошук квитків</Link>
                            <Link to="/#schedule-board">Розклад руху</Link>
                            <Link to="/services">Послуги</Link>
                            <Link to="/user-ticket-bookings/active">Мої квитки</Link>
                        </Space>
                    </Col>

                    {/* Секція Контактів */}
                    <Col xs={12} sm={6} md={5}>
                        <Title level={5} className="footer-title">Допомога</Title>
                        <Space direction="vertical" className="footer-contacts">
                            <Text><PhoneOutlined /> +38 066 343 99 44</Text>
                            <Text><MailOutlined />shevchenkorailway@gmail.com</Text>
                            <Text><SendOutlined /> Telegram-бот</Text>
                        </Space>
                    </Col>

                    {/* Секція Соцмереж та Розробника */}
                    <Col xs={24} md={5}>
                        <Title level={5} className="footer-title">Стежте за нами</Title>
                        <Space size="large" className="footer-socials">
                            <a href="https://github.com" target="_blank" rel="noreferrer"><GithubOutlined /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><LinkedinOutlined /></a>
                        </Space>
                    </Col>
                </Row>

                <Divider className="footer-divider" />

                <div className="footer-bottom">
                    <Text style = {{color: "white"}}>© 2026 Shevchenko Railway. Всі права захищені.</Text>
                    <Space split={<Divider type="vertical" />} className="footer-bottom-links">
                        <Text type style = {{color: "white"}}>Політика конфіденційності</Text>
                        <Text type style = {{color: "white"}}>Публічна оферта</Text>
                    </Space>
                </div>
            </div>
        </footer>
    );
};

export default Footer;