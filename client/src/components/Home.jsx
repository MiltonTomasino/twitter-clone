import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import "../styles/home.css";
import "../styles/post.css";
import Loading from "./Loading";
import Post from "./Post";

function Home() {

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setModalError] = useState("");
    const [text, setText] = useState("");

    let {isLoading, data} = useQuery({
        queryKey: ["fetch-posts"],
        queryFn: async () => {
            const res = await fetch("/api/user/all-posts", {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        },
        onSuccess: () => {
            console.log("Successfully fetched posts.");
        },
        onError: (error) => {
            setModalError(error.message)
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
        },
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
                        console.log("Post data: ", post);
                        
                        return (
                            <Post post={post} query={["fetch-posts"]} key={post.id}/>
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
                            <label htmlFor="user">Your post: </label>
                            <textarea onChange={(e) => setText(e.target.value)} name="text" id="post-content"></textarea>
                            <button type="submit">create</button>
                        </form>
                        <button onClick={() => setModalOpen(false)}>cancel</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Home;