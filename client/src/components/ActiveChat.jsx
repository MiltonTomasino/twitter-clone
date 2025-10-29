import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";

let socket;

function ActiveChat({ handleCloseChat, activeChat }) {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const context = useContext(UserContext)

    useEffect(() => {
        socket = io("http://localhost:3000");

        socket.emit("joinChat", activeChat.id);

        socket.on("chatHistory", (msgs) => {
            setMessages(msgs);
        })

        socket.on("newMessage", (msg) => {
            setMessages(prev => [...prev, msg])
        })

        return () => {
            socket.off("chatHistory");
            socket.off("newMessage");
            socket.disconnect();
        };
    }, [activeChat.id])

    function handleSendMessage() {
        socket.emit("sendMessage", {
            chatId: activeChat.id,
            message: newMessage,
            userId: context.user.id
        });
        setNewMessage("");
    }

    return (
        <>
            <button onClick={() => handleCloseChat()}>back</button>
            <h1>Active chat</h1>
            <p>{activeChat.id}</p>
            <div className="messages-window">
                {messages.map((msg, idx) => {
                    return <p key={idx}>{msg.text}</p>
                })}
            </div>
            <div className="message-input">
                <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}/>
                <button onClick={handleSendMessage}>send</button>
            </div>
        </>
    )
};

export default ActiveChat;