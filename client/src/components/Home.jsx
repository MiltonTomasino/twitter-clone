import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import "../styles/home.css"
import Loading from "./Loading";

function Home() {

    const navigate = useNavigate();
    const context = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setModalError] = useState("");
    const [text, setText] = useState("");

    let {isLoading, data, error} = useQuery({
        queryKey: ["fetch-posts"],
        queryFn: async () => {
            const res = await fetch("/api/user/posts", {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        }
    })

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

    const createPost = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/user/post", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            return res.json();
        }
    });

    if (isLoading) return <Loading />

    return (
        <>
            <h1>Home page</h1>
            <button onClick={() => logoutMutation.mutate()}>logout</button>
            <button onClick={() => setModalOpen(true)}>post</button>
            <div className="all-posts">
                {data.posts.length > 0 ? (
                    data.posts.map(post => {
                        return (
                            <div className="post" key={post.id}>
                                {post.text}
                            </div>
                        )
                    })
                ) : (<p>No posts yet...</p>)}
            </div>
            {modalOpen && (
                <div className="modal-background">
                    <div className="modal">
                        <form className="search-user" onSubmit={() => createPost.mutate()}>
                            {modalError ?? (
                                <p>{modalError}</p>
                            )}
                            <label htmlFor="user">Add User: </label>
                            <textarea onChange={(e) => setText(e.target.value)} name="text" id="post-content"></textarea>
                            <button type="submit">create</button>
                        </form>
                        <button onClick={() => setModalOpen(false)}>x</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Home;