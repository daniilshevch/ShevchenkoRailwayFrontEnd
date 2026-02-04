import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {userAuthenticationService} from "../../../SystemUtils/UserAuthenticationService/UserAuthenticationService.js";

export const GoogleAuthHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        userAuthenticationService.handleGoogleLoginCallback();
    }, [navigate]);

    return null;
};