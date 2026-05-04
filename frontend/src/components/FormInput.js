function FormInput({ label, name, value, onChange, type = "text", required = true }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} value={value} onChange={onChange} required={required} />
    </label>
  );
}

export default FormInput;
