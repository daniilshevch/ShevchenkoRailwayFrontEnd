import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const LoginRequiredModal = ({ open, onCancel, onLoginRedirect }) => {
    return (
        <Modal
            title="Авторизація необхідна"
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Paragraph>
                    Щоб оформити бронювання квитків, необхідно увійти у свій обліковий запис або зареєструватися.
                </Paragraph>

                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        block
                        size="large"
                        onClick={onLoginRedirect}
                    >
                        Увійти в акаунт
                    </Button>

                    <Button
                        block
                        onClick={onCancel}
                    >
                        Скасувати
                    </Button>
                </Space>
            </Space>
        </Modal>
    );
};

export default LoginRequiredModal;