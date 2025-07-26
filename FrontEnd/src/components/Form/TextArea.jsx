export default function TextArea({
  label,
  name,
  rows = 3,
  value,
  onChange,
  error,
}) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <textarea
        name={name}
        rows={rows}
        className={`form-control${error ? " is-invalid" : ""}`}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
