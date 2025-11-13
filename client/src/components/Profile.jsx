import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "./Loading";
import Post from "./Post";

function Profile() {

    const { profileId } = useParams();
    const context = useContext(UserContext);

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
    })


    if (profileLoading || postLoading) return <Loading />;

    return (
        <>
            <h1>Profile Page</h1>
            {id !== context.user.id && (
                followLoad ? <Loading />
                : followData?.isFollowing ? <button onClick={() => unfollowUser.mutate()}>unfollow</button> : <button onClick={() => sendFollowRequest.mutate()}>follow</button>
            )}
            <div className="profile-info">
                <h1>{profileData.profile.name}</h1>
                <small>{profileData.profile.user.username}</small>
                <p>{profileData.profile.bio}</p>
                <p>{profileData.profile.birthday || "no birthday yet"}</p>
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