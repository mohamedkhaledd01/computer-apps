function SelectInput({ label, name, value, onChange, options, valueKey = "id", labelKey = "title" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange} required>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey] || option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SelectInput;
