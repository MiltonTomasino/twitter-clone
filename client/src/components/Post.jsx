import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Comments from "./Comments";

function Post({ post, query }) {

    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const likePost = useMutation({
        mutationFn: async (postId) => {
            const res = await fetch(`/api/user/post/${postId}`, {
                method: "POST",
                credentials: "include"
            });

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query });
        }
    })

    console.log("Post data: ", post);
    

    return (

        <div>
            <div className="post" key={post.id}>
                <div className="post-name">
                    <h3>{post.user.profile.name}</h3>
                    <small>@{post.user.username}</small>
                </div>
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
                <p>{post.text}</p>
                
            </div>
            <div className="comments">
                <div className="comments-tab" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="tab-closed" viewBox="0 0 24 24">
                            <title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="tab-open" viewBox="0 0 24 24">
                            <title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                    )}
                </div>
                {isOpen && <Comments post={post} query={query} />}
            </div>

        </div>
        
    )
}

export default Post;