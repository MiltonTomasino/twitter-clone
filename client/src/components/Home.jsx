import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "../styles/home.css";
import "../styles/post.css";
import Loading from "./Loading";

function Home() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const context = useContext(UserContext);
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

    const likePost = useMutation({
        mutationFn: async (postId) => {
            const res = await fetch(`/api/user/post/${postId}`, {
                method: "POST",
                credentials: "include"
            });

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["fetch-posts"]);
        }
    })

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
                            <div className="post" key={post.id}>
                                <p>{post.text}</p>

                                <div className="like" onClick={() => likePost.mutate(post.id)}>
                                    {post.likedByUser ? (
                                        <svg className="unlike-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <title>heart</title>
                                            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                        </svg>
                                    ) : (
                                        <svg className="like-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <title>heart-outline</title>
                                            <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                        </svg>
                                    )}
                                </div>
                                
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