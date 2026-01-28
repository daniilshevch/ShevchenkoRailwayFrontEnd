import ReactSpeedometer from "react-d3-speedometer";
import React from "react";
import {Tooltip} from 'antd';
//January
const SpeedometerComponent = ({speed}) => {
    if(speed > 140)
    {
        speed = 140;
    }
    return (
        <Tooltip
            title={`Поїзд розвиває середню швидкістю ${Math.round(speed)} км/год`}
            placement="top"
            mouseEnterDelay={0.1}
            overlayStyle={{ maxWidth: '350px' }}
        >
        <div style = {{width: 120, height: 70, overflow: "hidden"}}>
            <div style={{ transform: "scale(0.4)", transformOrigin: "top left" }}>
            <ReactSpeedometer
                maxValue={140}
                value={speed}
                needleColor="red"
                segments={14}
                currentValueText=" "
                segmentColors={[
                    "#000000",
                    "#7e1b0a",
                    "#ff3300",
                    "#ff5e00",
                    "#ff9900",
                    "#ffc000",
                    "#ffee00",
                    "#d9ff00",
                    "#b2ff00",
                    "#8cff00",
                    "#00cc44",
                    "#00b38f",
                    "#19a2d5",
                    "#3366ff",
                ]}
            />
            </div>
        </div>
        </Tooltip>
);
}
export default SpeedometerComponent;