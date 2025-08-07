import ReactSpeedometer from "react-d3-speedometer";
import React from "react";

const SpeedometerComponent = ({speed}) => {
    if(speed > 140)
    {
        speed = 140;
    }
    return (
        <div>
            <ReactSpeedometer
                maxValue={140}
                value={speed}
                needleColor="red"
                segments={14}
                width={150}
                height={80}
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
);
}
export default SpeedometerComponent;