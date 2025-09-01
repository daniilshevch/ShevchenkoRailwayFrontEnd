import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarriageListLayout from '../../components/CarriageListLayout/CarriageListLayout.jsx';
import './CarriageListPage.css';
function CarriageListPage()
{
    const [searchParams] = useSearchParams();
    const [carriages, setCarriages] = useState(null);
    useEffect(() => {
        const typeParams = searchParams.getAll("type");
        const qualityParams = searchParams.getAll("quality");
        const trainData = localStorage.getItem("generalTrainRaceData");
        if (trainData)
        {
            try
            {
                const trainDataObject = JSON.parse(trainData);
                const carriage_statistics_list = trainDataObject.carriage_statistics_list;
                const groupedCarriageStatisticsList = trainDataObject.grouped_carriage_statistics_list;
                console.log(groupedCarriageStatisticsList);
                console.log(typeParams);
                let carriagesList = [];
                if (typeParams.length > 0) {
                    for (const type of typeParams) {
                        const typeGroup = groupedCarriageStatisticsList?.[type];
                        console.log(typeGroup);
                        if (!typeGroup) {
                            continue;
                        }
                        const qualityClassDictionary = typeGroup.carriage_quality_class_dictionary;
                        let selectedQualities = undefined;
                        if (qualityParams.length > 0) {
                            selectedQualities = qualityParams.filter(quality => qualityClassDictionary[quality] != undefined);
                        }
                        else {
                            selectedQualities = Object.keys(qualityClassDictionary);
                        }
                        for (const quality of selectedQualities) {
                            const qualityClassData = qualityClassDictionary[quality];
                            if (!qualityClassData) {
                                continue;
                            }
                            carriagesList.push(...(qualityClassData.carriage_statistics_list || []));

                        }
                        carriagesList.sort((a, b) => a.carriage_position_in_squad - b.carriage_position_in_squad);
                    }
                }
                else
                {
                    carriagesList = carriage_statistics_list;
                }
                console.log(carriagesList);
                setCarriages(carriagesList);
            }
            catch (error)
            {
                console.error(error);
            }
        }
    }, [searchParams]);
    return (
        <div className="carriage-list-page">
            {carriages ? (
                <CarriageListLayout
                    carriages={carriages}
                    onSeatClick={(seat) => console.log("Клік по місцю:", seat)}
                />
            ) : (
            <p>Завантаження...</p>
        )}
        </div>
    )

}
export default CarriageListPage;