const brandedNames = [
    {english: "Western Express", ukrainian: "Західний Експрес"},
    {english: "White Acacia", ukrainian: "Біла акація"},
    {english: "Gorgany", ukrainian: "Горгани"},
    {english: "Carpathian Origin", ukrainian: "Джерело Карпат"},
    {english: "Bessarabian Express", ukrainian: "Бесарабський Експрес"},
    {english: "Molfar", ukrainian: "Мольфар"},
];
function changeTrainRouteBrandedNameIntoUkrainian(brandedName)
{
    return brandedNames.find(train_route => train_route.english === brandedName)?.ukrainian;
}
export default changeTrainRouteBrandedNameIntoUkrainian;