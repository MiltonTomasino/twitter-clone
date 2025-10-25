import { Navigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children }) {

    const user = useContext(UserContext);

    if (!user?.loggedIn) return <Navigate to="/login" replace />

    return children;
}

export default ProtectedRoute;