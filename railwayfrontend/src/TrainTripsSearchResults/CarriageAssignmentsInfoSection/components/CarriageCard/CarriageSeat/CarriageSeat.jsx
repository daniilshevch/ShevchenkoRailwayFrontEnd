import React, {useState} from 'react';
import './CarriageSeat.css';
import {Modal, Button, Typography} from 'antd';
import { ClockCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
const { Text } = Typography;
function CarriageSeat({ seatNumber, isFree, carriageType, carriageQualityClass, carriageNumber, onClick, price, startStation, endStation, isSeatSelectedInPotentialTicketCart, getTicketFromCart})
{
    const [isBookingCancellationModalOpen, setIsBookingCancellationModalOpen] = useState(false);
    const [isBookingFailedModalOpen, setIsBookingFailedModalOpen] = useState(false);
    const [isBookingExpiredModalOpen, setIsBookingExpiredModalOpen] = useState(false);

    let ticketInCart = null;
    let ticketStatus = null;
    let statusIcon = null;
    if(!isFree && isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation)) {
        ticketInCart = getTicketFromCart(carriageNumber, seatNumber, startStation, endStation);
        ticketStatus = ticketInCart?.ticket_status;
    }
    const isSelectedInPotentialCart = isSeatSelectedInPotentialTicketCart(carriageNumber, seatNumber, startStation, endStation);
    let baseClass = "";
    if(isFree && !isSelectedInPotentialCart)
    {
        baseClass = "seat-free";
    }
    else if(isFree && isSelectedInPotentialCart)
    {
        baseClass = "seat-selected-in-potential-cart";
    }
    else if(!isFree && isSelectedInPotentialCart && ticketStatus === "EXPIRED")
    {
        baseClass = "seat-selected-in-potential-cart-and-reserved-but-expired";
        statusIcon = <ClockCircleFilled className="seat-badge-icon expired" />;
    }
    else if(!isFree && isSelectedInPotentialCart && ticketStatus === "BOOKING_FAILED")
    {
        baseClass = "seat-selected-in-potential-cart-and-reserved-but-booking-failed";
        statusIcon = <CloseCircleFilled className="seat-badge-icon failed" />;
    }
    else if(!isFree && isSelectedInPotentialCart && ticketStatus === "RESERVED")
    {
        baseClass = "seat-selected-in-potential-cart-and-reserved";
        statusIcon = <CheckCircleFilled className="seat-badge-icon success" />;

    }
    else
    {
        baseClass = "seat-taken";
    }
    const classByType = carriageType ? `seat-type-${carriageType}` : '';
    const classByQuality = carriageQualityClass ? `seat-${carriageQualityClass}` : '';

    const onClickActionDependingOnStatus = () => {
        if(isFree)
        {
            onClick(carriageNumber, seatNumber, price, startStation, endStation, carriageType, carriageQualityClass);
        }
        else if(!isFree && isSelectedInPotentialCart && ticketStatus === "BOOKING_FAILED")
        {
            setIsBookingFailedModalOpen(true);
        }
        else if(!isFree && isSelectedInPotentialCart && ticketStatus === "EXPIRED")
        {
            setIsBookingExpiredModalOpen(true);
        }
        else if(!isFree && isSelectedInPotentialCart && ticketStatus === "RESERVED")
        {
            setIsBookingCancellationModalOpen(true);
        }
    }
    const handleConfirmCancellation = () => {
        setIsBookingCancellationModalOpen(false);
        setIsBookingFailedModalOpen(false);
        setIsBookingExpiredModalOpen(false);
        onClick(carriageNumber, seatNumber, price, startStation, endStation, carriageType, carriageQualityClass);
    };
    return (
        <>
            <button
                className={`seat ${baseClass} ${classByQuality} ${classByType}`}
                disabled={!isFree && !isSelectedInPotentialCart}
                onClick={onClickActionDependingOnStatus}
            >
                {seatNumber}
                {statusIcon}
            </button>
            <Modal
                title="Бронювання успішне. Бажаєте скасувати?"
                open={isBookingCancellationModalOpen}
                onOk={handleConfirmCancellation}
                onCancel={() => setIsBookingCancellationModalOpen(false)}
                okText="Так, скасувати"
                cancelText="Ні, залишити"
                okButtonProps={{ danger: true }}
                centered
            >
                <div style={{ padding: '10px 0' }}>
                    <Text strong>
                        На даний момент місце
                        <Text strong style = {{color: "green"}}> {seatNumber}</Text> у вагоні <Text strong style = {{color: "green"}}>№ {carriageNumber}</Text> <Text>тимчасово зарезервовано за Вами</Text>.
                        Ви бажаєте скасувати резервацію цього місця?
                    </Text>
                    <br />
                    <Text style={{ fontSize: '13px', color: "gray", fontWeight: 'bold' }}>
                        * Місце знову стане доступним для інших пасажирів.
                    </Text>
                </div>
            </Modal>
            <Modal
                title="Бронювання не вдалось"
                open={isBookingFailedModalOpen}
                onOk={handleConfirmCancellation}
                onCancel={() => setIsBookingFailedModalOpen(false)}
                okText="ОК"
                cancelText="Вийти"
                okButtonProps={{ danger: false }}
                centered
            >
                <div style={{ padding: '10px 0' }}>
                    <Text strong>
                        Ваша резервація для місця
                        <Text strong style = {{color: "red"}}> {seatNumber}</Text> у вагоні <Text strong style = {{color: "red"}}>№ {carriageNumber}</Text> <Text>не вдалась</Text>. Ймовірно, інший пасажир встиг забронювати місце раніше за Вас.
                    </Text>
                    <br />
                    <Text style={{ fontSize: '13px', color: "gray", fontWeight: 'bold' }}>
                        * Натисніть ОК - і місце буде видалено з Вашого кошику квитків
                    </Text>
                </div>
            </Modal>
            <Modal
                title="Бронювання прострочене"
                open={isBookingExpiredModalOpen}
                onOk={handleConfirmCancellation}
                onCancel={() => setIsBookingExpiredModalOpen(false)}
                okText="ОК"
                cancelText="Вийти"
                okButtonProps={{ danger: false }}
                centered
            >
                <div style={{ padding: '10px 0' }}>
                    <Text strong>
                        Ваша резервація для місця
                        <Text strong style = {{color: "orange"}}> {seatNumber}</Text> у вагоні <Text strong style = {{color: "orange"}}>№ {carriageNumber}</Text> <Text>закінчилась</Text>. Видаліть місце з кошику і спробуйте забронювати його повторно.
                    </Text>
                    <br />
                    <Text style={{ fontSize: '13px', color: "gray", fontWeight: 'bold' }}>
                        * Натисніть ОК - і місце буде видалено з Вашого кошику квитків
                    </Text>
                    <br />
                </div>
            </Modal>
        </>
    );
}
export default CarriageSeat;