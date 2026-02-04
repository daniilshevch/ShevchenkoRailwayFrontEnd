import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import {
    CarOutlined,
    TeamOutlined,
    SearchOutlined,
    CustomerServiceOutlined,
    FileProtectOutlined,
    UsergroupAddOutlined,
    CoffeeOutlined,
    EnvironmentOutlined,
    RocketOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import './ServicesSection.css';

const { Title, Text } = Typography;

const services = [
    { title: "Квитки для військових", desc: "Пріоритетне бронювання та спеціальні умови для захисників.", icon: <TeamOutlined />, color: "#2f54eb" },
    { title: "Вагон-автомобілевоз", desc: "Подорожуйте разом із власним авто у спеціальному вагоні.", icon: <CarOutlined />, color: "#13c2c2" },
    { title: "Пошук забутих речей", desc: "Допоможемо знайти та повернути речі, залишені у поїзді.", icon: <SearchOutlined />, color: "#f5222d" },
    { title: "Shevchenko Lounge", desc: "Зона комфорту та очікування на ключових вокзалах.", icon: <CoffeeOutlined />, color: "#722ed1" },
    { title: "Претензійне повернення", desc: "Повернення квитків через скасовані рейси та нещасні випадки.", icon: <FileProtectOutlined />, color: "#eb2f96" },
    { title: "Групове замовлення", desc: "Оформлення квитків для груп від 10 людей заздалегідь.", icon: <UsergroupAddOutlined />, color: "#faad14" },
    { title: "Вокзальний помічник", desc: "Супровід та допомога з багажем для маломобільних пасажирів.", icon: <CustomerServiceOutlined />, color: "#52c41a" },
    { title: "Інклюзивний вагон", desc: "Комфортна подорож для людей з інвалідністю та їх супровідників.", icon: <SafetyCertificateOutlined />, color: "#1890ff" },
    { title: "Мапа безбар'єрності", desc: "Інформація про доступність вокзалів України для кожного.", icon: <EnvironmentOutlined />, color: "#000000" },
    { title: "Дитяча Залізниця", desc: "Захоплива подорож містом для всієї родини.", icon: <RocketOutlined />, color: "#fa541c" }
];

const ServicesSection = () => {
    return (
        <section className="services-section">
            <div className="services-container">
                <div className="services-header-clean">
                    <Title level={2} className="main-title-bold">Замовлення сервісів</Title>
                    <div className="simple-accent-line"></div>
                    <Text type="secondary" className="subtitle-clean">
                        Додаткові послуги для вашої комфортної подорожі залізницею.
                    </Text>
                </div>

                <Row gutter={[24, 24]} justify="center">
                    {services.map((service, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Card hoverable className="service-card-minimal">
                                <div className="icon-box-small" style={{ backgroundColor: service.color }}>
                                    {service.icon}
                                </div>
                                <Title level={5} className="card-title-text">{service.title}</Title>
                                <Text className="card-desc-text" style = {{fontWeight: "bold", color: "grey", fontSize: "13px"}}>{service.desc}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};

export default ServicesSection;