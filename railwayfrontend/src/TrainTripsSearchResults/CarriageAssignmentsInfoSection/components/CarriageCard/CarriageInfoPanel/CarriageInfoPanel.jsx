import React from 'react';
// Додаємо Avatar, прибираємо Tb... іконки
import { Space, Tag, Typography, Tooltip, Divider, Avatar } from 'antd';
import { FaSnowflake } from "react-icons/fa";
import { IoWifi } from "react-icons/io5";
import { FaShower } from "react-icons/fa6";
import { GrCafeteria } from "react-icons/gr";
import { TbDisabled } from "react-icons/tb";
import { GiElectricalSocket } from "react-icons/gi";
// TbCircle... іконки більше не потрібні
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";

const { Text, Title } = Typography;

function CarriageInfoPanel({ carriageNumber, type, qualityClass, features, freePlaces, totalPlaces, price }) {

    const classAvatars = {
        A: (
            <Tooltip title="Клас A">
                <Avatar style={{ backgroundColor: '#ff4d4f', color: 'white', fontWeight: 'bold' }}>
                    A
                </Avatar>
            </Tooltip>
        ),
        B: (
            <Tooltip title="Клас В">
                <Avatar style={{ backgroundColor: '#52c41a', color: 'white', fontWeight: 'bold' }}>
                    B
                </Avatar>
            </Tooltip>
        ),
        C: (
            <Tooltip title="Клас С">
                <Avatar style={{ backgroundColor: '#1890ff', color: 'white', fontWeight: 'bold' }}>
                    C
                </Avatar>
            </Tooltip>
        ),
    };

    return (
        <div style={{ padding: '4px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">

                {/* 1. Рядок Заголовка: Клас, Номер і Ціна (з <Avatar>) */}
                <Space
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '115%'
                    }}
                >
                    <Space align="center" size="small">
                        {classAvatars[qualityClass]} {/* Використовуємо <Avatar> */}
                        <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>Вагон №{carriageNumber}</Title>
                    </Space>
                    <Text strong style={{ fontSize: '1.2em', color: 'blue', whiteSpace: 'nowrap'}}>{price}₴</Text>
                </Space>

                <Divider style={{ margin: '4px 0', width: '120%' }} />

                {/* 2. Рядок Тегів: Тип і Місця */}
                <Space size="small" wrap>
                    <Tag color="blue" style={{ fontSize: '14px', padding: '2px 6px' }}>
                        {changeCarriageTypeIntoUkrainian(type)}
                    </Tag>
                    <Tag
                        color={freePlaces > 0 ? 'green' : 'red'}
                        style={{ fontSize: '14px', padding: '2px 6px' }}
                    >
                        Місця: {freePlaces}/{totalPlaces}
                    </Tag>
                </Space>

                {/* 3. Блок іконок 2x3 (залишаємо як є) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)', // 3 колонки однакової ширини
                    gap: '12px', // Відступ між іконками
                    fontSize: '24px', // Збільшений розмір
                    textAlign: 'center', // Центруємо іконки в колонках
                    marginTop: '8px' // Невеликий відступ зверху
                }}>
                    <Tooltip title={features.air_conditioning ? "Вагон обладнано кондиціонером" : "Кондиціонер в вагоні відсутній"}>
                        <FaSnowflake style={{ color: features.air_conditioning ? 'cornflowerblue' : '#ccc' }} />
                    </Tooltip>
                    <Tooltip title={features.wifi_availability ? "В вагоні доступний Wi-Fi" : "Wi-Fi у вагоні відсутній"}>
                        <IoWifi style={{ color: features.wifi_availability ? 'seagreen' : '#ccc' }} />
                    </Tooltip>
                    <Tooltip title={features.shower_availability ? "В вагоні можна скористатись душем" : "В вагоні не можна скористатись душем"}>
                        <FaShower style={{ color: features.shower_availability ? '#00bcd4' : '#ccc' }} />
                    </Tooltip>
                    <Tooltip title={features.food_availability ? "В вагон можна замовити харчування з вагону-ресторану" : "Харчування (відсутнє)"}>
                        <GrCafeteria style={{ color: features.food_availability ? 'darkorange' : '#ccc' }} />
                    </Tooltip>
                    <Tooltip title={features.is_inclusive ? "Вагон є інклюзивним" : "Вагон не є інклюзивним"}>
                        <TbDisabled style={{ color: features.is_inclusive ? 'seagreen' : '#ccc' }} />
                    </Tooltip>
                    <Tooltip title="Розетки">
                        <GiElectricalSocket style={{ color: 'mediumpurple' }} />
                    </Tooltip>
                </div>
            </Space>
        </div>
    );
}

export default CarriageInfoPanel;