// import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "./Loading";
import { useState } from "react";
import "../styles/notifs.css";

function Notifications() {

    // const context = useContext(UserContext);
    const [activeTab, setActveTab] = useState("PENDING");

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

    const pendingReq = data?.requests.filter(req => req.status === "PENDING");
    const completedReq = data?.requests.filter(req => req.status !== "PENDING");
    let listToShow = activeTab === "PENDING" ? pendingReq : completedReq;


    return (
        <>
            <h1>Notifs Page</h1>
            <div className="notif-nav">
                <button onClick={() => setActveTab("PENDING")}>pending</button>
                <button onClick={() => setActveTab("COMPLETED")}>completed</button>
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                listToShow.length > 0 ? (
                    listToShow.map(req => {
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