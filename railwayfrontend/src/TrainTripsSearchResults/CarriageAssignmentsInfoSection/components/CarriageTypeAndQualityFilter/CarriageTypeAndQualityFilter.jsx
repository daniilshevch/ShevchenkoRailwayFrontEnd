import React, {useMemo, useState, useEffect} from "react";
import { Segmented, Popover, Checkbox, Tag, Badge, Space, Typography, Tooltip, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
    changeCarriageTypeIntoUkrainian
} from "../../../../../SystemUtils/InterpreterMethodsAndDictionaries/CarriagesDictionaries.js";

export default function CarriageTypeAndQualityFilter(
    {
        groupedSeats = {},
        initialSelectedTypes,
        initialSelectedSubtypes,
        onChange
    })
{
    const carriageTypes = useMemo(() => Object.keys(groupedSeats), [groupedSeats]);
    const [selectedTypes, setSelectedTypes] = useState(() => initialSelectedTypes);
    const [initiallyLoaded, setInitiallyLoaded] = useState(false);
    const [selectedSubtypes, setSelectedSubtypes] = useState(() => {
       const checkedSubtypes = {};
       for(const type of initialSelectedTypes)
       {
           const initialSubtypes = initialSelectedSubtypes?.[type] ?? [];
           checkedSubtypes[type] = Array.isArray(initialSubtypes) ? Array.from(new Set(initialSubtypes)) : [];
       }
       return checkedSubtypes;
    });

    const getQueryStringParams = (typesArray, subtypesDictionary) =>
    {
        return typesArray.map(type => {
            const subtypes = subtypesDictionary[type] || [];
            return subtypes.length ? `${type}~${subtypes.join("*")}` : type;
        })
    };

    const implementCarriageFilteringChanges = (nextTypes, nextSubtypes) => {
        const queryParams = getQueryStringParams(nextTypes, nextSubtypes);
        onChange?.({selectedTypes: nextTypes, selectedSubtypes: nextSubtypes, queryParams: queryParams});
    }

    useEffect(() => {
          if (!carriageTypes.length || initiallyLoaded) return;
          const nextSub = {};
          for (const t of carriageTypes) {
                const init = initialSelectedSubtypes?.[t] ?? [];
                if(init.length > 0 && init[0] === "All")
                {
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
         }, [carriageTypes, initialSelectedSubtypes, initiallyLoaded, implementCarriageFilteringChanges]);

    useEffect(() => {
        setSelectedTypes(previous => previous.filter(type => carriageTypes.includes(type)));
        setSelectedSubtypes(previous => {
            const nextSubtypes = {};
            for(const type of carriageTypes)
            {
                nextSubtypes[type] = Array.isArray(previous[type]) ? previous[type] : [];
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
        return Object.entries(carriageQualityClassDictionary).map(([qualityClass, statsForQualityClass]) => ({
            key: qualityClass,
            free_places: statsForQualityClass.free_places,
            total_places: statsForQualityClass.total_places,
            min_price: statsForQualityClass.min_price
        }));
    };



    const handleSubtypesChange = (changedCarriageType, changedCarriageTypeSubtypes) => {
        setSelectedSubtypes(previousSubtypes => {
            const nextSubtypes = {...previousSubtypes, [changedCarriageType]: changedCarriageTypeSubtypes};
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
        //const s = getTypeSummary(type) || { free: 0, total: 0, minPrice: undefined };
        const subCount = selectedSubtypes[type]?.length || 0;


        const content = (
            <div style={{ minWidth: 240 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{changeCarriageTypeIntoUkrainian(type)}</div>
                <div style={{ marginBottom: 8 }}>
                    <Space wrap>
                        {/*<Tag color="blue">Вільно: {s.free_places ?? "—"}/{s.total_places ?? "—"}</Tag>*/}
                        {/*<Tag color="green">від ₴{formatCurrency(s.minPrice)}</Tag>*/}
                    </Space>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <Checkbox.Group
                    style={{ display: "grid", gap: 6 }}
                    value={selectedSubtypes[type]}
                    onChange={(vals) => handleSubtypesChange(type, vals)}
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

        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Popover content={content} trigger="hover" placement="bottom">
                    <span style={{ fontWeight: 600 }}>{type}</span>
                            <span
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                style={{ display: "inline-flex", alignItems: "center" }}
                            >
                                  {subCount > 0 ? (
                                      <Badge count={subCount} size="small">
                                          <DownOutlined />
                                      </Badge>
                                  ) : (
                                      <DownOutlined />
                                  )}
                            </span>
                </Popover>
            </span>
        );
    };

    const segmentedItems = carriageTypes.map((carriageType) => ({ value: carriageType, label: <TypeLabel type={carriageType}/> }));

    return (
        <div style={{ flexDirection: "column", gap: 12 }}>
            <Segmented
                options={segmentedItems}
                multiple
                size="large"
                value={selectedTypes}
            />

            {/* Підсумок поточного вибору */}
            {/*<div style={{ marginTop: 8 }}>*/}
            {/*    <Typography.Text strong>Вибір:</Typography.Text>*/}
            {/*    <div style={{ marginTop: 6 }}>*/}
            {/*        {selectedTypes.length === 0 ? (*/}
            {/*            <Typography.Text type="secondary">Нічого не вибрано</Typography.Text>*/}
            {/*        ) : (*/}
            {/*            <Space wrap>*/}
            {/*                {selectedTypes.map((t) => (*/}
            {/*                    <Tooltip*/}
            {/*                        key={t}*/}
            {/*                        title={*/}
            {/*                            selectedSubtypes[t]?.length*/}
            {/*                                ? `Класи для ${t}: ${selectedSubtypes[t].join(", ")}`*/}
            {/*                                : `Класи для ${t} не обрані`*/}
            {/*                        }*/}
            {/*                    >*/}
            {/*                        <Tag color={selectedSubtypes[t]?.length ? "processing" : "default"}>*/}
            {/*                            {t}*/}
            {/*                            {selectedSubtypes[t]?.length ? ` (${selectedSubtypes[t].length})` : ""}*/}
            {/*                        </Tag>*/}
            {/*                    </Tooltip>*/}
            {/*                ))}*/}
            {/*            </Space>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}