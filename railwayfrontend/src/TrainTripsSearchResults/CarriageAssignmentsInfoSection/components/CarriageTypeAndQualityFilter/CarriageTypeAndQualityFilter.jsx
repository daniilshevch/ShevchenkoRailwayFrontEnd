import React, { useMemo, useState, useEffect } from "react";
import { Segmented, Popover, Checkbox, Tag, Space, theme } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";
import "./CarriageTypeAndQualityFilter.css";

const getSubtypeColor = (subtype) => {
    switch (subtype) {
        case 'A': return '#ff4d4f'; // Яскравий червоний
        case 'B': return '#52c41a'; // Яскравий зелений
        case 'C': return '#1677ff'; // Яскравий синій
        case 'S': return '#722ed1'; // Фіолетовий
        default: return '#8c8c8c';
    }
};
const getLightSubtypeColor = (subtype) => {
    switch (subtype) {
        case 'A': return '#ffccc7'; // Світло-червоний (більш насичений)
        case 'B': return '#d9f7be'; // Світло-зелений (більш насичений)
        case 'C': return '#bae7ff'; // Світло-синій (більш насичений)
        case 'S': return '#efdbff'; // Світло-фіолетовий (більш насичений)
        default: return '#f5f5f5';
    }
};

export default function CarriageTypeAndQualityFilter({
                                                         groupedSeats = {},
                                                         initialSelectedTypes,
                                                         initialSelectedSubtypes,
                                                         onChange
                                                     }) {
    const { token } = theme.useToken();
    const carriageTypes = useMemo(() => Object.keys(groupedSeats), [groupedSeats]);
    const [selectedTypes, setSelectedTypes] = useState(() => initialSelectedTypes);
    const [initiallyLoaded, setInitiallyLoaded] = useState(false);
    const [selectedSubtypes, setSelectedSubtypes] = useState(() => {
        const checkedSubtypes = {};
        for (const type of initialSelectedTypes) {
            const initialSubtypes = initialSelectedSubtypes?.[type] ?? [];
            checkedSubtypes[type] = Array.isArray(initialSubtypes) ? Array.from(new Set(initialSubtypes)) : [];
        }
        return checkedSubtypes;
    });
    const getQueryStringParams = (typesArray, subtypesDictionary) => {
        return typesArray.map(type => {
            const subtypes = subtypesDictionary[type] || [];
            return subtypes.length ? `${type}~${subtypes.join("*")}` : type;
        })
    };
    const implementCarriageFilteringChanges = (nextTypes, nextSubtypes) => {
        const queryParams = getQueryStringParams(nextTypes, nextSubtypes);
        onChange?.({
            selectedTypes: nextTypes,
            selectedSubtypes: nextSubtypes,
            queryParams: queryParams
        });
    }

    useEffect(() => {
        if (!carriageTypes.length || initiallyLoaded) return;
        const nextSub = {};
        for (const t of carriageTypes) {
            const init = initialSelectedSubtypes?.[t] ?? [];
            if (init.length > 0 && init[0] === "All") {
                nextSub[t] = ["S", "A", "B", "C"]
            }
            else {
                nextSub[t] = Array.isArray(init) ? Array.from(new Set(init)) : [];
            }
        }
        const nextTypes = carriageTypes.filter(t => (nextSub[t]?.length ?? 0) > 0);
        setSelectedSubtypes(nextSub);
        setSelectedTypes(nextTypes);
        implementCarriageFilteringChanges(nextTypes, nextSub);
        setInitiallyLoaded(true);
    }, [carriageTypes, initialSelectedSubtypes, initiallyLoaded]);

    useEffect(() => {
        setSelectedTypes(previous => previous.filter(type => carriageTypes.includes(type)));
        setSelectedSubtypes(previous => {
            const nextSubtypes = {};
            for (const type of carriageTypes) {
                nextSubtypes[type] = Array.isArray(previous[type]) ? previous[type] : [];
            }
            return nextSubtypes;
        });
    }, [carriageTypes]);

    const getClassEntries = (type) => {
        const statsForCarriageType = groupedSeats[type];
        if (!statsForCarriageType) return [];
        const carriageQualityClassDictionary = statsForCarriageType.carriage_quality_class_dictionary || {};
        return Object.entries(carriageQualityClassDictionary).map(([qualityClass, statsForQualityClass]) => ({
            key: qualityClass,
            free_places: statsForQualityClass.free_places,
            total_places: statsForQualityClass.total_places,
            min_price: statsForQualityClass.min_price,
            carriage_statistics_list: statsForQualityClass.carriage_statistics_list
        }));
    };

    const handleSubtypesChange = (changedCarriageType, changedCarriageTypeSubtypes) => {
        setSelectedSubtypes(previousSubtypes => {
            const nextSubtypes = { ...previousSubtypes, [changedCarriageType]: changedCarriageTypeSubtypes };
            setSelectedTypes(previousTypes => {
                const hasAny = (nextSubtypes[changedCarriageType]?.length ?? 0) > 0;
                const nextTypes = hasAny ? Array.from(new Set([...previousTypes, changedCarriageType])) : previousTypes.filter(type => type !== changedCarriageType);
                implementCarriageFilteringChanges(nextTypes, nextSubtypes);
                return nextTypes;
            })
            return nextSubtypes;
        });
    };

    const TypeLabel = ({ type }) => {
        const currentSelected = selectedSubtypes[type] || [];
        const allAvailableOptions = getClassEntries(type);
        const totalOptionsCount = allAvailableOptions.length;

        const isAllSelected = totalOptionsCount > 0 && currentSelected.length >= totalOptionsCount;
        const isActive = currentSelected.length > 0;
        const sortedSelected = [...currentSelected].sort();

        const content = (
            <div style={{ width: 250 }}>
                <div style={{ marginBottom: 8, fontWeight: 600, borderBottom: `1px solid ${token.colorBorderSecondary}`, paddingBottom: 4 }}>
                    {changeCarriageTypeIntoUkrainian(type)}
                </div>
                <Checkbox.Group
                    style={{ display: "flex", flexDirection: "column", gap: 0 }} // Змінив gap на 0
                    value={selectedSubtypes[type]}
                    onChange={(vals) => handleSubtypesChange(type, vals)}
                >
                    {allAvailableOptions.map((c) => {
                        const isSelected = currentSelected.includes(c.key);
                        return (
                            <div
                                key={c.key}
                                style={{
                                    backgroundColor: isSelected ? getLightSubtypeColor(c.key) : 'transparent',
                                    padding: '6px 8px', // Внутрішні відступи для фону
                                    margin: '0 -4px',   // Трохи виходимо за межі для краси
                                    borderRadius: 4,
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Checkbox value={c.key} style={{ marginLeft: 0, width: '100%' }}>
                                    <Space>
                                        <Tag color={getSubtypeColor(c.key)} style={{ margin: 0, width: 24, textAlign: 'center', padding: 0 }}>{c.key}</Tag>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: token.colorTextSecondary }}>{c.carriage_statistics_list.length} вагон(и),</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: token.colorTextSecondary }}>{c.free_places} місць,</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: token.colorTextSecondary }}>{c.min_price} грн</span>
                                    </Space>
                                </Checkbox>
                            </div>
                        );
                    })}
                </Checkbox.Group>
            </div>
        );

        return (
            <Popover content={content} trigger="hover" placement="bottom">
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: '4px 11px',
                        backgroundColor: isActive ? '#e6f4ff' : 'transparent',
                        color: isActive ? '#1677ff' : 'inherit',
                        borderRadius: 0,
                        transition: 'background-color 0.3s'
                    }}
                >
                    <span style={{ fontWeight: 500 }}>{changeCarriageTypeIntoUkrainian(type)}</span>

                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}
                    >
                        {isAllSelected ? (
                            <div style={{
                                backgroundColor: '#eb2f96',
                                color: 'white',
                                padding: '0 8px',
                                height: 18,
                                borderRadius: 12,
                                fontSize: 10,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1,
                                border: '1px solid white'
                            }}>
                                Всі
                            </div>
                        ) : sortedSelected.length > 0 ? (
                            sortedSelected.map(sub => (
                                <div
                                    key={sub}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: '50%',
                                        backgroundColor: getSubtypeColor(sub),
                                        color: 'white',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid white'
                                    }}
                                >
                                    {sub}
                                </div>
                            ))
                        ) : (
                            <DownOutlined style={{ fontSize: 10, color: token.colorTextQuaternary }} />
                        )}
                    </div>
                </div>
            </Popover>
        );
    };

    const segmentedItems = carriageTypes.map((carriageType) => ({
        value: carriageType,
        label: <TypeLabel type={carriageType} />
    }));

    if (carriageTypes.length === 0) return null;

    return (
        <div style={{ display: 'flex', padding: '2px 0' }}>
            <Segmented
                className="carriage-custom-segmented"
                options={segmentedItems}
                multiple
                size="middle"
                value={selectedTypes}
                style={{
                    backgroundColor: 'white',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
            />
            {/* Кнопка видалена звідси */}
        </div>
    );
}