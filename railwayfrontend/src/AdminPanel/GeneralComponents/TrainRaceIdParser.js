export function parseTrainRaceId(trainRaceId) {
    const parts = trainRaceId.split('_');

    if (parts.length !== 4) {
        throw new Error("Невірний формат ідентифікатора рейсу");
    }

    const [trainRouteId, year, month, day] = parts;
    const date = `${year}-${month}-${day}`;

    return {
        trainRouteId,
        date
    };
}