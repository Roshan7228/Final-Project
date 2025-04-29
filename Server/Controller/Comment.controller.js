const CommentModel = require("../Model/Comment.model");

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
    }
}

module.exports = Commentcontroller;