import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Input from "../components/Form/Input";
import Button from "../components/UI/Button";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
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
      // adjust endpoint if your backend uses a different route
      const { data } = await API.post("/login", form);

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
        <h3>Sign In</h3>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Submit"}
          </Button>
        </form>

        <p className="mt-3">
          Don’t have an account?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
