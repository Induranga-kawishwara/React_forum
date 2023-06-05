// const mongoose = require("mongoose");

// const ImageDetailsScehma = new mongoose.Schema(
//   {
//    image:String
//   },
//   {
//     collection: "ImageDetails",
//   }
// );

// mongoose.model("ImageDetails", ImageDetailsScehma);

const mongoose = require("mongoose");

const repl = new mongoose.Schema(
  {
    commentID : String,
    username: String,
    email: String,
    reply: String,
  },
  {
    collection: "replyies",
  }
);

mongoose.model("replyies", repl); 