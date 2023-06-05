const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");
// var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongoUrl =
  "mongodb+srv://induranga20200688:induranga12187@cluster0.vthxdeb.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./comment");
require("./conformcomments");
require("./replies");


const User = mongoose.model("UserInfo");
const comments = mongoose.model("pandincomments");
const replies = mongoose.model("replyies");
const conformcom = mongoose.model("conformcomments");




app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});

app.listen(5000, () => {
  console.log("Server Started");
});

// app.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const oldUser = await User.findOne({ email });
//     if (!oldUser) {
//       return res.json({ status: "User Not Exists!!" });
//     }
//     const secret = JWT_SECRET + oldUser.password;
//     const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
//       expiresIn: "5m",
//     });
//     const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "adarsh438tcsckandivali@gmail.com",
//         pass: "rmdklolcsmswvyfw",
//       },
//     });

//     var mailOptions = {
//       from: "youremail@gmail.com",
//       to: "thedebugarena@gmail.com",
//       subject: "Password Reset",
//       text: link,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
//     console.log(link);
//   } catch (error) { }
// });

// app.get("/reset-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;
//   console.log(req.params);
//   const oldUser = await User.findOne({ _id: id });
//   if (!oldUser) {
//     return res.json({ status: "User Not Exists!!" });
//   }
//   const secret = JWT_SECRET + oldUser.password;
//   try {
//     const verify = jwt.verify(token, secret);
//     res.render("index", { email: verify.email, status: "Not Verified" });
//   } catch (error) {
//     console.log(error);
//     res.send("Not Verified");
//   }
// });

// app.post("/reset-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   const oldUser = await User.findOne({ _id: id });
//   if (!oldUser) {
//     return res.json({ status: "User Not Exists!!" });
//   }
//   const secret = JWT_SECRET + oldUser.password;
//   try {
//     const verify = jwt.verify(token, secret);
//     const encryptedPassword = await bcrypt.hash(password, 10);
//     await User.updateOne(
//       {
//         _id: id,
//       },
//       {
//         $set: {
//           password: encryptedPassword,
//         },
//       }
//     );

//     res.render("index", { email: verify.email, status: "verified" });
//   } catch (error) {
//     console.log(error);
//     res.json({ status: "Something Went Wrong" });
//   }
// });

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});


app.post("/addcomment", async (req, res) => {
  const { user, email, comment } = req.body;
  console.log(req.body);
  try {
    await comments.create({
      user,
      email,
      comment,
      // createdat,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.get("/getpendingcomment", async (req, res) => {
  try {
    const allcomment = await comments.find({});
    res.send({ status: "ok", comments : allcomment });
  } catch (error) {
    console.log(error);
  }
});

app.post("/conformedpost", async (req, res) => {
  const { conformedpostID } = req.body;
  try {
    const approved = await comments.findOne({ _id: conformedpostID });
    await conformcom.create({
      user: approved.user,
      email: approved.email,
      comment: approved.comment,
      createdAt : approved.createdAt,
    });

    comments.deleteOne({ _id: conformedpostID }, function (err) {
      if (err) {
        console.log(err);
        res.send({ status: "Error", message: "Failed to delete comment" });
      } else {
        res.send({ status: "Ok", data: "conformed" });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ status: "Error", message: "Failed to conform comment" });
  }
});

app.post("/addcommentadmin", async (req, res) => {
  const { user, email, comment} = req.body;
  console.log(req.body);
  try {
    await conformcom.create({
      user,
      email,
      comment,
      createdAt : Date.now(),
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});






app.get("/getallreplies", async (req, res) => {
  const selecte = req.query.selecte;
  try {
    const allcreplyies = await replies.find({ commentID: selecte });
    res.send({ status: "ok", allreplyies: allcreplyies });
  } catch (error) {
    console.log(error);
  }
});



app.post("/deletecomment", async (req, res) => {
  const { commentID } = req.body;
  try {
    comments.deleteOne({ _id: commentID }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});


app.post("/addreply", async (req, res) => {
  const { commentID , username, email, reply } = req.body;
  console.log(req.body);
  try {
    await replies.create({
      commentID ,
      username,
      email,
      reply,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

 



app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page)
  // const limit = parseInt(req.query.limit)
  const limit = 10 ;

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allUser.length;
  results.pageCount=Math.ceil(allUser.length/limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results)
})


app.get("/paginatedUsers2", async (req, res) => {
  const search = (req.query.search)
  console.log(search);
  let allcomment = [];
  const page = parseInt(req.query.page)

  if (!search) {
    console.log("mona huththakda");
    allcomment = await comments.find({});
  }else{
    allcomment = await comments.find({user: search});
  }
  // const allcomment = await comments.find({});
  // const page = parseInt(req.query.page)
  // const limit = parseInt(req.query.limit)
  const limit = 10 ;

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allcomment.length;
  results.pageCount=Math.ceil(allcomment.length/limit);

  if (lastIndex < allcomment.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allcomment.slice(startIndex, lastIndex);
  res.json(results)
})

app.get("/paginatedUsers3", async (req, res) => {

  const search = (req.query.search)
  console.log(search);
  let allcomment = [];
  const page = parseInt(req.query.page)

  if (!search) {
    allcomment = await conformcom.find({});
  }else{
    allcomment = await conformcom.find({user: search});
  }

  // const allcomment = await conformcom.find({});
  // const page = parseInt(req.query.page)
  // const limit = parseInt(req.query.limit)
  const limit = 10 ;

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allcomment.length;
  results.pageCount=Math.ceil(allcomment.length/limit);

  if (lastIndex < allcomment.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allcomment.slice(startIndex, lastIndex);
  res.json(results)
})


app.get("/getsearch", async (req, res) => {

  const search = (req.query.search)
  console.log(search);
  try {
    const allcomment = await comments.find({user: search});
    res.send({ status: "ok", comments : allcomment });
    console.log(search);
    console.log(allcomment);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getusersearch", async (req, res) => {

  const search = (req.query.search)
  try {
    const allcomment = await conformcom.find({user: search});
    res.send({ status: "ok", comments : allcomment });
    console.log(search);
    console.log(allcomment);
  } catch (error) {
    console.log(error);
  }
});


app.get("/owncomments", async (req, res) => {
  const name = req.query.name;
  console.log(name);
  const email = req.query.email;
  console.log(email);
  const isapprove = req.query.isapprove;
  console.log(isapprove);
  let owncomment = [];
  try {
    if (isapprove === "Approve") {
      owncomment = await conformcom.find({ user: name, email: email });
      console.log("awwwww");
      console.log(owncomment);
    } else {
      owncomment = await comments.find({ user: name, email: email });
      console.log("giyaaaa");
    }
    res.send({ status: "ok", data: owncomment });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteowncommentr", async (req, res) => {
  const { commentId } = req.body;
  try {
    conformcom.deleteOne({ _id: commentId }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});



app.post("/deletependingowncommentr", async (req, res) => {
  const name = req.query.name;
  const { commentId } = req.body;
  try {
    comments.deleteOne({ _id: commentId }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});