import {divideTypeAndQuality} from "../../../../SystemUtils/InterpreterMethodsAndDictionaries/TypeAndQualityDivider.js";

class CarriageDisplayService
{
    PARSE_INITIAL_SELECTED_SUBTYPES(searchParams)
    {
        const dict = {};
        const tokens = searchParams.getAll("type");
        for(const token of tokens)
        {
            const {type, qualities} = divideTypeAndQuality(token);
            if(qualities.length > 0)
            {
                dict[type] = Array.from(new Set(qualities));
            }
            else
            {
                dict[type] = ["All"]
            }
        }
        return dict;
    }
    FILTER_CARRIAGES_BY_TYPE_AND_QUALITY(fullTrainData, typeParams)
    {
        const trainDataObject = fullTrainData;
        if (trainDataObject)
        {
            try
            {
                const carriage_statistics_list = trainDataObject.carriage_statistics_list;
                const groupedCarriageStatisticsList = trainDataObject.grouped_carriage_statistics_list;
                let carriagesList = [];
                if (typeParams.length > 0) {
                    for (const type of typeParams) {
                        const typeAndQuality = divideTypeAndQuality(type);
                        const _type = typeAndQuality.type;
                        const qualities = typeAndQuality.qualities;
                        const typeGroup = groupedCarriageStatisticsList?.[_type];
                        if (!typeGroup) {
                            continue;
                        }
                        const qualityClassDictionary = typeGroup.carriage_quality_class_dictionary;
                        let selectedQualities = undefined;
                        if (qualities.length > 0) {
                            selectedQualities = qualities.filter(quality => qualityClassDictionary[quality] !== undefined);
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
                return carriagesList;
            }
            catch (error)
            {
                console.error(error);
            }
        }
        return null;
    }
    GET_FINAL_DISPLAYED_CARRIAGES(carriages, showCarriagesWithoutFreePlaces)
    {
        if (!carriages) return null;
        return carriages.filter(carriage => {
            if (showCarriagesWithoutFreePlaces) {
                return true;
            }
            return carriage.free_places > 0;
        });
    }
}
export const carriageDisplayService = new CarriageDisplayService();