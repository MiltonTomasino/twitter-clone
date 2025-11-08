const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const passport = require("passport");
const saltRounds = 10;

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, saltRounds)
    } catch (error) {
        console.error("Error hashing password: ", error);
        throw new Error("Password hashing failed");
    }
}

module.exports.registerUser = async (req, res) => {
    try {

        console.log(req.body);
        

        const { username, password } = req.body;
        const hashedPassword = await hashPassword(password);

        const result = await prisma.user.findUnique({ where: { username } });
        if (result) return res.status(400).json({ message: "User already exists." });

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                profile: { create: {} },
            },
            include: { profile: true }
        });

        return res.status(200).json({ message: "Successfully created user", user})

    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).json({ message: "Error registering user" });
    }
}

module.exports.getUser = async (req, res) => {
    try {
        const { username } = req.body;

        const users = await prisma.user.findMany({
            where: { username: { contains: username } },
            select: {
                id: true,
                username: true,
                profile: { select: { id: true } }
            }
        });

        if (users.length === 0) return res.status(200).json({ error: "Users not found." });

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fethcing user: ", error);
        res.status(500).json({ message: "Error fetching user" });
    }
}

module.exports.userLoggin = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ error: "Server error." });

        if (!user) return res.status(400).json({ error: "Invalid username or password." });

        req.logIn(user, (error) => {
            if (error) return res.status(500).json({ error: "Session error." });
            
            return res.status(200).json({ message: "Successfully logged in." });
        })
    })(req, res, next)
}

module.exports.checkAuth = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authorized", loggedIn: false });

        const { password, ...safeUser } = req.user;

        return res.status(200).json({ loggedIn: true, user: safeUser });

    } catch (error) {
        console.error("User is not authenticated: ", error);
        res.status(500).json({ error: "User is not authenticated"});
    }
}

module.exports.getProfile = async (req, res) => {
    try {
            const { userId } = req.query;

            const profile = await prisma.profile.findUnique({
                where: { userId },
                select: {
                    name: true,
                    bio: true,
                    birthday: true,
                    user: {
                        select: {
                            username: true
                        }}
                }
            });

            res.status(200).json({ profile })

    } catch (error) {
        console.error("Error fetching profile data: ", error);
        res.status(500).json({ error: "Error fetching profile data"});
    }
}

module.exports.getUserPosts = async (req, res) => {
    try {
            const { userId } = req.query;

            const posts = await prisma.post.findMany({ where: { userId }});

            res.status(200).json({ posts });

    } catch (error) {
        console.error("Error fetching user posts: ", error);
        res.status(500).json({ error: "Error fetching user posts"});
    }
}

module.exports.createChat = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.id;

        let user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) return res.status(401).json({ error: "User does not exist" });

        let existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: userId} } },
                    { participants: { some: { userId: user.id } } }
                ]
            }
        });

        if (existingChat) return res.status(200).json({ error: "Chat already exists" });

        let chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { userId: userId },
                        { userId: user.id }
                    ]
                }
            },
            include: { participants: true }
        })

        res.status(200).json({ chat });

    } catch (error) {
        console.error("Error creating chat: ", error);
        res.status(500).json({ error: "Error creating chat" });
    }
}

module.exports.getChats = async (req, res) => {
    try {

        const userId = req.user.id;

        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { userId }
                }
            },
            include: {
                participants: {
                    include: {
                        user: true
                    }
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    include: { user: true }
                },
                
            },
            orderBy: { updatedAt: "desc" }
        });

        res.status(200).json({ chats });
    } catch (error) {
        console.error("Error fetching chats: ", error);
        res.status(500).json({ error: "Error fetching chats" });
    }
}

module.exports.createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { text } = req.body;

        console.log(`Create Post Data: ${userId}, ${text}` );
        

        const post = await prisma.post.create({ data: { userId, text } })

        res.status(200).json({ post });
    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).json({ error: "Error creating post"})
    }
}

module.exports.getAllPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("userId: ", userId);
        

        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });

        const followingIds = following.map(i => i.followingId);

        let whereClause = { userId };

        if (followingIds.length > 0) {
            whereClause = {
                OR: [
                    { userId },
                    { userId: { in: followingIds } }
                ]
            }
        }

        const posts = await prisma.post.findMany({
            where: whereClause,
            include: {
                user: { select: { username: true } },
                likes: {
                    where: { userId },
                    select: { id: true },
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const formattedPosts = posts.map(post => ({
            ...post,
            likedByUser: post.likes.length > 0
        }))

        res.status(200).json({ posts: formattedPosts });

    } catch (error) {
        console.log("Error fetching posts: ", error);
        res.status(500).json({ error: "Error fetching posts" })
        
    }
}

module.exports.followStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUser } = req.query;

        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: otherUser
                }
            }
        });
        
        res.status(200).json({ isFollowing: !!isFollowing})

    } catch (error) {
        console.log("Error fetching follow status: ", error);
        res.status(500).json({ error: "Error follow status" });
    }
}

module.exports.followRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUser } = req.query;

        const request = await prisma.followRequest.create({
            data: {
                senderId: userId,
                receiverId: otherUser
            }
        });

        res.status(200).json({ message: "successfully sent request." });
    } catch (error) {
        console.log("Error sending follow request: ", error);
        res.status(500).json({ error: "Error sending follow request" });
    }
}

module.exports.getRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const requests = await prisma.followRequest.findMany({
            where: { receiverId: userId },
            select: {
                id: true,
                senderId: true,
                sender: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                status: true, 
            }
        });

        res.status(200).json({ requests });
    } catch (error) {
        console.log("Error fetching follow request: ", error);
        res.status(500).json({ error: "Error fetching follow request" });
    }
}

module.exports.updateRequestStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const {isFollowing, otherUser } = req.body;
        const status = isFollowing ? "ACCEPTED" : "REJECTED"

        const updateRequest = await prisma.followRequest.update({
            where: {
                senderId_receiverId: {
                    senderId: otherUser,
                    receiverId: userId
                }
            },
            data: { status: status }
        })

        let follow = null;

        if (isFollowing) {
            follow = await prisma.follow.create({
                data: {
                    followerId: otherUser,
                    followingId: userId
                }
            });
        }

        res.status(200).json({ updateRequest, follow })
        
    } catch (error) {
        console.log("Error updating follow request: ", error);
        res.status(500).json({ error: "Error updating follow request" });
    }
}

module.exports.unfollowUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUser } = req.query;

        const removeRequest = await prisma.followRequest.deleteMany({
            where: {
                senderId: userId,
                receiverId: otherUser
            }
        });

        const removeFollow = await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: otherUser
                }
            }
        });

        res.status(200).json({ removeRequest, removeFollow });

    } catch (error) {
        console.log("Error unfollowing user: ", error);
        res.status(500).json({ error: "Error unfollowing user" });
    }
}

module.exports.likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const alreadyLiked = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (alreadyLiked) {
            const unlike = await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            })
            return res.status(200).json({ liked: false });
        };

        const like = await prisma.like.create({
            data: {
                userId,
                postId
            }
        });

        res.status(200).json({ liked: true });
    } catch (error) {
        console.log("Error unfollowing user: ", error);
        res.status(500).json({ error: "Error unfollowing user" });
    }
}