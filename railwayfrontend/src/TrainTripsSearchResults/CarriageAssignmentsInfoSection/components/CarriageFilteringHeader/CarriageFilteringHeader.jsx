import React, { useState } from 'react';
import CarriageTypeAndQualityFilter from "../CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import { Button, Popover, Checkbox, theme } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useSearchParams } from 'react-router-dom'; // Додали для безпеки даних
import "./CarriageFilteringHeader.css";

function CarriageFilteringHeader({groupedSeats, initialSelectedTypes, initialSelectedSubtypes, onChange, onRefresh, isLoading})
{
    const { token } = theme.useToken();
    const [searchParams] = useSearchParams();
    const [showCarriagesWithoutFreePlaces, setShowCarriagesWithoutFreePlaces] = useState(false);

    const handleShowCarriagesWithoutFreePlaces = (e) => {
        const isChecked = e.target.checked;
        setShowCarriagesWithoutFreePlaces(isChecked);

        // Щоб не зламати фільтрацію типів у батьківському компоненті,
        // ми передаємо поточні параметри з URL разом з новим значенням чекбокса
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

            {/* Права частина з Flexbox */}
            <div className="toolbar-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* --- Кнопка перенесена сюди --- */}
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