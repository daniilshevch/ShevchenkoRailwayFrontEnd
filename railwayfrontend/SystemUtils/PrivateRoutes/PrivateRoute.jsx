import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Встанови: npm install jwt-decode

export const PrivateRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const hasAccess = allowedRoles.includes(userRole);
        return hasAccess ? <Outlet /> : <Navigate to="/admin-login" replace />;
    } catch (error) {
        console.log(error);
        return <Navigate to="/login" replace />;
    }
};
