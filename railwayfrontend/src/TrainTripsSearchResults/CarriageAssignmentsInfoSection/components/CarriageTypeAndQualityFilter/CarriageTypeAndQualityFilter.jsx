import React, {useMemo, useState, useEffect} from "react";
import { Segmented, Popover, Checkbox, Tag, Badge, Space, Typography, Tooltip, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
export default function CarriageTypeAndQualityFilter(
    {
        groupedSeats = {},
        initialSelectedTypes = [],
        initialSelectedSubtypes = [],
        onChange
    })
{
    const carriageTypes = useMemo(() => Object.keys(groupedSeats), [groupedSeats]);
    const [selectedTypes, setSelectedTypes] = useState(() => {
        return initialSelectedTypes.filter(type => carriageTypes.includes(type));
    });
    const [selectedSubtypes, setSelectedSubtypes] = useState(() => {
       const checkedSubtypes = {};
       for(const type of carriageTypes)
       {
           const subtypes = initialSelectedSubtypes?.[type] ?? [];
           checkedSubtypes[type] = Array.isArray(subtypes) ? Array.from(new Set(subtypes)) : [];
       }
       return checkedSubtypes;
    });
    useEffect(() => {
        setSelectedTypes(previous => previous.filter(type => carriageTypes.includes(type)));
        setSelectedSubtypes(previous => {
            const nextSubtypes = {};
            for(const type of carriageTypes)
            {
                nextSubtypes[type] = Array.isArray(previous[type]) ? previous[type] : [...previous[type]];
            }
            return nextSubtypes;
        });
    }, [carriageTypes]);

    const getClassEntries = (type) => {
        const statsForCarriageType = groupedSeats[type];
        if(!statsForCarriageType)
        {
            return [];
        }
        const carriageQualityClassDictionary = statsForCarriageType.carriage_quality_class_dictionary || {};
        return Object.entries(carriageQualityClassDictionary).map(([qualityClass, stats]) => ({
            key: qualityClass,
            free_places: stats.free_places,
            total_places: stats.total_places,
            min_price: stats.min_price
        }));
    };


    const TypeLabel = ({ type }) => {
        //const s = getTypeSummary(type) || { free: 0, total: 0, minPrice: undefined };
        const subCount = selectedSubtypes[type]?.length || 0;


        const content = (
            <div style={{ minWidth: 240 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{type}</div>
                <div style={{ marginBottom: 8 }}>
                    <Space wrap>
                        {/*<Tag color="blue">Вільно: {s.free_places ?? "—"}/{s.total_places ?? "—"}</Tag>*/}
                        {/*<Tag color="green">від ₴{formatCurrency(s.minPrice)}</Tag>*/}
                    </Space>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div style={{ marginBottom: 6, fontSize: 12, color: "#888" }}>Оберіть класи для типу {type}:</div>
                <Checkbox.Group
                    style={{ display: "grid", gap: 6 }}
                    value={selectedSubtypes[type]}
                    // onChange={(vals) => handleSubtypesChange(type, vals)}
                >
                    {getClassEntries(type).map((c) => (
                        <Checkbox key={c.key} value={c.key}>
                            <Space size={6}>
                                <span style={{ width: 18, display: "inline-block", textAlign: "center", fontWeight: 600 }}>{c.key}</span>
                                <Tag>Вільно {c.free_places}/{c.total_places}</Tag>
                                {/*<Tag color="green">₴{formatCurrency(c.minPrice)}</Tag>*/}
                            </Space>
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </div>
        );

        const dropdownTrigger = (
            <span
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
        <span style={{ fontWeight: 600 }}>{type}</span>
                {subCount > 0 ? (
                    <Badge count={subCount} size="small">
                        <DownOutlined />
                    </Badge>
                ) : (
                    <DownOutlined />
                )}
      </span>
        );

        return (
            <Popover content={content} trigger="click" placement="bottom">
                {dropdownTrigger}
            </Popover>
        );
    };

    const segmentedItems = carriageTypes.map((t) => ({ value: t, label: <TypeLabel type={t} /> }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Typography.Text type="secondary">
                Оберіть типи вагонів (можна кілька) і задайте класи окремо для КОЖНОГО типу
            </Typography.Text>

            <Segmented
                options={segmentedItems}
                multiple
                size="large"
                value={selectedTypes}
                // onChange={handleTypesChange}
                style={{ maxWidth: "100%", flexWrap: "wrap" }}
            />

            {/* Підсумок поточного вибору */}
            <div style={{ marginTop: 8 }}>
                <Typography.Text strong>Вибір:</Typography.Text>
                <div style={{ marginTop: 6 }}>
                    {selectedTypes.length === 0 ? (
                        <Typography.Text type="secondary">Нічого не вибрано</Typography.Text>
                    ) : (
                        <Space wrap>
                            {selectedTypes.map((t) => (
                                <Tooltip
                                    key={t}
                                    title={
                                        selectedSubtypes[t]?.length
                                            ? `Класи для ${t}: ${selectedSubtypes[t].join(", ")}`
                                            : `Класи для ${t} не обрані`
                                    }
                                >
                                    <Tag color={selectedSubtypes[t]?.length ? "processing" : "default"}>
                                        {t}
                                        {selectedSubtypes[t]?.length ? ` (${selectedSubtypes[t].length})` : ""}
                                    </Tag>
                                </Tooltip>
                            ))}
                        </Space>
                    )}
                </div>
                <div style={{ marginTop: 6 }}>
                    <Typography.Text type="secondary">
                        {/*Токени (для URL/query): {encodeTokens(selectedTypes, selectedSubtypes).join(", ") || "—"}*/}
                    </Typography.Text>
                </div>
            </div>
        </div>
    );
}