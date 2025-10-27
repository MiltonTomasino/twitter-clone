import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useMutation } from "@tanstack/react-query";

function Home() {

    const navigate = useNavigate();
    const context = useContext(UserContext);

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/user/logout", {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        },
        onSuccess: () => {
            navigate("/login")
        }
    })

    console.log("UserContext: ", context);

    return (
        <>
            <h1>Home page</h1>
            <button onClick={() => logoutMutation.mutate()}>logout</button>
        </>
    )
}

export default Home;