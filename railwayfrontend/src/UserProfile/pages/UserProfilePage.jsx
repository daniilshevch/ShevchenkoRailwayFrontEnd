import React, { useState, useEffect } from 'react';
import { Form, Card, Row, Col, message, Spin } from 'antd';
import UserSidePanel from '../UserSidePanel.jsx'; // Імпортуємо лівий компонент
import UserDataForm from '../UserDataForm.jsx';
import {getCurrentUser} from "../../../SystemUtils/UserDefinerService/UserDefiner.js";   // Імпортуємо правий компонент

const UserProfilePage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    // Хардкод статистики
    const stats = {
        kmTraveled: 12450,
        tripsCount: 42,
        bonuses: 350
    };

    useEffect(() => {
        const user = getCurrentUser();
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://localhost:7230/Client-API/get-user-profile-info', {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Помилка завантаження');

                const data = await response.json();
                console.log(data);


                if (data.user_profile_image) {
                    setImageUrl(`data:image/jpeg;base64,${data.user_profile_image}`);
                }
                else if (data.user_google_profile_image_url) {
                    setImageUrl(data.user_google_profile_image_url);
                }
                else {
                    setImageUrl(null);
                }

                form.setFieldsValue({
                    surname: data.surname,
                    name: data.name,
                    email: data.email,
                    user_name: data.user_name,
                    phone_number: data.phone_number,
                });
            } catch (error) {
                console.error(error);
                message.error('Помилка завантаження даних');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [form]);

    const handleImageChange = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const onFinish = (values) => {
        const payload = { ...values, avatar: imageUrl };
        console.log('Sending:', payload);
        message.success('Дані збережено!');
    };

    if (loading) {
        return <div style={styles.loadingContainer}><Spin size="large" /></div>;
    }

    return (
        <div style={styles.pageContainer}>
            <Card style={styles.card} bordered={false} bodyStyle={{ padding: 0 }}>
                <Row>
                    {/* Ліва панель (Статистика та Аватар) */}
                    <Col xs={24} md={8}>
                        <UserSidePanel
                            imageUrl={imageUrl}
                            onImageChange={handleImageChange}
                            stats={stats}
                        />
                    </Col>

                    <Col xs={24} md={16} style={{ padding: '30px' }}>
                        <UserDataForm
                            form={form}
                            onFinish={onFinish}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #001529 0%, #00474f 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '1000px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        overflow: 'hidden',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }
};

export default UserProfilePage;