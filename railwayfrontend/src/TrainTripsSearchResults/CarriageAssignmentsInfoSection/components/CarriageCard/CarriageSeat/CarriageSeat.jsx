import React, {useState} from 'react';
import './CarriageSeat.css';
import {Modal, Button, Typography} from 'antd';
const { Text } = Typography;
function CarriageSeat({ seatNumber, isFree, carriageType, carriageQualityClass, carriageNumber, onClick, price, startStation, endStation, isSeatSelectedInPotentialTicketCart, getTicketFromCart})
{
    const [isBookingCancellationModalOpen, setIsBookingCancellationModalOpen] = useState(false);
    const [isBookingFailedModalOpen, setIsBookingFailedModalOpen] = useState(false);
    let ticketInCart = null;
    let ticketStatus = null;
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
    else if(!isFree && isSelectedInPotentialCart && ticketStatus === "BOOKING_FAILED")
    {
        baseClass = "seat-selected-in-potential-cart-and-reserved-but-booking-failed";
    }
    else if(!isFree && isSelectedInPotentialCart)
    {
        baseClass = "seat-selected-in-potential-cart-and-reserved";
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
        else if(!isFree && isSelectedInPotentialCart)
        {
            setIsBookingCancellationModalOpen(true);
        }
    }
    const handleConfirmCancellation = () => {
        setIsBookingCancellationModalOpen(false);
        setIsBookingFailedModalOpen(false);
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
                        <Text strong style = {{color: "blue"}}> {seatNumber}</Text> у вагоні <Text strong style = {{color: "blue"}}>№ {carriageNumber}</Text> <Text>тимчасово зарезервовано за Вами</Text>.
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
        </>
    );
}
export default CarriageSeat;