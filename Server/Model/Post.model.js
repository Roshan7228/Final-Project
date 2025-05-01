let mongoose=require("mongoose");

let PostSchema=new mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Content:{
        type:String,
        required:true
    },
    UserId:{
        type:String,
        required:true
    },
    PostImage:{
        type:String,
        default:"https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-d-render-of-a-square-white-leaflet-against-blue-and-coral-image_3890494.jpg"
    },
    Category:{
        type:String,
        default:"uncategorized"
    },
    PostLikeDetails:{
        type:Array,
        default:[]
    },
    PostLike:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});


let PostModel=mongoose.model("PostDetail",PostSchema);

module.exports=PostModel;

