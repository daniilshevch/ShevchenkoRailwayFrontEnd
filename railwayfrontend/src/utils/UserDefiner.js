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
            email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
        };
    }
    catch
    {
        return null;
    }
}