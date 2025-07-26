import React, { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../components/UI/Pagination";
import Table from "../components/UI/Table";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import TextArea from "../components/Form/TextArea";

export default function UserHome({ userData }) {
  const [comments, setComments] = useState([]);
  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [reply, setReply] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState(null);
  const pageOwn = useRef(1);
  const [pcOwn, setPcOwn] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOwn("Approve", setApproved);
    fetchOwn("Unpprove", setPending);
    fetchComments();
  }, []);

  const fetchOwn = (type, setter) => {
    API.get(
      `/owncomments?name=${userData.fname}&email=${userData.email}&isapprove=${type}`
    ).then((r) => setter(r.data.data || []));
  };

  const fetchComments = () => {
    API.get(`/paginatedUsers3?page=${pageOwn.current}&search=${search}`).then(
      (r) => {
        setComments(r.data.result || []);
        setPcOwn(r.data.pageCount);
      }
    );
  };

  const submitQuestion = (e) => {
    e.preventDefault();
    API.post("/addcomment", {
      user: userData.fname,
      email: userData.email,
      comment: comments,
    }).then(() => alert("Sent"));
  };

  const submitReply = (e) => {
    e.preventDefault();
    API.post("/addreply", {
      commentID: selected,
      username: userData.fname,
      email: userData.email,
      reply,
    }).then(() => {
      alert("Reply sent");
      setShowPopup(false);
      setReply("");
    });
  };

  const deleteOwn = (id, approve) => {
    const url = approve ? "/deleteowncommentr" : "/deletependingowncommentr";
    if (!window.confirm("Delete?")) return;
    API.post(url, { commentId: id }).then(() => {
      fetchOwn(
        approve ? "Approve" : "Unpprove",
        approve ? setApproved : setPending
      );
    });
  };

  const openPopup = (id) => {
    setSelected(id);
    setShowPopup(true);
  };

  return (
    <div>
      <Navbar />

      <section className="container my-4">
        <h2>Community Forum</h2>
        <form onSubmit={submitQuestion}>
          <TextArea
            label="Write your question"
            name="comment"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <button className="btn btn-primary me-2">Send</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setComments("")}
          >
            Cancel
          </button>
        </form>

        <h4 className="mt-4">Recent Questions</h4>
        <div className="mb-3">
          <input
            className="form-control d-inline-block w-auto me-2"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-secondary me-2" onClick={fetchComments}>
            Search
          </button>
          <button
            className="btn btn-light"
            onClick={() => {
              setSearch("");
              fetchComments();
            }}
          >
            Reset
          </button>
        </div>

        <Table
          columns={[
            {
              key: "comment",
              header: "Comment",
              render: (r) =>
                r.comment.length > 80 ? (
                  <>
                    {r.comment.slice(0, 80)}…{" "}
                    <span
                      onClick={() => openPopup(r._id)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      See more
                    </span>
                  </>
                ) : (
                  r.comment
                ),
            },
            { key: "user", header: "Posted by" },
            {
              key: "createdAt",
              header: "Date",
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
          data={comments}
        />
        <Pagination
          pageCount={pcOwn}
          forcePage={pageOwn.current - 1}
          onPageChange={(e) => {
            pageOwn.current = e.selected + 1;
            fetchComments();
          }}
        />
      </section>

      {/* Popup for full comment + reply */}
      {showPopup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                />
              </div>
              <div className="modal-body">
                <p>{comments.find((c) => c._id === selected)?.comment}</p>
                <form onSubmit={submitReply}>
                  <TextArea
                    label="Your reply"
                    name="reply"
                    rows={3}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button className="btn btn-primary">Send Reply</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="container my-4">
        <h3>Your Approved Comments</h3>
        <Table
          columns={[
            { key: "comment", header: "Comment" },
            {
              key: "createdAt",
              header: "Date",
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
          data={approved}
          actions={(c) => (
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => deleteOwn(c._id, true)}
              style={{ cursor: "pointer" }}
            />
          )}
        />

        <h3 className="mt-4">Your Pending Comments</h3>
        <Table
          columns={[
            { key: "comment", header: "Comment" },
            {
              key: "createdAt",
              header: "Date",
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
          data={pending}
          actions={(c) => (
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => deleteOwn(c._id, false)}
              style={{ cursor: "pointer" }}
            />
          )}
        />
      </section>

      <Footer />
    </div>
  );
}
