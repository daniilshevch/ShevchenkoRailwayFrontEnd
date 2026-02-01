import React, { useState } from 'react';
import CarriageTypeAndQualityFilter from "../CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import { Button, Popover, Checkbox, theme } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useSearchParams } from 'react-router-dom';
import "./CarriageFilteringHeader.css";

function CarriageFilteringHeader({groupedSeats, initialSelectedTypes, initialSelectedSubtypes, onChange, onRefresh, isLoading})
{
    const { token } = theme.useToken();
    const [searchParams] = useSearchParams();
    const showCarriagesWithoutFreePlaces = searchParams.get("showFull") === "true";

    const handleShowCarriagesWithoutFreePlaces = (e) => {
        const isChecked = e.target.checked;
        onChange?.({
            queryParams: searchParams.getAll("type"),
            showCarriagesWithoutFreePlaces: isChecked
        });
    };

    return (
        <div className="carriage-filtering-toolbar">
            <div className="toolbar-left">
                <CarriageTypeAndQualityFilter
                    groupedSeats={groupedSeats}
                    initialSelectedTypes={initialSelectedTypes}
                    initialSelectedSubtypes={initialSelectedSubtypes}
                    onChange={onChange}
                />
            </div>

            <div className="toolbar-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                <Popover
                    content={
                        <div style={{ padding: '4px 0' }}>
                            <Checkbox
                                checked={showCarriagesWithoutFreePlaces}
                                onChange={handleShowCarriagesWithoutFreePlaces}
                            >
                                Без вільних місць
                            </Checkbox>
                        </div>
                    }
                    trigger="hover"
                    placement="bottomRight"
                >
                    <Button
                        icon={<FilterOutlined />}
                        style={{
                            borderColor: showCarriagesWithoutFreePlaces ? '#1677ff' : token.colorBorderSecondary,
                            color: showCarriagesWithoutFreePlaces ? '#1677ff' : 'inherit'
                        }}
                    >
                        Фільтри
                    </Button>
                </Popover>

                <Button
                    type="primary"
                    onClick={onRefresh}
                    loading={isLoading}
                >Оновити дані</Button>
            </div>
        </div>
    )
}
export default CarriageFilteringHeader;