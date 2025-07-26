export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <input
        name={name}
        type={type}
        className={`form-control${error ? " is-invalid" : ""}`}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
