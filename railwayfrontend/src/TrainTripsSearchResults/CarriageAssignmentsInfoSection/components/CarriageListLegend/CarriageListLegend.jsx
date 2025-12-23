import React from 'react';
import { Avatar, Typography, Divider } from 'antd';
import './CarriageListLegend.css';

const { Text, Title } = Typography;

function CarriageListLegend() {
    return (
        <div className="carriage-legend">
            <Title level={5} className="legend-main-title">Умовні позначки</Title>

            <div className="legend-layout">
                {/* ЛІВА ЧАСТИНА: КЛАСИ ВАГОНІВ */}
                <div className="legend-left-side">
                    <div className="legend-class-row">
                        <div className="legend-visuals">
                            <Avatar size="default" style={{ backgroundColor: '#ff4d4f', fontWeight: 'bold' }}>A</Avatar>
                            <div className="seat-sample seat seat-free seat-A">1</div>
                        </div>
                        <div className="legend-text">
                            <Text strong className="class-title">Клас A — Елітні вагони з передовими технологіями</Text>
                            <Text type="secondary" className="class-desc">Телевізор в купе, душ, сейфи для особистих речей, електронна карта-ключ для купе</Text>
                        </div>
                    </div>

                    <div className="legend-class-row">
                        <div className="legend-visuals">
                            <Avatar size="default" style={{ backgroundColor: '#52c41a', fontWeight: 'bold' }}>B</Avatar>
                            <div className="seat-sample seat seat-free seat-B">1</div>
                        </div>
                        <div className="legend-text">
                            <Text strong className="class-title">Клас B — Покращений варіант з ексклюзивними послугами</Text>
                            <Text type="secondary" className="class-desc">Безкоштовний WI-FI, доставка їжі з вагону-ресторану</Text>
                        </div>
                    </div>

                    <div className="legend-class-row">
                        <div className="legend-visuals">
                            <Avatar size="default" style={{ backgroundColor: '#1890ff', fontWeight: 'bold' }}>C</Avatar>
                            <div className="seat-sample seat seat-free seat-C">1</div>
                        </div>
                        <div className="legend-text">
                            <Text strong className="class-title">Клас C — Базовий варіант для комфортних поїздок</Text>
                            <Text type="secondary" className="class-desc">Кондиціонування повітря, розетки, продаж снеків та напоїв</Text>
                        </div>
                    </div>
                </div>

                <Divider type="vertical" className="legend-divider-vertical" />

                {/* ПРАВА ЧАСТИНА: СТАТУСИ ТА ЗАГОТОВКА ПІД СЕРВІСИ */}
                <div className="legend-right-side">
                    <div className="status-grid">
                        <div className="legend-item">
                            <div className="seat-sample seat seat-taken">1</div>
                            <Text className="status-label">Зайняте місце</Text>
                        </div>
                        <div className="legend-item">
                            <div className="seat-sample seat seat-selected-in-potential-cart">1</div>
                            <Text className="status-label">У кошику</Text>
                        </div>
                    </div>
                    {/* Тут залишиться місце для пояснення іконок сервісів */}
                </div>
            </div>
        </div>
    );
}

export default CarriageListLegend;