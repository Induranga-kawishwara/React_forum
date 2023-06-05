import React, { Component, useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faHandPointRight } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import { useRef } from "react";
export default function AdminHome({ userData }) {
  //setting state
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageCount2, setPageCount2] = useState(1);

  const [search, setsearch] = useState("");

  const [comments, setComments] = useState([]);
  const currentPage = useRef();
  const currentPage2 = useRef();
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    currentPage.current = 1;
    currentPage2.current = 1;
    // getAllUser();
    // getPendingComment();
    getPaginatedUsers();
    getPaginatedUsers2();
  }, []);

  const handleMessageChange = (e) => {
    setMsg(e.target.value);
    setEmail(userData.email);
    setFname(userData.fname);
  };

  //fetching all user
  const getAllUser = () => {
    fetch("http://localhost:5000/getAllUser", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      });
  };

  const getPendingComment = () => {
    fetch("http://localhost:5000/getpendingcomment", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.comments, "comments");
        setComments(response.comments || []);
      });
  };

  //logout
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  //deleting user
  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      fetch("http://localhost:5000/deleteUser", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser();
          // getpendingcomment();
        });
    } else {
    }
  };

  const deletecomment = (id) => {
    if (window.confirm(`Are you sure you want to delete that comment`)) {
      fetch("http://localhost:5000/deletecomment", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          commentID: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          // getAllUser();
          getPendingComment();
        });
    } else {
    }
  };

  const conformedpost = (id) => {
    if (window.confirm(`Are you sure you want to conform that post`)) {
      fetch("http://localhost:5000/conformedpost", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          conformedpostID: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getPendingComment();
        });
    } else {
    }
  };

  //pagination
  function handlePageClick(e) {
    console.log(e);
    currentPage.current = e.selected + 1;
    getPaginatedUsers();
  }

  function handlecomment(e) {
    console.log(e);
    currentPage2.current = e.selected + 1;
    getPaginatedUsers2();
  }

  function changeLimit(e) {
    console.log(search);
    fetch(`http://localhost:5000/getsearch?search=${search}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setComments(data.comments);
        getPaginatedUsers2();
      });
  }

  function resettable() {
    getPaginatedUsers2();
  }

  function getPaginatedUsers() {
    fetch(`http://localhost:5000/paginatedUsers?page=${currentPage.current}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount(data.pageCount);
        setData(data.result);
      });
  }

  function getPaginatedUsers2() {
    fetch(
      `http://localhost:5000/paginatedUsers2?page=${currentPage2.current}&search=${search}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount2(data.pageCount);
        setComments(data.result);
        setsearch("");
      });
  }

  const handleQuestionSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/addcommentadmin", {
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
        comment: msg,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        setMsg("");

        if (data.status === "ok") {
          alert("Registration Successful");
        } else {
          alert("Something went wrong");
        }
      });
  };

  return (
    <div className="auth-wrapper" style={{ height: "auto" }}>
      <div className="auth-inner" style={{ width: "auto" }}>
        <h3>Welcom Admin</h3>
        <table style={{ width: 500 }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Delete</th>
          </tr>
          {data.map((i) => {
            return (
              <tr>
                <td>{i.fname}</td>
                <td>{i.email}</td>
                <td>{i.userType}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteUser(i._id, i.fname)}
                  />
                </td>
              </tr>
            );
          })}
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
          forcePage={currentPage.current - 1}
        />
        <input
          placeholder="Name"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
        />
        <button onClick={changeLimit}>search</button>
        <button onClick={resettable}>Reset</button>

        <table style={{ width: 500 }}>
          <tr>
            <th>Name</th>
            <th>comment</th>
            <th>approve</th>
            <th>Delete</th>
          </tr>
          {comments.length > 0 ? (
            comments.map((c) => (
              <tr key={c._id}>
                <td>{c.user}</td>
                <td>{c.comment}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faHandPointRight}
                    onClick={() => conformedpost(c._id)}
                  />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deletecomment(c._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No comments found</td>
            </tr>
          )}
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlecomment}
          pageRangeDisplayed={5}
          pageCount={pageCount2}
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
          forcePage={currentPage2.current - 1}
        />

        <div className="container">
          <div className="panel panel-default">
            <div className="panel-body">
              <h3>Any post</h3>
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
        </div>

        <button onClick={logOut} className="btn btn-primary">
          Log Out
        </button>
      </div>
    </div>
  );
}
