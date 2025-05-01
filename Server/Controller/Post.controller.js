const { request, response } = require("express");
const PostModel = require("../Model/Post.model");



const PostController = {

    Createpost: async (request, response) => {
        let { Title, Content } = request.body;
        if (!(Title, Content)) {
            return response.status(400).json({
                message: "Please Fill all The Feilds"
            })
        }
        try {
            let UserId = request.User._id;
            let post = await PostModel.create({ ...request.body, UserId });
            return response.status(201).json({
                message: "Post Created Successfully",
                post
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    Deletepost: async (request, response) => {
        let { userid, id } = request.params;
        if (!userid || !id) {
            return response.status(400).json({
                message: "Not Authorized"
            });
        }
        if (request.User._id !== userid) {
            return response.status(400).json({
                message: "You are not allowed to delete this post"
            })
        }

        try {
            let post = await PostModel.findByIdAndDelete(id);
            if (!post) {
                return response.status(400).json({
                    message: "Post not Found"
                })
            }
            return response.status(200).json({
                message: "Post Delete Successfully"
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    Update: async (request, response) => {
        let { userid, id } = request.params;
        if (!userid || !id) {
            return response.status(400).json({
                message: "Not Authorized"
            })
        }
        if (request.User._id !== userid) {
            return response.status(400).json({
                message: "You are not allowed to Update this post"
            })
        }
        try {
            if (!request.file) {
                let updatepost = await PostModel.findByIdAndUpdate(id, { $set: { ...request.body } });
                if (!updatepost) {
                    return response.status(400).json({
                        message: "Error While updateing Post!"
                    })
                }
                return response.status(200).json({
                    message: "Post Updated Successfully."
                });
            }
            if (request.file) {
                let updatepostimage = await PostModel.findByIdAndUpdate(id, { $set: { ...request.body, PostImage: request.file.originalname } });
                if (!updatepostimage) {
                    return response.status(400).json({
                        message: "Error While updateing Post Image"
                    })
                }
                return response.status(200).json({
                    message: "Post Image Updated Successfully."
                });
            }

        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    GetSinglepost: async (request, response) => {
        let { userid, id } = request.params;
        if (!userid || !id) {
            return response.status(400).json({
                message: "Not Authorized"
            })
        }
        if (request.User._id !== userid) {
            return response.status(400).json({
                message: "You are not allowed to Update this post"
            })
        }
        try {
            let singlepost = await PostModel.findOne({ _id: id });
            if (!singlepost) {
                return response.status(400).json({
                    message: "Not Found"
                })
            }
            return response.status(200).json({
                message: "Post found successfully",
                post: singlepost
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    GetAllPost: async (request, response) => {
        let limit = request.query.limit || null;
        let order = request.query.order || "ace";
        let search = request.query.search || "";
        let page = request.query.page || null;

        try {
            let allpost = await PostModel.find({ $or: [{ Title: { $regex: search, $options: "i" } }, { Content: { $regex: search, $options: "i" } }] }).limit(limit).sort({ createdAt: order == "desc" ? -1 : 1 }).skip(page);
            if (!allpost || allpost.length == 0) {
                return response.status(400).json({
                    message: "Post Not Found"
                });
            }
            return response.status(200).json({
                message: "All Post",
                post: allpost
            });
        } catch (error) {
            return response.status(400).json({
                message: error.message
            });
        }
    },
    GetAllPostbyUser: async (request, response) => {
        let { userid } = request.params;
        let limit = request.query.limit || null;
        let order = request.query.order || "ace";
        let search = request.query.search || "";
        let page = request.query.page || null;
        if (!userid) {
            return response.status(400).json({
                message: "Not Authorized"
            })
        }
        if (request.User._id !== userid) {
            return response.status(400).json({
                message: "You are not allowed to Update this post"
            })
        }
        try {
            let postbyUser = await PostModel.find({ $or: [{ Title: { $regex: search, $options: "i" } }, { Content: { $regex: search, $options: "i" } }] }).limit(limit).sort({ createdAt: order == "desc" ? -1 : 1 }).skip(page);
            if (!postbyUser || postbyUser.length == 0) {
                return response.status(400).json({
                    message: "Post Not Found"
                })
            }
            return response.status(200).json({
                message: "All Posts by this User",
                post: postbyUser
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    getpostlike: async (request, response) => {
        let { userid, Postid } = request.params;
        if (request.User._id !== userid) {
            return response.status(403).json({
                message: 'You are not authorized to perform this action'
            });
        }
        let posts = await PostModel.findById(Postid);
        if (!posts) {
            return response.status(400).json({
                message: "Post Not Found"
            })
        }
        try {
            let index = posts.PostLikeDetails.indexOf(userid);
            if (index === -1) {
                posts.PostLikeDetails.push(userid);
                posts.PostLike += 1;
            } else {
                posts.PostLike -= 1;
                posts.PostLikeDetails.splice(index, 1);
            }
            await posts.save();
            return response.status(200).json({
                message: index === -1 ? "Post liked successfully" : "Post unliked successfully",
                totalLikes: posts.PostLike,
                likedBy: posts.PostLikeDetails
            });

        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    getalllikepost: async (request, response) => {
        let { Postid } = request.params;
        let post = await PostModel.findById(Postid);
        if (!post) {
            return response.status(400).json({
                message: "Post Not Found"
            })
        }
        return response.status(200).json({
            message: "All Like",
            TotalLike: post.PostLike
        })
    },
    getalllikebyadmin: async (request, response) => {
        let { userid } = request.params;
        if (request.User._id !== userid) {
            return response.status(404).json({
                message: "You are not authorized to perform this action"
            })
        }
        try {
            let allpost = await PostModel.find();
            const totalLikes = allpost.reduce((sum, post) => sum + post.PostLike, 0);

            return response.status(200).json({
                message: "Total likes across all posts",
                totalLikes
            });

        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    }
}

module.exports = PostController