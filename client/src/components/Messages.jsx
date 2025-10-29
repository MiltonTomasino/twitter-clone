import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import Loading from "./Loading";
import ActiveChat from "./ActiveChat";
import "../styles/messages.css"

function Messages() {

    const [modalOpen, setModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [modalError, setModalError] = useState("");
    const context = useContext(UserContext);
    const { chatId } = useParams();
    const navigate = useNavigate();

    const createChat = useMutation({
        mutationFn: async (username) => {
            const res = await fetch("/api/user/chat", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username })
            });

            const data = await res.json()

            if (!res.ok) {
                setModalError(data.error);
                throw new Error(data.error);
            }

            return data
        },
        onSuccess: () => {
            setModalError("");
            setModalOpen(false);
            setUsername("");
        },
        onError: (error) => {
            console.log("Chat creation error: ", error); 
            setUsername("");
        }
    })

    const {isLoading, data, refetch} = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const res = await fetch("/api/user/chats", {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        },
        onSuccess: () => {
            console.log("SUccessfully fetched chats.");
            
        },
        onError: (error) => {
            console.error("Error fetching chats: ", error);
        }
    })

    function handleCloseChat() {
        navigate("/messages")
        refetch();
    }

    const activeChat = data?.chats?.find(chat => chat.id === chatId);

    if (chatId && activeChat) return <ActiveChat handleCloseChat={handleCloseChat} activeChat={activeChat} />

    return (
        <div className="messages-container">
            <h1>Messages Page</h1>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="icon-container">
                    {data.chats.length > 0 ? (
                        data.chats.map(chat => {
                            const otherUser = chat.participants.find(
                                (p) => p.userId !== context.user.id
                            );
                            // console.log("chat: ", chat);
                            const otherUsername = otherUser?.user?.username;
                    
                            return (
                                <div className="chat-icon" key={chat.id} onClick={() => navigate(`/messages/${chat.id}`)}>
                                    <p>{otherUsername}</p>
                                    {chat.messages.length  > 0 ? (
                                        <small>{chat.messages[0].text}</small>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <p>No chats yet...</p>
                    )}
                </div>
            )}
            <button onClick={() => setModalOpen(true)}>create chat</button>
            {modalOpen && (
                <div className="modal-background">
                    <div className="modal">
                        <div className="search-user">
                            {modalError ?? (
                                <p>{modalError}</p>
                            )}
                            <label htmlFor="user">Add User: </label>
                            <input type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}  
                              />
                        </div>
                        <button onClick={() => createChat.mutate(username)}>create</button>
                        <button onClick={() => setModalOpen(false)}>x</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default Messages;