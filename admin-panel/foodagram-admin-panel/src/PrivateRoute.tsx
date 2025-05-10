import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {AuthService} from "./services/auth-service.ts";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const navigate = useNavigate();

    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
