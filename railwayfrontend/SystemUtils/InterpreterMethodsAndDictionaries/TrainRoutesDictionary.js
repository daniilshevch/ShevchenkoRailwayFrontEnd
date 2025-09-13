const lettersDictionary =
    {
        "SH": "Ш",
        "K": "K"
    }
    export function getTrainRouteIdFromTrainRaceId(trainRaceId)
    {
        const parts = trainRaceId.split("_");
        return parts[0];
    }
    function changeTrainRouteIdIntoUkrainian(trainRouteId)
    {
        if(!trainRouteId)
        {
            return null;
        }
        for (const key of Object.keys(lettersDictionary).sort((a, b) => b.length - a.length)) {
            if (trainRouteId.endsWith(key)) {
                const baseNumber = trainRouteId.slice(0, -key.length);
                return baseNumber + lettersDictionary[key];
            }
        }
        return trainRouteId; // якщо нічого не замінено
    }
    export default changeTrainRouteIdIntoUkrainian;