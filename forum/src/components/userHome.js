import React, { Component, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRef } from "react";
import iphone15 from "../images/iphone15.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//import footer and navigation bars
import Footer from "./footer/Footer";
import Navbar from "./nav/navbar/Navbar";

const UserHome = ({ userData }) => {
  // declared some variables to store data
  const [msg, setMsg] = useState("");
  const [reply, setreply] = useState("");
  const [comments, setComments] = useState([]);
  const [allreplyies, setallreplyies] = useState([]);
  const currentPage = useRef();
  const [pageCount, setPageCount] = useState(1);
  const [search, setsearch] = useState("");
  const [selected, setselected] = useState(" ");
  const [approvedowncoments, setapprovedowncomment] = useState([]);
  const [unapprovedowncoments, setunapprovedowncomment] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Declared popup window opening function
  const handleClosePopup1 = () => {
    setShowPopup(true);
  };

  // Declared popup window closing function

  const handleClosePopup = () => {
    setShowPopup(false);
    setMsg("");
    setallreplyies([]);
  };
  //  Declared function to get selected comment and pass the comment id to this founction
  const selectcomment = (id) => {
    setselected(id.toString());
    getallreplyes(id);
    handleClosePopup1();
  };

  useEffect(() => {
    console.log(userData);
    currentPage.current = 1;
    getPaginatedUsers();
    handleowncomment();
    handleunapproveowncomment();
  }, []);

  const handleMessageChange = (e) => {
    setMsg(e.target.value);
  };

  const handleReply = (e) => {
    setreply(e.target.value);
  };

  // pass submitted question to mongoDb using "Post"
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
        user: userData.fname,
        email: userData.email,
        comment: msg,
        // createdat :
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg("");
        console.log(data, "userRegister");
        if (data.status == "ok") {
          alert("Comments have been sent");
        } else {
          alert("Something went wrong");
        }
      });
  };

  // Get the current user's approved question from MongoDB using "get".
  function handleowncomment() {
    fetch(
      `http://localhost:5000/owncomments?name=${userData.fname}&email=${
        userData.email
      }&isapprove=${"Approve"}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setapprovedowncomment(data.data || []);
      });
  }

  // Get the current user's unapproved question from MongoDB using "get".
  function handleunapproveowncomment() {
    console.log(userData.fname);
    fetch(
      `http://localhost:5000/owncomments?name=${userData.fname}&email=${
        userData.email
      }&isapprove=${"Unpprove"}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setunapprovedowncomment(data.data || []);
      });
  }

  // pass submitted reply to mongoDb using "Post"
  const handleReplySubmit = (e) => {
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
        commentID: selected,
        username: userData.fname,
        email: userData.email,
        reply,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          console.log(selected);
          alert("Reply have been sent");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setreply("");
    setShowPopup(false);
  };

  // Get the all replies from MongoDB using "get".
  function getallreplyes(id) {
    fetch(`http://localhost:5000/getallreplies?selecte=${id.toString()}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.allreplyies, "comments");
        setallreplyies(response.allreplyies || []);
      });
  }

  function getPaginatedUsers() {
    fetch(
      `http://localhost:5000/paginatedUsers3?page=${currentPage.current}&search=${search}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount(data.pageCount);
        setComments(data.result || []);
        setsearch("");
      });
  }

  function handlePageClick(e) {
    console.log(e);
    currentPage.current = e.selected + 1;
    getPaginatedUsers();
  }
  function changeLimit(e) {
    console.log(search);
    fetch(`http://localhost:5000/getusersearch?search=${search}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setComments(data.comments);
        getPaginatedUsers();
      });
  }

  // Declared function to reset the table
  function resettable() {
    getPaginatedUsers();
  }

  function Cancel() {
    setMsg("");
  }
  // Declared this function to  delete current user's approved comment from the database
  const deleteowncomment = (id) => {
    if (window.confirm(`Are you sure you want to delete that comment`)) {
      fetch("http://localhost:5000/deleteowncommentr", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          commentId: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          handleowncomment();
          getPaginatedUsers();
        });
    } else {
    }
  };
  // Declared this function to delete the current user's unapproved comment from the database
  const deleteunapprovedowncomment = (id) => {
    if (window.confirm(`Are you sure you want to delete that comment`)) {
      fetch("http://localhost:5000/deletependingowncommentr", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          commentId: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          handleunapproveowncomment();
        });
    } else {
    }
  };

  const truncateText = (text) => {
    if (text.length > 80) {
      return text.substring(0, 80) + "...";
    }
    return text;
  };

  return (
    <div className="clint">
      <Navbar />
      <div className={`main ${showPopup ? "new_main" : ""}`}>
        {/* Home page */}
        <section className="home" id="home">
          <div class="typewriter">
            <div class="text">Welcom </div>
            <h1>to Apple House forume</h1>
            <h4>Find out our the new product</h4>
          </div>
        </section>
        {/* About page */}
        <section class="about" id="about">
          <div class="max-width">
            <h2 class="title">About The new product </h2>
            <h3>what is the new product ? </h3>
            <div class="about-content">
              <div class="column_left">
                <img src={iphone15} alt="my picture" />
              </div>
              <div class="column_right">
                <div class="text">
                  Our new product is{" "}
                  <span class="typing-2">IPhone 15 pro max</span>
                </div>
                <p>
                  the iPhone 15 represents a compelling package of design,
                  display, performance, photography capabilities, connectivity,
                  and software advancements. With its refined aesthetics,
                  powerful A15 Bionic chip, improved camera system, extended
                  battery life, 5G support, ample storage options, and the
                  latest iOS, it sets a new benchmark for smartphone excellence.
                  Apple continues to push the boundaries of innovation,
                  delivering a device that seamlessly integrates into users'
                  lives while offering an exceptional mobile experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Comment form */}
        <section className="Community_forum" id="Community_forum">
          <div className="panel panel-default">
            <h2>Community forum</h2>
            <h3>what do you think about new product? </h3>
            <div className="panel-body">
              <h4>Recent questions</h4>
              <div className="searchBar">
                <input
                  placeholder="Name"
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                />
                <button onClick={changeLimit}>search</button>
                <button onClick={resettable}>Reset</button>
                {/* <button onClick={logOut} className="btn btn-primary">
                  Log Out
                </button> */}
              </div>
              <div className="comment_tab">
                <table className="comment_table">
                  <tbody id="record">
                    <tr>
                      <th>No</th>
                      <th>comment</th>
                      <th>replies</th>
                      <th>Poster</th>
                      <th>Date and Time</th>
                    </tr>
                    {/* check comment varible is null or not*/}
                    {comments.length === 0 ? (
                      <tr>
                        <td colSpan={5}>No comments found</td>
                      </tr>
                    ) : (
                      comments.map((comment, index) => (
                        <tr key={comment.id}>
                          <td>{index + 1}</td>
                          {/* <td>{comment.comment}</td> */}
                          <td>
                            {/* check comments are more than long 80  */}
                            {comment.comment.length > 80 ? (
                              <div>
                                {truncateText(comment.comment)}
                                <br />
                                <span
                                  className="see_more_link"
                                  onClick={() => selectcomment(comment._id)}
                                >
                                  See more...
                                </span>
                              </div>
                            ) : (
                              <div>{comment.comment}</div>
                            )}
                          </td>

                          <td onClick={() => selectcomment(comment._id)}>
                            Click Me
                          </td>
                          <td>{"posted by " + comment.user}</td>
                          <td>
                            {"Date: " +
                              new Date(comment.createdAt).toDateString()}
                            <br />
                            {"Time: " +
                              new Date(comment.createdAt).toLocaleTimeString()}
                            <br />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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
                forcePage={currentPage.current - 1}
              />
            </div>
          </div>
          <div className="Community">
            <div className="Community_body">
              <form onSubmit={handleQuestionSubmit}>
                <div className="form-group">
                  <div className="comment">
                    <label htmlFor="comment">Write your question:</label>
                  </div>
                  {/* Text area to receive comments from the user */}
                  <textarea
                    className="form-control"
                    rows="5"
                    name="msg"
                    value={msg}
                    onChange={handleMessageChange}
                    required
                  ></textarea>
                </div>
                <div className="button">
                  <button>Send</button>
                  <button onClick={Cancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </section>
        {/* user controle panel */}
        <section className="controlepanal">
          <div className="control">
            <h2>User control panel</h2>
            <h3>Do you want to manage your activitys? </h3>
            <div className="tables">
              <div className="approve_table">
                <h4>Approved comments</h4>
                {/* table to show the user's approved comments */}
                <table className="controle_table">
                  <tr>
                    <th>No</th>
                    <th>Comment</th>
                    <th>replies</th>
                    <th>Date and Time</th>
                    <th>Delete</th>
                  </tr>
                  {approvedowncoments.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No comments found</td>
                    </tr>
                  ) : (
                    approvedowncoments.map((own, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          {/* <td>{own.comment}</td> */}
                          <td>
                            {own.comment.length > 80 ? (
                              <div>
                                {truncateText(own.comment)}
                                <br />
                                <span
                                  className="see_more_link"
                                  onClick={() => selectcomment(own._id)}
                                >
                                  See more...
                                </span>
                              </div>
                            ) : (
                              <div>{own.comment}</div>
                            )}
                          </td>
                          <td onClick={() => selectcomment(own._id)}>
                            Click Me
                          </td>
                          <td>
                            {"Date: " + new Date(own.createdAt).toDateString()}
                            <br />
                            {"Time: " +
                              new Date(own.createdAt).toLocaleTimeString()}
                            <br />
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => deleteowncomment(own._id)}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </table>
              </div>
              <div className="Pending_table">
                <h4>Pending comments</h4>
                {/* table to show the user's unapproved comments */}
                <table className="controle_table">
                  <tr>
                    <th>No</th>
                    <th>Comment</th>
                    <th>Date and Time</th>
                    <th>Delete</th>
                  </tr>
                  {approvedowncoments.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No comments found</td>
                    </tr>
                  ) : (
                    unapprovedowncoments.map((own, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{own.comment}</td>
                          {/* <td>
                        {own.comment.length > 80 ? (
                          <div>
                            {truncateText(own.comment)}
                            <br />
                            <span
                              className="see_more_link"
                              onClick={() => selectcomment(own._id)}
                            >
                              See more...
                            </span>
                          </div>
                        ) : (
                          <div>{own.comment}</div>
                        )}
                      </td> */}
                          <td>
                            {"Date: " + new Date(own.createdAt).toDateString()}
                            <br />
                            {"Time: " +
                              new Date(own.createdAt).toLocaleTimeString()}
                            <br />
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() =>
                                deleteunapprovedowncomment(own._id)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className={`popup ${showPopup ? "new_pop" : ""}`} id="popup">
        <div className="comment_body">
          <div className="pop_comment">
            <label htmlFor="comment">Comment:</label>
          </div>
          <div className="comment">
            {comments.map((comment) =>
              comment._id.toString() === selected ? (
                <p>{comment.comment}</p>
              ) : null
            )}
          </div>
        </div>
        <div className="reply_body">
          <div className="text_question">
            <label htmlFor="question">Write your question:</label>
          </div>
          <form onSubmit={handleReplySubmit}>
            <div className="reply">
              <textarea
                className="form-control"
                rows="8"
                name="reply"
                value={reply}
                onChange={handleReply}
                required
              ></textarea>
            </div>
            <div className="button">
              <button>Send</button>
              <button onClick={handleClosePopup}>Cancel</button>
            </div>
          </form>
        </div>
        <div className="reply_table">
          <div className="text_reply">
            <label htmlFor="reply">Replies:</label>
          </div>
          <div className="table">
            <table>
              <tbody>
                <tr>
                  <th>No</th>
                  <th>reply</th>
                  <th>Poster</th>
                </tr>
                {allreplyies.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No replyies found</td>
                  </tr>
                ) : (
                  allreplyies.map((replies, index) => (
                    <tr key={replies.id}>
                      <td>{index + 1}</td>
                      <td>{replies.reply}</td>
                      <td>{"posted by " + replies.username}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserHome;
