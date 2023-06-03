// // import React, { Component, useEffect, useState } from "react";

// // export default function UserHome({ userData }) {
//   // const logOut = () => {
//   //   window.localStorage.clear();
//   //   window.location.href = "./sign-in";
//   // };
// //   return (
// //     <div className="auth-wrapper">
// //       <div className="auth-inner">
// //         <div>
// //           Name<h1>{userData.fname}</h1>
// //           Email <h1>{userData.email}</h1>
// //           <br />
// //           <button onClick={logOut} className="btn btn-primary">
// //             Log Out
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState } from "react";

// const UserHome = ({ userData }) => {

  // // const [name, setName] = useState("");
  // const [fname, setFname] = useState("");
  // const [email, setEmail] = useState("");
  // const [msg, setMsg] = useState("");
  
  // const handleMessageChange = (e) => {
  //     setMsg(e.target.value);
  //     setEmail(userData.email);
  //     setFname(userData.fname);
  // };

  // const handleQuestionSubmit = (e) => {
  //   e.preventDefault();

  //     fetch("http://localhost:5000/addcomment", {
  //       method: "POST",
  //       crossDomain: true,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //       body: JSON.stringify({
  //         fname,
  //         email,
  //         msg,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data, "userRegister");
  //         if (data.status == "ok") {
  //           alert("Registration Successful");
  //         } else {
  //           alert("Something went wrong");
  //         }
  //       });
  // };


//   return (
//     <div className="container">
//       <div className="panel panel-default">
//         <div className="panel-body">
//           <h3>Community forum</h3>
//           <hr />
//           <form onSubmit={handleQuestionSubmit}>
//             <div className="form-group"></div>
//             <div className="form-group">
//               <label htmlFor="comment">Write your question:</label>
//               <textarea
//                 className="form-control"
//                 rows="5"
//                 name="msg"
//                 value={msg}
//                 onChange={handleMessageChange}
//                 required
//               ></textarea>
//             </div>
//             <input type="submit" className="btn btn-primary" value="Send" />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserHome;

import React, { Component, useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { useRef } from "react";


const UserHome = ({ userData }) => {

  // const [name, setName] = useState("");
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [reply, setreply] = useState("");
  const [comments, setComments] = useState([]);
  const currentPage=useRef();
  const [pageCount,setPageCount]=useState(1);

  useEffect(() => {
    // getAllUser();
    currentPage.current=1;
    getconformedcomments();
  }, []);

  
  const handleMessageChange = (e) => {
      setMsg(e.target.value);
      setEmail(userData.email);
      setFname(userData.fname);
  };

  const handleReply = (e) =>{
    setreply(e.target.value);
    setEmail(userData.email);
    setFname(userData.fname);

  }


  const handleQuestionSubmit = (e) => {
    e.preventDefault();

      fetch("http://localhost:5000/addcomment", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          user: fname,
          email,
          comment:msg,
          // createdat : 
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
          if (data.status == "ok") {
            alert("Registration Successful");
          } else {
            alert("Something went wrong");
          }
        });
  };

  const handleReplySubmit = (e, commentID) => {
    e.preventDefault();
  
    fetch("http://localhost:5000/addreply", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        commentID: commentID.toString(),
        fname,
        email,
        reply,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("Registration Successful");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  const replycount = (id) => {

  };




  const getconformedcomments = () => {
    fetch("http://localhost:5000/getconformedpost", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.comments, "comments");
        setComments(response.comments || []);
      });
  };

  function getPaginatedUsers(){
    fetch(`http://localhost:5000/paginatedUsers?page=${currentPage.current}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount(data.pageCount);
        setComments(data.result)

        
       
      });

  }

  function handlePageClick(e) {
    console.log(e);
   currentPage.current=e.selected+1;
    getPaginatedUsers();
   

  }





  



  return (
    
    <div className="container">
      <div className="panel panel-default" style={{ marginTop: '50px' }}>
        <div className="panel-body">
          <h3>Community forum</h3>
          <hr />
          <form onSubmit={handleQuestionSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Write your question:</label>
              <textarea
                className="form-control"
                rows="5"
                name="msg"
                value={msg}
                onChange={handleMessageChange}
                required
              ></textarea>
            </div>
            <input type="submit" className="btn btn-primary" value="Send" />
          </form>
        </div>
      </div>

      <div className="panel panel-default">
        <div className="panel-body">
          <h4>Recent questions</h4>
          <table
            className="table"
            id="MyTable"
            style={{ backgroundColor: '#edfafa', border: '0px', borderRadius: '10px' }}
          >
            <tbody id="record">
              <tr>
              <th>No</th>
              <th>comment</th>
              <th>replies</th>
              <th>Poster</th>
              <th>Date and Time</th>
              </tr>
              {/* Render the comments here */}
              {comments.map((comment, index) =>(
                  <tr key={comment.id}>
                    <td>{index+1}</td>
                    <td onClick={() => replycount(comment._id)}>
                      {comment.comment}
                    </td>
                    <td>{"22"}</td>
                    <td>{'posted by ' + comment.user}</td>
                    <td>
                      {"Date: " + new Date(comment.createdAt).toDateString()}
                      <br />
                      {"Time: " + new Date(comment.createdAt).toLocaleTimeString()}
                      <br />
                    </td>

                  </tr>
                   
              ))}
            </tbody>
          </table>
          <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage.current-1}
        />
        </div>
      </div>
    </div>
  );
};

export default UserHome;
