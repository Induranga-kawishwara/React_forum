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

const pandin = new mongoose.Schema(
  {
    user: String,
    email : String,
    comment: String,
    // createdat : Date,
    createdAt: {
      type: Date,
      default: Date.now
    }

  },
  {
    collection: "pandincomments",
  }
);

mongoose.model("pandincomments", pandin);