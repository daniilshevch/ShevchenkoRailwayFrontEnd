import React from 'react';
import { Modal, Timeline, Typography } from 'antd';
import { stationTitleIntoUkrainian } from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/StationsDictionary.js";
import './TrainScheduleModal.css';

const { Text } = Typography;
const defineTripStopType = (train_stop) => {
    if(train_stop.is_final_trip_stop)
    {
        return "final-trip-stop";
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
const TrainScheduleModal = ({ visible, onClose, trainStops }) => {
    if(trainStops && trainStops.length > 0) {
        return (
            <Modal className="train-schedule-modal" onClose={onClose}
                   title="Розклад руху"
                   open={visible}
                   onCancel={onClose}
                   footer={null}
                   width={550}

            >
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

                        return (
                            <Timeline.Item
                                key={index}
                                color={stop.is_part_of_trip && !stop.is_final_trip_stop ? 'green' : 'gray'}
                                //label={departure !== '—' ? `${departure}` : arrival}
                                label={
                                    <div className="timeline-label">
                                        {arrival !== '—' && <div className="arrival-time">{arrival}</div>}
                                        {departure !== '—' && <div className="departure-time">{departure}</div>}
                                    </div>
                                }
                                className={defineTripStopType(stop)}
                            >
                                <div className="timeline-stop-inline">
                                    <div>
                                        <Text strong>{stationTitleIntoUkrainian(stop.station_title)}</Text><br/>
                                    </div>
                                </div>
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
