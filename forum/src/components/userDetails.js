import React, { useEffect, useState } from "react";
import AdminHome from "./adminHome";
import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data.userType === "Admin") {
          setAdmin(true);
        }
        setUserData(data.data);

        if (data.data === "token expired") {
          alert("Token expired, please login again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }

        setDataLoaded(true); // Set dataLoaded to true after data is loaded
      });
  }, []);

  if (!dataLoaded) {
    console.log("loding");
    // Render loading state while data is being fetched
    return (
      <div>
        <section className="loadingpage">
          <div className="loader">
            <div className="upper ball"></div>
            <div className="right ball"></div>
            <div className="lower ball"></div>
            <div className="left ball"></div>
          </div>
        </section>
      </div>
    );
  }else{

  return admin ? (
    <AdminHome userData={userData} />
  ) : (
    
    <UserHome userData={userData} />
  );}
}
