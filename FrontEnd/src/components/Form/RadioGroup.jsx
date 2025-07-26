export default function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <br />
      {options.map((opt) => (
        <label key={opt.value} className="me-3">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
          />{" "}
          {opt.label}
        </label>
      ))}
    </div>
  );
}
