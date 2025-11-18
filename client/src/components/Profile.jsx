import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
import Post from "./Post";
import "../styles/profile.css";

function Profile() {

    const { profileId } = useParams();
    const context = useContext(UserContext);
    const queryClient = useQueryClient();
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingBday, setIsEditingBday] = useState(false);
    const [newName, setNewName] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newBday, setNewBday] = useState("");

    const id =  String(profileId || context.user.id);

    const {isLoading: profileLoading, data: profileData} = useQuery({
        queryKey: ["fetch-profile", id],
        queryFn: async () => {
            const res = await fetch(`/api/user/profile?userId=${id}`, {
                method: "GET",
                credentials: "include",
            });

            return res.json();
        }
    });

    const changeName = useMutation({
        mutationFn: async ({ e }) => {
            e.preventDefault();
            const res = await fetch("/api/user/profile/name", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName})
            });

            setIsEditingName(false);
            setNewName("");

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["fetch-profile", id]);
        }
    });

    const changeBio = useMutation({
        mutationFn: async ({ e }) => {
            e.preventDefault();
            const res = await fetch("/api/user/profile/bio", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio: newBio})
            });

            setIsEditingBio(false);
            setNewBio("");

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["fetch-profile", id]);
        }
    });

    const changeBday = useMutation({
        mutationFn: async ({ e }) => {
            e.preventDefault();
            const res = await fetch("/api/user/profile/bday", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ birthday: newBday})
            });

            setIsEditingBday(false);
            setNewBday("");

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["fetch-profile", id]);
        }
    });

    const {isLoading: postLoading, data: postData} = useQuery({
        queryKey: ["fetch-user-posts", id],
        queryFn: async () => {
            const res = await fetch(`/api/user/posts?userId=${id}`, {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        }
    })

    const {isLoading: followLoad, data: followData} = useQuery({
        queryKey: ["fetch-following", id],
        queryFn: async () => {
            const res = await fetch(`/api/user/follow-status?otherUser=${id}`, {
                method: "GET",
                credentials: "include"
            });

            return res.json();
        },
        enabled: id !== context.user.id
    })

    const sendFollowRequest = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/user/follow-request?otherUser=${id}`, {
                method: "POST",
                credentials: "include"
            });

            return res.json();
        },
    });

    const unfollowUser = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/user/unfollow?otherUser=${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["fetch-following", id]);
        }
    });

    function formatBirthday(birthday) {
        const [year, month, day] = birthday.split("T")[0].split("-");
        return `born: ${month}/${day}/${year}`;
    }


    if (profileLoading || postLoading) return <Loading />;

    return (
        <>
            <div className="profile">
                {id !== context.user.id && (
                    followLoad ? <Loading />
                    : followData?.isFollowing ? <button onClick={() => unfollowUser.mutate()}>unfollow</button> : <button onClick={() => sendFollowRequest.mutate()}>follow</button>
                )}
                <div className="profile-info">
                    <div className="profile-element">
                        {isEditingName ? (
                           <form className="handle" onSubmit={(e) => changeName.mutate({ e })}>
                                <input type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    minLength={1}
                                />
                                <button type="submit">save</button>
                                <button onClick={() => setIsEditingName(false)}>cancel</button>
                           </form>
                            
                        ) : (
                            <div className="handle">
                                <h1>{profileData.profile.name}</h1>
                                <button className="edit-btn" onClick={() => setIsEditingName(true)}>
                                    <svg className="edit-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <title>square-edit-outline</title>
                                        <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <small>@{profileData.profile.user.username}</small>
                    </div>
                    <div className="profile-element">
                        {isEditingBio ? (
                           <form className="handle" onSubmit={(e) => changeBio.mutate({ e })}>
                                <textarea
                                    value={newBio}
                                    onChange={(e) => setNewBio(e.target.value)}
                                    minLength={1}
                                ></textarea>
                                <button type="submit">save</button>
                                <button onClick={() => {
                                    setNewBio("");
                                    setIsEditingBio(false)
                                }}>cancel</button>
                           </form>
                            
                        ) : (
                            <div className="handle">
                                <p>{profileData.profile.bio}</p>
                                <button className="edit-btn" onClick={() => setIsEditingBio(true)}>
                                    <svg className="edit-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <title>square-edit-outline</title>
                                        <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="profile-element">
                        {isEditingBday ? (
                           <form className="handle" onSubmit={(e) => changeBday.mutate({ e })}>
                                <input type="date"
                                    value={newBday}
                                    onChange={(e) => setNewBday(e.target.value)}
                                />
                                <button type="submit">save</button>
                                <button onClick={() => {
                                    setNewBday("");
                                    setIsEditingBday(false)
                                }}>cancel</button>
                           </form>
                            
                        ) : (
                            <div className="handle">
                                <p>
                                    {profileData.profile.birthday
                                    ? formatBirthday(profileData.profile.birthday)
                                    : "no birthday yet"
                                    }
                                </p>
                                <button className="edit-btn" onClick={() => setIsEditingBday(true)}>
                                    <svg className="edit-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <title>square-edit-outline</title>
                                        <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="profile-posts">
                {postData.posts.length > 0 ? (
                    postData.posts.map(post => {
                        return (
                            <Post post={post} query={["fetch-user-posts", id]} key={post.id} />
                        )
                    })
                ) : (<p>No posts yet...</p>)}
            </div>
        </>
    )
};

export default Profile;