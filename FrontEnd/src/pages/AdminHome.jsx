import React, { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import { faTrash, faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../components/UI/Pagination";
import Table from "../components/UI/Table";

export default function AdminHome({ userData }) {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [pcUsers, setPcUsers] = useState(1);
  const [pcComments, setPcComments] = useState(1);
  const [search, setSearch] = useState("");
  const pageUsers = useRef(1);
  const pageComments = useRef(1);

  useEffect(() => {
    fetchUsers();
    fetchComments();
  }, []);

  const fetchUsers = () => {
    API.get(`/paginatedUsers?page=${pageUsers.current}`).then((r) => {
      setUsers(r.data.result);
      setPcUsers(r.data.pageCount);
    });
  };

  const fetchComments = () => {
    API.get(
      `/paginatedUsers2?page=${pageComments.current}&search=${search}`
    ).then((r) => {
      setComments(r.data.result);
      setPcComments(r.data.pageCount);
    });
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    API.post("/deleteUser", { userid: id }).then(() => fetchUsers());
  };

  const deleteComment = (id) => {
    if (!window.confirm("Delete this comment?")) return;
    API.post("/deletecomment", { commentID: id }).then(() => fetchComments());
  };

  const confirmComment = (id) => {
    if (!window.confirm("Approve this comment?")) return;
    API.post("/conformedpost", { conformedpostID: id }).then(() =>
      fetchComments()
    );
  };

  const onSearch = () => {
    pageComments.current = 1;
    fetchComments();
  };

  const resetSearch = () => {
    setSearch("");
    pageComments.current = 1;
    fetchComments();
  };

  return (
    <div>
      <section className="container my-4">
        <h2>Current Users</h2>
        <Table
          columns={[
            { key: "fname", header: "Name" },
            { key: "email", header: "Email" },
            { key: "userType", header: "Type" },
          ]}
          data={users}
          actions={(u) => (
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => deleteUser(u._id)}
              style={{ cursor: "pointer" }}
            />
          )}
        />
        <Pagination
          pageCount={pcUsers}
          forcePage={pageUsers.current - 1}
          onPageChange={(e) => {
            pageUsers.current = e.selected + 1;
            fetchUsers();
          }}
        />
      </section>

      <section className="container my-4">
        <h2>Pending Comments</h2>
        <div className="mb-3">
          <input
            className="form-control d-inline-block w-auto me-2"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-secondary me-2" onClick={onSearch}>
            Search
          </button>
          <button className="btn btn-light" onClick={resetSearch}>
            Reset
          </button>
        </div>
        <Table
          columns={[
            { key: "user", header: "Name" },
            { key: "comment", header: "Comment" },
          ]}
          data={comments}
          actions={(c) => (
            <>
              <FontAwesomeIcon
                icon={faHandPointRight}
                onClick={() => confirmComment(c._id)}
                style={{ cursor: "pointer", marginRight: "1rem" }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteComment(c._id)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}
        />
        <Pagination
          pageCount={pcComments}
          forcePage={pageComments.current - 1}
          onPageChange={(e) => {
            pageComments.current = e.selected + 1;
            fetchComments();
          }}
        />
      </section>
    </div>
  );
}
