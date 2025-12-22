const carriageTypes = [
    {"english": "SV", "ukrainian": "СВ"},
    {"english": "Coupe", "ukrainian": "Купе"},
    {"english": "Platskart", "ukrainian": "Плацкарт"}
];
const changeCarriageTypeIntoUkrainian = (carriageType) => {
    return carriageTypes.find(carriage_type => carriage_type.english === carriageType)?.ukrainian;
}
export {changeCarriageTypeIntoUkrainian};