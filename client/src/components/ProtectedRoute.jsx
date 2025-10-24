import { Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";


function ProtectedRoute({ children }) {

    const { isPending, data} = useQuery({
        queryKey: ['check-auth'],
        queryFn: async () => {    
            const res = await fetch("/api/user/check-auth", {
                method: "GET",
                credentials: "include"
            })

            if (!res.ok) return { loggedIn: false }

            return res.json();
        }
            
            
    })

    if (isPending) return <h1>Loading...</h1>

    if (!data?.loggedIn) return <Navigate to="/login" replace />

    return children;
}

export default ProtectedRoute;