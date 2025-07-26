import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      errs.email = "Invalid email address.";

    if (!form.password) errs.password = "Password is required.";
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
        `${API}/auth/LoginPage`,
        { email: form.email, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.status === "ok") {
        localStorage.setItem("token", data.data);
        localStorage.setItem("loggedIn", "true");
        navigate("/userDetails");
      } else {
        setErrors({ submit: data.error || "Invalid credentials." });
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
          <h3>Sign In</h3>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              name="email"
              type="email"
              className={`form-control${errors.email ? " is-invalid" : ""}`}
              placeholder="Enter email"
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
              className={`form-control${errors.password ? " is-invalid" : ""}`}
              placeholder="Enter password"
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
              {loading ? "Signing in…" : "Submit"}
            </button>
          </div>

          <p className="forgot-password text-right mt-3">
            <a href="/sign-up">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
