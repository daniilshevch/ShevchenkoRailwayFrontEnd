import React, { useState, useEffect } from "react";
import { Modal, Button, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SingleTicketBookingProfilePage from "../SingleTicketBookingProfilePage/SingleTicketBookingProfilePage.jsx"; // Імпортуємо сторінку

const { Text } = Typography;

export default function TicketBookingModal({ visible, onClose, tickets, initialIndex }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (visible && typeof initialIndex === 'number') {
            setCurrentIndex(initialIndex);
        }
    }, [visible, initialIndex]);

    if (!tickets || tickets.length === 0) return null;

    const handleNext = () => {
        if (currentIndex < tickets.length - 1) setCurrentIndex(prev => prev + 1);
    };
    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            title={`Квиток ${currentIndex + 1} з ${tickets.length}`}
            bodyStyle={{ paddingBottom: 20 }}
        >
            <div style={{ padding: "20px 0" }}>

                {/* ВСТАВЛЯЄМО КОМПОНЕНТ СТОРІНКИ */}
                <SingleTicketBookingProfilePage t={tickets[currentIndex]} />

                {/* НАВІГАЦІЯ (Якщо квитків більше ніж 1) */}
                {tickets.length > 1 && (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "24px",
                        padding: "0 10px" // Трохи відступів
                    }}>
                        <Button
                            icon={<LeftOutlined />}
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            size="large"
                        >
                            Попередній
                        </Button>

                        <Text strong style={{ fontSize: "16px" }}>
                            {currentIndex + 1} / {tickets.length}
                        </Text>

                        <Button
                            onClick={handleNext}
                            disabled={currentIndex === tickets.length - 1}
                            size="large"
                        >
                            Наступний <RightOutlined />
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}