import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    userType: "User",
    secretKey: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.fname.trim()) errs.fname = "First name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(form.fname))
      errs.fname = "Only letters and spaces allowed.";
    if (!form.lname.trim()) errs.lname = "Last name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(form.lname))
      errs.lname = "Only letters and spaces allowed.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      errs.email = "Invalid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (form.userType === "Admin" && form.secretKey !== "12187@")
      errs.secretKey = "Invalid admin secret key.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/auth/register`,
        {
          fname: form.fname,
          lname: form.lname,
          email: form.email,
          password: form.password,
          userType: form.userType,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.status === "ok") {
        navigate("/sign-in");
      } else {
        setErrors({ submit: data.error || "Registration failed." });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit} noValidate>
          <h3>Sign Up</h3>

          {/* User Type */}
          <div className="mb-3">
            <label className="form-label">Register As</label>
            <br />
            {["User", "Admin"].map((type) => (
              <label key={type} className="me-3">
                <input
                  type="radio"
                  name="userType"
                  value={type}
                  checked={form.userType === type}
                  onChange={handleChange}
                />{" "}
                {type}
              </label>
            ))}
          </div>

          {/* Secret Key for Admin */}
          {form.userType === "Admin" && (
            <div className="mb-3">
              <label className="form-label">Secret Key</label>
              <input
                name="secretKey"
                type="text"
                className={`form-control ${
                  errors.secretKey ? "is-invalid" : ""
                }`}
                value={form.secretKey}
                onChange={handleChange}
              />
              {errors.secretKey && (
                <div className="invalid-feedback">{errors.secretKey}</div>
              )}
            </div>
          )}

          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First name</label>
            <input
              name="fname"
              type="text"
              className={`form-control ${errors.fname ? "is-invalid" : ""}`}
              value={form.fname}
              onChange={handleChange}
            />
            {errors.fname && (
              <div className="invalid-feedback">{errors.fname}</div>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last name</label>
            <input
              name="lname"
              type="text"
              className={`form-control ${errors.lname ? "is-invalid" : ""}`}
              value={form.lname}
              onChange={handleChange}
            />
            {errors.lname && (
              <div className="invalid-feedback">{errors.lname}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Submit */}
          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Registering…" : "Sign Up"}
            </button>
          </div>

          <p className="mt-3 text-center">
            Already registered? <a href="/sign-in">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  );
}
