import CarriageTypeAndQualityFilter from "../CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import {Button, Typography} from "antd";
import "./TrainRaceInfoHeader.css";
function TrainRaceInfoHeader()
{
    return (
        <>
            <div className="train-race-info-toolbar">
                <div className="toolbar-left">
                    <Typography type="secondary">244K Одеса - Львів</Typography>
                </div>
                <div className="toolbar-right">
                    <Button type="primary" onClick={() => {}}>Оновити дані</Button>
                </div>
            </div>
        </>
    )
}
export default TrainRaceInfoHeader;