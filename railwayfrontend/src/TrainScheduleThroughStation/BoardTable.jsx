import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const BoardTable = ({ data, type }) => {
    return (
        <div className="custom-board-table">
            <div className="table-header">
                <div className="col-id">Потяг</div>
                <div className="col-route">Сполучення</div>
                <div className="col-time">Час</div>
                <div className="col-platform">Колія</div>
            </div>

            <div className="table-body">
                {data.map((item) => (
                    <div key={item.key} className="table-row">
                        <div className="row-main-info">
                            <div className={`col-id ${type}-color`}>{item.id}</div>
                            <div className="col-route">{item.route}</div>
                            <div className="col-time">{item.time}</div>
                            <div className="col-platform">{item.platform}</div>
                        </div>

                        {/* Відображення затримки, якщо вона є */}
                        {item.delay > 0 && (
                            <div className="delay-info">
                                // затримується на {item.delay} хв
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BoardTable;