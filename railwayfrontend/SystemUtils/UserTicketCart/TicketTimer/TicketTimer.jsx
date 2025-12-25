import React, {useEffect, useState} from "react";
import {Typography} from "antd";

const { Text, Title } = Typography;
export const TicketTimer = ({ expirationTime, onExpire }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(expirationTime) - new Date();
        return difference > 0 ? difference : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onExpire) onExpire();
            return;
        }

        const timer = setInterval(() => {
            const nextTime = calculateTimeLeft();
            setTimeLeft(nextTime);

            if (nextTime <= 0) {
                clearInterval(timer);
                if (onExpire) onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expirationTime]);

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    if (timeLeft <= 0) return <Text type="danger" style={{ marginLeft: '4px', fontWeight:500 }}>(0:00)</Text>;

    const isExpiringSoon = timeLeft < 60000; // менше 1 хвилини

    return (
        <Text
            strong
            style={{
                marginLeft: '2px',
                color: isExpiringSoon ? '#faad14' : '#52c41a',
                fontSize: '0.95em',
                fontWeight: 500
            }}
        >
            ({minutes}:{seconds < 10 ? `0${seconds}` : seconds})
        </Text>
    );
}