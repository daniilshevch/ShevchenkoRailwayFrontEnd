export const stationsList = [
    { ukrainian: "Львів", english: "Lviv" },
    { ukrainian: "Одеса-Головна", english: "Odesa-Holovna" },
    { ukrainian: "Тернопіль", english: "Ternopil" },
    { ukrainian: "Хмельницький", english: "Khmelnytskyi" },
    { ukrainian: "Івано-Франківськ", english: "Ivano-Frankivsk" },
    { ukrainian: "Жмеринка", english: "Zhmerynka" },
    { ukrainian: "Ужгород", english: "Uzhgorod" },
    { ukrainian: "Яремче", english: "Yaremche" },
    { ukrainian: "Ясіня", english: "Yasinia" },
    { ukrainian: "Вапнярка", english: "Vapniarka" },
    { ukrainian: "Роздільна-1", english: "Rozdilna-1" },
    { ukrainian: "Подільськ", english: "Podilsk" },
    { ukrainian: "Кодима", english: "Kodyma" },
    { ukrainian: "Рудниця", english: "Rudnytsia" },
    { ukrainian: "Волочиськ", english: "Volochysk" },
    { ukrainian: "Підволочиськ", english: "Pidvolochysk" },
    { ukrainian: "Злочів", english: "Zlochiv" },
    { ukrainian: "Красне", english: "Krasne" },
    { ukrainian: "Стрий", english: "Stryi" },
    { ukrainian: "Сколе", english: "Skole" },
    { ukrainian: "Славсько", english: "Slavsko" },
    { ukrainian: "Воловець", english: "Volovets" },
    { ukrainian: "Свалява", english: "Svaliava" },
    { ukrainian: "Карпати", english: "Karpaty" },
    { ukrainian: "Мукачево", english: "Mukachevo" }

];
export function stationTitleIntoUkrainian(station_title)
{
    return stationsList.find(station => station.english === station_title)?.ukrainian ?? station_title;
}
