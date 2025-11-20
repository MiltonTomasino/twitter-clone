// import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "./Loading";
import "../styles/notifs.css";

function Notifications() {

    // const context = useContext(UserContext);

    const {isLoading, data} = useQuery({
        queryKey: ["fetch-notifs"],
        queryFn: async () => {
            const res = await fetch("/api/user/notifications", {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        }
    });

    const updateRequestStatus = useMutation({
        mutationFn: async ({ isFollowing, id }) => {
            const res = await fetch("/api/user/update-follow", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFollowing, otherUser: id})
            });

            return res.json();
        }
    })


    return (
        <>
            <h1>Notifs Page</h1>
            <div className="notif-nav">
                <button>pending</button>
                <button>completed</button>
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                data.requests.length > 0 ? (
                    data.requests.map(req => {
                        console.log("Request data: ", req);
                        
                        return (
                            <div className="request" key={req.id}>
                                <p>{req.sender.username} is trying to follow: status({req.status})</p>
                                {req.status === "PENDING" && (
                                    <>
                                        <button
                                        onClick={() => updateRequestStatus.mutate({
                                            isFollowing: true, id: req.sender.id
                                        })}>
                                            accept
                                        </button>
                                        <button
                                        onClick={() => updateRequestStatus.mutate({
                                            isFollowing: false, id: req.sender.id
                                        })}>
                                            decline
                                        </button>
                                    </>
                                )}
                            </div>
                        )
                    })
                ) : (
                <p>No notifications...</p>
                )
            )}
                
        </>
    )
};

export default Notifications;