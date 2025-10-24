import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function Home() {

    const navigate = useNavigate();

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

    return (
        <>
            <h1>Home page</h1>
            <button onClick={() => logoutMutation.mutate()}>logout</button>
        </>
    )
};

export default Home;