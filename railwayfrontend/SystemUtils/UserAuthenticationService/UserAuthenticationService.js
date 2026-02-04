import {jwtDecode} from 'jwt-decode';
import {SERVER_URL} from "../ServerConnectionConfiguration/ConnectionConfiguration.js";
const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
};
class UserAuthenticationService
{
    getCurrentUser()
    {
        const token = localStorage.getItem('token');
        if(!token || isTokenExpired(token)) return null;
        try {
            const decoded = jwtDecode(token);
            return {
                id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                token: token
            };
        }
        catch
        {
            return null;
        }
    }
    async register(values)
    {
        const response = await fetch(`${SERVER_URL}/Client-API/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            throw new Error("Невірні дані або користувач вже існує");
        }
    }
    async login(values)
    {
        const response = await fetch(`${SERVER_URL}/Client-API/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Невірні облікові дані");
        }
        const data = await response.json();
        localStorage.setItem('token', data.token);
        //if (data.user_Id) localStorage.setItem('userId', data.user_Id);
    }
    getGoogleLoginUrl(fromPage)
    {
        const returnOrigin = window.location.origin;
        const returnPath = fromPage === '/' ? '' : fromPage;
        const fullReturnUrl = `${returnOrigin}${returnPath}`;
        return `${SERVER_URL}/Client-API/login-with-google?returnUrl=${fullReturnUrl}`;
    }
    async fetchProfileImage()
    {
        const user = this.getCurrentUser();
        if(!user) return "/unknown.jpg";
        try {
            const response = await fetch("https://localhost:7230/Client-API/get-profile-image-for-current-user", {
                method: "GET",
                headers: {"Authorization": `Bearer ${user?.token}`}
            });
            if (!response.ok) throw new Error("Image fetch failed");
            const contentType = response.headers.get("content-type");

            if (contentType?.includes("application/json")) {
                const data = await response.json();
                return {type: 'url', value: data.imageUrl};
            } else {
                const imageBlob = await response.blob();
                const objectUrl = URL.createObjectURL(imageBlob);
                return { type: 'blob', value: objectUrl };
            }
        }
        catch(error)
        {
            console.error("Profile image error:", error);
            return { type: 'url', value: "/unknown.jpg" };
        }
    }
    logout()
    {
        localStorage.removeItem('token');
        window.location.reload();
    }
    handleGoogleLoginCallback()
    {
        const cookieName = 'temp_token';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${cookieName}=`);
        if (parts.length === 2) {
            const token = parts.pop().split(';').shift();
            if(token)
            {
                localStorage.setItem('token', token);
                document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                return true;
            }
        }
        return false;
    }

}
export const userAuthenticationService = new UserAuthenticationService();