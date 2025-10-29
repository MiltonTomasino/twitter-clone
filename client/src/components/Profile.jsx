import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";

function Profile() {

    const { profileId } = useParams();
    const context = useContext(UserContext);

    const id =  profileId || context.user.id;

    const {isLoading, data} = useQuery({
        queryKey: ["fetch-profile", id],
        queryFn: async () => {
            const res = await fetch(`/api/user/profile?userId=${id}`, {
                method: "GET",
                credentials: "include",
            });

            return res.json();
        }
    })

    if (isLoading) return <Loading />;

    console.log("Profile data: ", data);
    

    return (
        <>
            <h1>Profile Page</h1>
            <h1>User's Profile ID: {id}</h1>
        </>
    )
};

export default Profile;