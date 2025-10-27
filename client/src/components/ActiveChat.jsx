function ActiveChat({ setActiveChat, activeChat }) {
    return (
        <>
            <button onClick={() => setActiveChat(null)}>back</button>
            <h1>Active chat</h1>
            <p>{activeChat.id}</p>
        </>
    )
};

export default ActiveChat;