import ReactSpeedometer from "react-d3-speedometer";
import React from "react";

const SpeedometerComponent = () => (
    <div style={{ width: 300, height: 200 }}>
        <ReactSpeedometer
            maxValue={140}
            value={65}
            needleColor="red"
            segments={14}
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
export default SpeedometerComponent;