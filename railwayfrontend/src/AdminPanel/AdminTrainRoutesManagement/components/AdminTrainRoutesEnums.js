const SPEED_TYPE_OPTIONS = {
    0: 'Експрес',
    1: 'Швидкий',
    2: 'Звичайного курсування',
};

const TRIP_TYPE_OPTIONS = {
    0: 'Нічний далекого сполучення',
    1: 'Денний далекого сполучення',
    2: 'Нічний Інтерсіті',
    3: 'Денний Інтерсіті',
    4: 'Нічний регіональний',
    5: 'Денний регіональний',
    6: 'Місцевий',
};

const FREQUENCY_TYPE_OPTIONS = {
    0: 'Щоденний',
    1: 'Через день',
    2: 'По особливих датах',
};

const ASSIGNMENT_TYPE_OPTIONS = {
    0: 'Цілорічний',
    1: 'Сезонний',
    2: 'Додатковий',
    3: 'Спеціальний',
};

const TRAIN_QUALITY_CLASS_OPTIONS = {
    0: 'S',
    1: 'A',
    2: 'B',
    3: 'C',
};
const RAILWAY_BRANCH_OPTIONS = {
    "Lviv Railway": "Львівська Залізниця",
    "Odesa Railway": "Одеська Залізниця",
    "South-Western Railway": "Південно-Західна Залізниця",
    "South Railway": "Південна Залізниця",
    "Dnipro Railway": "Дніпровська Залізниця",
    "Donetsk Railway": "Донецька Залізниця",
}

export {SPEED_TYPE_OPTIONS, TRIP_TYPE_OPTIONS, FREQUENCY_TYPE_OPTIONS,
    ASSIGNMENT_TYPE_OPTIONS, TRAIN_QUALITY_CLASS_OPTIONS, RAILWAY_BRANCH_OPTIONS};