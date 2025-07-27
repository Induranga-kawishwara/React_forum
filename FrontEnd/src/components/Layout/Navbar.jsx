import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Navbar() {
  const { setUser } = useContext(AuthContext);

  const logOut = async () => {
    await API.post("auth/logout");
    setUser(null);
  };

  return (
    <nav className="navbar bg-light mb-4">
      <div className="container">
        <span className="navbar-brand">Apple House</span>
        <button className="btn btn-outline-dark" onClick={logOut}>
          Log Out
        </button>
      </div>
    </nav>
  );
}
