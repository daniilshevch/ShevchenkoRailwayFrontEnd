const brandedNames = [
    {english: "Western Express", ukrainian: "Західний Експрес"},
    {english: "White Acacia", ukrainian: "Біла акація"},
    {english: "Gorgany", ukrainian: "Горгани"}
];
function changeTrainRouteBrandedNameIntoUkrainian(brandedName)
{
    return brandedNames.find(train_route => train_route.english === brandedName)?.ukrainian;
}
export default changeTrainRouteBrandedNameIntoUkrainian;