import React from 'react';
import { Row, Col, Modal, Timeline, Typography } from 'antd';
import { stationTitleIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import './TrainScheduleModal.css';

//January
const { Text } = Typography;
const defineTripStopType = (train_stop) => {
    if(train_stop.is_final_trip_stop)
    {
        return "final-trip-stop";
    }
    else if(train_stop.is_start_trip_stop)
    {
        return "starting-trip-stop";
    }
    else if(train_stop.is_part_of_trip && !train_stop.is_final_trip_stop)
    {
        return "trip-segment";
    }
    else
    {
        return "non-trip-segment"
    }
}
const getColorForQualityClass = (trainQualityClass) =>
{
    if(trainQualityClass === "A")
    {
        return "red";
    }
    else if(trainQualityClass === "B")
    {
        return "#389e0d";
    }
    else if(trainQualityClass === "C")
    {
        return "blue";
    }
    else if(trainQualityClass === "S")
    {
        return "purple";
    }
    else
    {
        return "black";
    }

}
const getTrainStopDuration = (train_stop, stopDuration) => {
    if(train_stop.arrival_time != null && train_stop.departure_time != null)
    {
        return (<Text strong>{stopDuration}</Text>)
    }
    else if(train_stop.arrival_time == null)
    {
        return <Text strong>Початкова</Text>
    }
    else
    {
        return <Text strong>Кінцева</Text>
    }

}

//Refactored
const TrainScheduleModal = ({ visible, onClose, trainStops, trainRouteId, trainQualityClass, startingStationUkrainianTitle, endingStationUkraininTitle }) => {
    if(trainStops && trainStops.length > 0) {
        return (
            <Modal className="train-schedule-modal" onClose={onClose}
                   title={`Розклад руху поїзда ${trainRouteId} (${startingStationUkrainianTitle} - ${endingStationUkraininTitle})`}
                   open={visible}
                   onCancel={onClose}
                   footer={null}
                   width={550}
                   zIndex={2000}

            >
                <div className="timeline-header-container">
                    <div className="timeline-header-label">
                        <Text strong>Час</Text>
                    </div>
                    <div className="timeline-header-content-wrapper">
                        <Row gutter={16}>
                            <Col span={10}><Text strong>Станція</Text></Col>
                            <Col span={7}><Text strong>Зупинка</Text></Col>
                            <Col span={7}><Text strong>Відстань</Text></Col>
                        </Row>
                    </div>
                </div>

                <Timeline mode="left">
                    {trainStops.map((stop, index) => {
                        const arrival = stop.arrival_time
                            ? new Date(stop.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                            : '—';
                        const departure = stop.departure_time
                            ? new Date(stop.departure_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                            : '—';
                        const stopDuration = (stop.departure_time && stop.arrival_time)
                            ? `${(new Date(stop.departure_time) - new Date(stop.arrival_time)) / 60000} хв`
                            : '—';
                        const stopDistanceFromStartingStation = stop.distance_from_full_route_starting_station;

                        return (
                            <Timeline.Item
                                key={index}
                                color={stop.is_part_of_trip && !stop.is_final_trip_stop ? getColorForQualityClass(trainQualityClass) : 'gray'}
                                label={
                                    <div className="timeline-label">
                                        {arrival !== '—' && <div className="arrival-time">{arrival}</div>}
                                        {departure !== '—' && <div className="departure-time">{departure}</div>}
                                    </div>
                                }
                                className={`${defineTripStopType(stop)} class-${trainQualityClass}`}
                            >
                                <Row className="timeline-stop-content" gutter={0} align="middle">
                                    <Col span={10}>
                                        <Text
                                            strong
                                            style={{ width: '80%' }}
                                            ellipsis={{
                                                  tooltip: stationTitleIntoUkrainian(stop.station_title)
                                            }}>{stationTitleIntoUkrainian(stop.station_title)}</Text>
                                    </Col>
                                    <Col span={7}>
                                        <Text type="secondary">
                                            {getTrainStopDuration(stop, stopDuration)}
                                        </Text>
                                    </Col>
                                    <Col span={7}>
                                        <Text type="secondary">
                                            <Text strong>{stopDistanceFromStartingStation != null ? `${stopDistanceFromStartingStation} км` : '—'}</Text>
                                        </Text>
                                    </Col>
                                </Row>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </Modal>
        );
    }
    else
    {
        return (
            <Modal className="train-schedule-modal" onClose={onClose}
                       title="Розклад руху"
                       open={visible}
                       onCancel={onClose}
                       footer={null}
                       width={550}

        />
        );
    }
};
export default TrainScheduleModal;
