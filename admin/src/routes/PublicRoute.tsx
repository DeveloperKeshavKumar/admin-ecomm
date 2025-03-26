import { JSX } from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("token");

    return token ? <Navigate to="/dashboard" /> : children;
}

export default PublicRoute;