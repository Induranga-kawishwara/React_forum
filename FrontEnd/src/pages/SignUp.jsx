import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Input from "../components/Form/Input";
import RadioGroup from "../components/Form/RadioGroup";
import Button from "../components/UI/Button";

export default function SignUp() {
  const navigate = useNavigate();
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
    const e = {};
    if (!form.fname.trim()) e.fname = "First name is required.";
    if (!form.lname.trim()) e.lname = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password) e.password = "Password is required.";
    if (form.userType === "Admin" && form.secretKey !== "12187@")
      e.secretKey = "Invalid admin key.";
    return e;
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
      const { data } = await API.post("auth/register", form);
      if (data.status === "ok") {
        navigate("/sign-in");
      } else {
        setErrors({ submit: data.error || "Registration failed." });
      }
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3>Sign Up</h3>

        <form onSubmit={handleSubmit} noValidate>
          <RadioGroup
            label="Register As"
            name="userType"
            options={[
              { label: "User", value: "User" },
              { label: "Admin", value: "Admin" },
            ]}
            value={form.userType}
            onChange={handleChange}
          />

          {form.userType === "Admin" && (
            <Input
              label="Secret Key"
              name="secretKey"
              value={form.secretKey}
              onChange={handleChange}
              error={errors.secretKey}
            />
          )}

          <Input
            label="First Name"
            name="fname"
            value={form.fname}
            onChange={handleChange}
            error={errors.fname}
          />

          <Input
            label="Last Name"
            name="lname"
            value={form.lname}
            onChange={handleChange}
            error={errors.lname}
          />

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

          <div className="d-grid">
            <Button type="submit" disabled={loading}>
              {loading ? "Registering…" : "Sign Up"}
            </Button>
          </div>
        </form>

        <p className="mt-3">
          Already registered?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
