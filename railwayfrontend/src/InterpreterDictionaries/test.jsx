import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ data }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const jsonString = JSON.stringify(data);
                const url = await QRCode.toDataURL(jsonString);
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Помилка генерації QR-коду:', err);
            }
        };

        if (data) {
            generateQRCode();
        }
    }, [data]);

    return (
        <div style={{ textAlign: 'center' }}>
            <h3>QR-код для ваших даних</h3>
            {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" />
            ) : (
                <p>Генерація QR-коду...</p>
            )}
        </div>
    );
};

export default QRCodeGenerator;
