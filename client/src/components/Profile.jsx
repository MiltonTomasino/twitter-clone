import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";

function Profile() {

    const { profileId } = useParams();
    const context = useContext(UserContext);

    const id =  profileId || context.user.id;

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

    if (profileLoading || postLoading) return <Loading />;

    console.log("Profile data: ", profileData);
    console.log("Post data: ", postData);
    
    

    return (
        <>
            <h1>Profile Page</h1>
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
                            <div key={post.id}>
                                <p>{post.text}</p>
                            </div>
                        )
                    })
                ) : (<p>No posts yet...</p>)}
            </div>
        </>
    )
};

export default Profile;