import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function Rightbar() {

    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsername = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/user", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });

            return res.json();
        },
        onSuccess: (data) => {
            console.log("DATA: ", data);
            
            setUsers(data.users || []);
        }
    })

    async function handleSubmit(e) {
        e.preventDefault();
        fetchUsername.mutate();
    }

    return (
        <>
            <h1>Right bar</h1>
            <form className="user-search" onSubmit={handleSubmit}>
                <label htmlFor="username">Search for User: </label>
                <input
                type="text"
                name="username"
                id="search-user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </form>
            {users.length > 0 ? (
                users.map(user => {

                    return (
                        <div className="user" key={user.id} onClick={() => navigate(`/profile/${user.id}`)}>
                            {user.username}
                        </div>
                    )
                })
            ) : (<p>No users found...</p>)}
        </>
    )
};

export default Rightbar;