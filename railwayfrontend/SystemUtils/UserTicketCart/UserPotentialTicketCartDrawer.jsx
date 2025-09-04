import {Button, Divider, Drawer, Space, Typography} from "antd";
import React from "react";
const { Text } = Typography;
function UserPotentialTicketCartDrawer({cartState, removePotentialTicketFromCart})
{
    return (
        <Drawer
            open={cartState.potentialTicketsList.length > 0}
            placement="bottom"
            mask={false}
            height="200px"
            maskClosable={false}
            closable={true}
            bodyStyle={{
                padding: "16px",
                overflowY: "auto",
            }}
            headerStyle={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
            }}
        >
            {cartState.potentialTicketsList.length === 0 ? (
                <Text type="secondary">Кошик порожній</Text>
            ) : (
                <>
                    <div style={{ display: 'grid', gap: 8 }}>
                        {cartState.potentialTicketsList.map((t, i) => (
                            <div
                                key={`${t.train_race_id}-${t.carriage_position_in_squad}-${t.place_in_carriage}-${i}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    border: '1px solid #eee',
                                    borderRadius: 8
                                }}
                            >
                                <div>
                                    <div>
                                        <b>Поїзд:</b> {t.train_race_id} &nbsp;
                                        <b>Вагон:</b> {t.carriage_position_in_squad} &nbsp;
                                        <b>Місце:</b> {t.place_in_carriage}
                                    </div>
                                    <Text type="secondary">Ціна: {t.price ?? 0} ₴</Text>
                                </div>
                                <Button danger size="small" onClick={() => removePotentialTicketFromCart(t)}>
                                    Видалити
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Divider style={{ margin: '12px 0' }} />
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text strong>До сплати: {cartState.totalSum} ₴</Text>
                        <Space>

                            <Button type="primary">Оформити</Button>
                        </Space>
                    </Space>
                </>
            )}
        </Drawer>
    );
}
export default UserPotentialTicketCartDrawer;