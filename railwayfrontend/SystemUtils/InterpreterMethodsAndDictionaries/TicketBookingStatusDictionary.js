const TicketBookingCartStatusOptions = [
    {english: "SELECTED_YET_NOT_RESERVED", ukrainian: "ОБРАНО"},
    {english: "RESERVED", ukrainian: "ЗАРЕЗЕРВОВАНО"},
    {english: "BOOKING_FAILED", ukrainian: "РЕЗЕРВАЦІЯ НЕ ВДАЛАСЬ"},
    {english: "EXPIRED", ukrainian: "РЕЗЕРВАЦІЯ ПРОСТРОЧЕНА"}
]
const TicketBookingServerStatusOptions = [
    {english: "Booking_In_Progress", ukrainian: "ТИМЧАСОВО ЗАРЕЗЕРВОВАНИЙ"},
    {english: "Booked_And_Active", ukrainian: "ГОТОВИЙ ДО ВИКОРИСТАННЯ"},
    {english: "Booked_And_Used", ukrainian: "В ПРОЦЕСІ ПОЇЗДКИ"},
    {english: "Archieved", ukrainian: "АРХІВНИЙ"},
    {english: "Returned", ukrainian: "ПОВЕРНЕНИЙ"},
]

const changeTicketBookingCartStatusIntoUkrainian = (english_status) =>
{
    return TicketBookingCartStatusOptions.find(st => st.english === english_status)?.ukrainian;
}
const changeTicketBookingServerStatusIntoUkrainian = (english_status) =>
{
    return TicketBookingServerStatusOptions.find(st => st.english === english_status)?.ukrainian;
}

export {changeTicketBookingCartStatusIntoUkrainian, changeTicketBookingServerStatusIntoUkrainian};