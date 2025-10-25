import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

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
            {context.user.id}
            <button onClick={() => logoutMutation.mutate()}>logout</button>
        </>
    )
};

export default Home;