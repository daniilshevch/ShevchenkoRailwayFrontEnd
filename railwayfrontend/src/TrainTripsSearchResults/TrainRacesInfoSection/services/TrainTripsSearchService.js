import {
    FETCH_TRAIN_TRIPS_WITH_DETAILED_BOOKINGS_INFO_URL,
    FETCH_TRAIN_TRIPS_WITHOUT_DETAILED_BOOKINGS_INFO_URL, REFRESH_TRAIN_TRIP_WITH_BOOKINGS_INFO_DATA_URL
} from "../../../../SystemUtils/ServerConnectionConfiguration/Urls/TrainSearchUrls.js";
import {
    EAGER_BOOKINGS_SEARCH_MODE
} from "../../../../SystemUtils/ServerConnectionConfiguration/ProgramFunctioningConfiguration/ProgramFunctioningConfiguration.js";
class TrainSearchService {
    async FETCH_TRIPS(startStation, endStation, departureDate) {
        const url = EAGER_BOOKINGS_SEARCH_MODE
            ? FETCH_TRAIN_TRIPS_WITH_DETAILED_BOOKINGS_INFO_URL(startStation, endStation, departureDate)
            : FETCH_TRAIN_TRIPS_WITHOUT_DETAILED_BOOKINGS_INFO_URL(startStation, endStation, departureDate);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    }
    FILTER_TRIPS(trainTripsList, showTrainsWithoutFreePlaces)
    {
        if (!trainTripsList) return [];
        return trainTripsList.filter(train => {
            if (showTrainsWithoutFreePlaces) return true;
            const stats = train.grouped_carriage_statistics_list || {};
            const totalFreePlaces = Object.values(stats).reduce((acc, cat) => acc + (cat.free_places || 0), 0);
            return totalFreePlaces > 0;
        });
    }
    SAVE_TRAIN_TRIP_DATA_TO_LOCAL_STORAGE(trainRaceInfo)
    {
        if (EAGER_BOOKINGS_SEARCH_MODE) {
            localStorage.setItem("generalTrainRaceData", JSON.stringify(trainRaceInfo));
        }
    }
    GET_CARRIAGE_TYPE_SELECTION_URL(trainRaceId, start, end, type)
    {
        return `/${trainRaceId}/${start}/${end}/carriages?type=${type}`;
    }
    GET_CARRIAGE_TYPE_WITH_QUALITY_CLASS_SELECTION_URL(trainRaceId, start, end, type, qualityClass)
    {
        return `/${trainRaceId}/${start}/${end}/carriages?type=${type}~${qualityClass}`;
    }
    async LOAD_TRAIN_DATA_FROM_SERVER(trainRaceId, start, end)
    {
        const response = await fetch(REFRESH_TRAIN_TRIP_WITH_BOOKINGS_INFO_DATA_URL(trainRaceId, start, end));
        if (!response.ok) {
            throw new Error("Помилка при оновленні даних");
        }
        const newData = await response.json();
        if(EAGER_BOOKINGS_SEARCH_MODE) {
            localStorage.setItem("generalTrainRaceData", JSON.stringify(newData));
        }
        return newData;
    };
    LOAD_TRAIN_DATA_FROM_CACHE(trainRaceId, start, end)
    {
        let finalTrainData = null;
        const cachedTrainData = localStorage.getItem("generalTrainRaceData");
        let useCache = false;
        if(EAGER_BOOKINGS_SEARCH_MODE && cachedTrainData)
        {
            try
            {
                const parsedTrainData = JSON.parse(cachedTrainData);
                let isSameTrainRace = String(parsedTrainData.train_race_id) === String(trainRaceId);
                let isSameStartStation = String(parsedTrainData.trip_starting_station_title) === String(start);
                let isSameEndStation = String(parsedTrainData.trip_ending_station_title) === String(end);
                let isMatch = isSameTrainRace && isSameStartStation && isSameEndStation;
                if(isMatch) {
                    useCache = true;
                    finalTrainData = parsedTrainData;
                }
            }
            catch(error)
            {
                console.error(error.message);
            }
        }
        return {finalTrainData, useCache};
    }

}
export const trainSearchService = new TrainSearchService();