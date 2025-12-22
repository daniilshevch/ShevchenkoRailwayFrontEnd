import React from 'react';
import { Card, Avatar, Upload, Button, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, UploadOutlined, EnvironmentOutlined, TrophyOutlined, RocketOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserSidePanel = ({ imageUrl, onImageChange, stats }) => {
    return (
        <div style={styles.container}>
            {/* Аватар і завантаження */}
            <div style={styles.avatarWrapper}>
                <Avatar
                    size={160}
                    src={imageUrl}
                    icon={<UserOutlined />}
                    style={styles.avatar}
                />
                <Upload
                    showUploadList={false}
                    customRequest={({ onSuccess }) => onSuccess("ok")}
                    onChange={onImageChange}
                >
                    <Button icon={<UploadOutlined />}>Змінити фото</Button>
                </Upload>
            </div>

            {/* Статистика */}
            <div style={{ width: '100%' }}>
                <Title level={4} style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
                    Ваша статистика
                </Title>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card size="small" style={styles.statCard}>
                            <Statistic
                                title="Проїхано кілометрів"
                                value={0}
                                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" style={styles.statCard}>
                            <Statistic
                                title="Поїздок"
                                value={0}
                                prefix={<RocketOutlined style={{ color: '#52c41a' }} />}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" style={styles.statCard}>
                            <Statistic
                                title="Бонусів"
                                value={0}
                                prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const styles = {
    container: {
        background: '#001529',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '8px',
        height: '100%',
    },
    avatarWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
    },
    avatar: {
        border: '4px solid #1890ff',
        marginBottom: 20
    },
    statCard: {
        borderRadius: '8px',
        textAlign: 'center',
    }
};

export default UserSidePanel;