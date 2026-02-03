import {jwtDecode} from 'jwt-decode';
export function getCurrentUser()
{
    const token = localStorage.getItem('token');
    if(!token) return null;
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
const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
};
class UserService
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
}
export const userService = new UserService();