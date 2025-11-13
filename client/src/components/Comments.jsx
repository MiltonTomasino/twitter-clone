import { useMutation, useQueryClient } from "@tanstack/react-query";

function Comments({ post, query }) {

    const queryClient = useQueryClient();

    const submitComment = useMutation({
        mutationFn: async ({ e, postId }) => {
            e.preventDefault();

            const comment = e.target.comment.value;

            const res = await fetch(`/api/user/post/${postId}/comment`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment })
            });
            e.target.reset();
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: query });
        }
    })

    return (
        <>
            <div className="comments-container">
                <div className="comments-list">
                    {post.comments && post.comments.length > 0
                        ? post.comments.map(comment => {
                            return (
                                <div className="comment" key={comment.id}>
                                    <p>{comment.user.profile.name}</p>
                                    <p><em>{comment.text}</em></p>
                                </div>
                            )
                        })
                        : <div className="no-comments">No comments.</div>
                    }
                </div>
                <div className="add-comment">
                    <form onSubmit={(e) => submitComment.mutate({ e: e, postId: post.id })}>
                        <input type="text" name="comment" placeholder="Add a comment..." />
                        <label htmlFor="comment"><button type="submit">comment</button></label>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Comments;