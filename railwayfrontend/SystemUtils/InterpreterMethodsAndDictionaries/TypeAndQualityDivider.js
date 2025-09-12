const divideTypeAndQuality = (typeQualityClass) =>
{
    const typeAndQualityList = typeQualityClass.split('@');
    const type = typeAndQualityList[0];
    let qualities = [];
    if(typeAndQualityList.length > 1) {
        const qualityList = typeAndQualityList[1];
        qualities = qualityList.split("$");
    }
    else
    {
        qualities = [];
    }
    return {type, qualities};
}
export {divideTypeAndQuality};