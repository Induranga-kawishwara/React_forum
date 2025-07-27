import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminHome from "./AdminHome";
import UserHome from "./UserHome";

export default function UserDetails() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return user.userType === "Admin" ? (
    <AdminHome userData={user} />
  ) : (
    <UserHome userData={user} />
  );
}
