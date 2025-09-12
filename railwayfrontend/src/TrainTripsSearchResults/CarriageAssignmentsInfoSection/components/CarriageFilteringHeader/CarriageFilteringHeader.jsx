import CarriageTypeAndQualityFilter from "../CarriageTypeAndQualityFilter/CarriageTypeAndQualityFilter.jsx";
import {Button} from "antd";
import "./CarriageFilteringHeader.css";
function CarriageFilteringHeader({groupedSeats, initialSelectedTypes, initialSelectedSubtypes, onChange})
{
    return (
        <>
            <div className="carriage-filtering-toolbar">
                <div className="toolbar-left">
                    <CarriageTypeAndQualityFilter
                        groupedSeats={groupedSeats}
                        initialSelectedTypes={initialSelectedTypes}
                        initialSelectedSubtypes={initialSelectedSubtypes}
                        onChange={onChange}
                    />
                </div>
                <div className="toolbar-right">
                    <Button type="primary" onClick={() => {}}>Оновити дані</Button>
                </div>
            </div>
        </>
    )
}
export default CarriageFilteringHeader;