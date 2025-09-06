import React, {useMemo, useState} from "react";
import { Segmented, Popover, Checkbox, Tag, Badge, Space, Typography, Tooltip, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
function CarriageTypeAndQualityFilter(
    {
        groupedSeats = {},
        initialSelectedTypes = [],
        initialSelectedClasses = [],
        onChange
    })
{
    const carriageTypes = useMemo(() => Object.keys(groupedSeats), [groupedSeats]);
    const [selectedTypes, setSelectedTypes] = useState(() => {
        return initialSelectedTypes.filter(type => carriageTypes.includes(type));
    });
    
}