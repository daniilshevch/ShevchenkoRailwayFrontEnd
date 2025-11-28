import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const GoogleAuthHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCookie('temp_token');
        if (token) {
            console.log("Global Handler: Знайдено токен в Cookie!");

            localStorage.setItem('token', token);

            deleteCookie('temp_token');
            // window.location.reload();
        }
    }, [navigate]);

    return null;
};