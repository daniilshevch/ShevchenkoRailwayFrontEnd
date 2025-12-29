import {Row, Col, Card, Statistic, List, Tag, Typography} from 'antd';
const { Title } = Typography;
import { ArrowUpOutlined, ArrowDownOutlined, GlobalOutlined } from '@ant-design/icons';

export const AdminDashboard = () => (
    <div style={{ padding: '24px' }}>
        <Title level={2}>Панель керування</Title>
        <Row gutter={16}>
            <Col span={6}>
                <Card bordered={false} hoverable>
                    <Statistic title="Активні маршрути" value={42} prefix={<GlobalOutlined />} />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false} hoverable>
                    <Statistic
                        title="Продажі за день"
                        value={1128}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="грн"
                    />
                </Card>
            </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={16}>
                <Card title="Останні оновлення рейсів" bordered={false}>
                    <List
                        itemLayout="horizontal"
                        dataSource={['Рейс 2К оновлено', 'Додано новий вагон 0163']}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta title={item} description="5 хвилин тому" />
                                <Tag color="blue">Info</Tag>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
        </Row>
    </div>
);