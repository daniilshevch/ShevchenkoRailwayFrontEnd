import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Segmented, Button, Space } from "antd";
import {DoubleLeftOutlined, DoubleRightOutlined} from "@ant-design/icons";
import "./DateSlider.css";
const createDayButton = (date) => ({
   value: date.format("YYYY-MM-DD"),
    label: (
        <div className="date_pill">
            <div className="date_pill_day_number">{date.format("D MMMM")}</div>
            <div className="date_pill_weekday">{date.format("dddd")}</div>
        </div>
    )
});
function DateSlider({start = dayjs(), value, onChange})
{
    const [offset, setOffset] = useState(0);
    const [innerValue, setInnerValue] = useState(start.format("YYYY-MM-DD"));
    const center = start.add(offset, "day");
    const options = [];
    for(let current_offset = -2; current_offset <= 2; current_offset++)
    {
        options.push(createDayButton(center.add(current_offset, "day")));
    }
    const segValue = value ?? innerValue ?? options[2].value;
    const handleChange = (value) => {
        if(onChange !== undefined)
        {
            onChange(value);
        }
        setInnerValue(value);
    }
    return (
        <Space align="center" className="date-strip">
            <Button
                icon={<DoubleLeftOutlined />}
                type="text"
                onClick={() => setOffset((current) => current - 1)}
            />
            <Segmented
                options={options}
                value={segValue}
                onChange={handleChange}
                className="date-strip__segmented"
            />
            <Button
                icon={<DoubleRightOutlined />}
                type="text"
                onClick={() => setOffset((current) => current + 1)}
            />
        </Space>
    );
}
export default DateSlider;