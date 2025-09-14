const TicketBookingStatusOptions = [
    {english: "SELECTED_YET_NOT_RESERVED", ukrainian: "ОБРАНО"}
]
const changeTicketBookingStatusIntoUkrainian = (english_status) =>
{
    return TicketBookingStatusOptions.find(st => st.english === english_status)?.ukrainian;
}
export {changeTicketBookingStatusIntoUkrainian};