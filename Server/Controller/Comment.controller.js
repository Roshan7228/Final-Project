const CommentModel = require("../Model/Comment.model");
const PostModel = require("../Model/Post.model");


let Commentcontroller = {
    create: async (request, response) => {
        let { _id } = request.User;
        let { postid } = request.params;
        let { Comment } = request.body;
        try {
            let createComment = await CommentModel.create({ userid: _id, Postid: postid, Comment });
            response.status(200).json({
                comment: createComment
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            }) 
        }
    },
    deletecomment: async (request, response) => {
        let { userId, commentid } = request.params;
        if (request.User._id !== userId) {
            return response.status(400).json({
                message: "Not Allow to delete Other User Message"
            })
        }
        try {
            let deletes = await CommentModel.findByIdAndDelete(commentid);
            if(!deletes){
                return response.status(400).json({
                    message:"Not Found!"
                })
            }
            return response.status(200).json({
                message:"Delete SuccessFully",
                deletes
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }

    },
    Updatecomment:async (request,response)=>{
        let {userId,commentid}=request.params;
        if(request.User._id!==userId){
            return response.status(400).json({
                message:"Not allow to Edit This Comment"
            })
        };
        try{
            let Updates=await CommentModel.findByIdAndUpdate(commentid,{$set:{...request.body}},{new:true});
             if(!Updates){
                return response.status(400).json({
                    message:"Not Found"
                })
             }
            return response.status(200).json({
                message:"Update Successfully",
                Updates
            }) 
        } catch (error) {
             return response.status(400).json({
                message:error.message
             })
        }
    },
    getPostallcomment:async(request,response)=>{
        let {Postid}=request.params;
        let limit = request.query.limit || null;
        let order = request.query.order || "ace";
        let comment=await CommentModel.find({Postid}).limit(limit).sort({createdAt:order=="desc"?-1:1});
         if(!comment && comment.lenght===0){
            return response.status(400).json({
                message:"Comment Not Found"
            })
         }
         try {
            return response.status(200).json({
                message:"All Comment on this Post",
                comment
            })
            
         } catch (error) {
            return response.status(400).json({
                message:error.message
            }) 
         } 
    },
    getALlbyadmincomment: async (request, response) => {
        const { userid } = request.params;
        if (request.User._id !== userid) {
            return response.status(403).json({
                message: "You are not authorized to access all comments"
            });
        }
        try {
            const allcomment = await CommentModel.find();
            if (!allcomment || allcomment.length === 0) {
                return response.status(404).json({
                    message: "Comment not found"
                });
            }
            const totalComment = allcomment.length;
            return response.status(200).json({
                message: "All post comments",
                countdown: totalComment,
                allcomment
            });
        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },
    commentLikeAction:async(request,response)=>{
        const { userid} = request.params;
        if (request.User._id !== userid) {
            return response.status(403).json({
                message: 'You are not authorized to perform this action'
            });
        }
            const comment = await CommentModel.findById(request.params.commentid);
            if(!comment || comment.length==0){
                return response.status(400).json({
                    message:"Post Not Found"
                })
            }
            try {
                let index=comment.CommentLikeDetails.indexOf(userid);
                 if(index===-1){
                    comment.CommentLikeDetails.push(userid);
                    comment.like+=1;
                 }else{
                    comment.like-=1;
                    comment.CommentLikeDetails.splice(index,1);
                 }
         await comment.save();
         return response.status(200).json({
            message: index === -1 ? "Comment liked" : "Comment unliked",
            totalLikes: comment.like,
            CommentLikeDetails: comment.CommentLikeDetails
         })
            } catch (error) {
                 return response.status(400).json({
                    message:error.message
                 })
            }
    }
    
}

module.exports = Commentcontroller;