import {SERVER_URL} from "../ConnectionConfiguration.js";

export const FETCH_TRAIN_TRIPS_WITH_DETAILED_BOOKINGS_INFO_URL = (start, end, departureDate) =>
    `${SERVER_URL}/Client-API/TrainSearch/Search-Train-Routes-Between-Stations-With-Bookings/${start}/${end}?departure_date=${departureDate}`;
export const FETCH_TRAIN_TRIPS_WITHOUT_DETAILED_BOOKINGS_INFO_URL = (start, end, departureDate) =>
    `${SERVER_URL}/Client-API/TrainSearch/Search-Train-Routes-Between-Stations-With-Bookings-Without-Places/${start}/${end}?departure_date=${departureDate}`;
export const REFRESH_TRAIN_TRIP_WITH_BOOKINGS_INFO_DATA_URL = (train_race_id, start, end) =>
    `https://localhost:7230/Client-API/TrainSearch/get-full-train-race-info-with-bookings/${train_race_id}/${start}/${end}`;