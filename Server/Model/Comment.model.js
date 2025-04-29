let mongoose=require("mongoose");


let CommentSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    Postid:{
        type:String,
        required:true
    },
    Comment:{
        type:String
    },
    CommentLikeDetails:{
        type:Array,
        default:[]
    },
    like:{
       type:Number,
       default:0
    }
},{
    timestamps:true,
    versionKey:false
});

let CommentModel=mongoose.model("comment",CommentSchema);

module.exports=CommentModel;