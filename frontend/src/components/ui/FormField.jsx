export default function FormField({
  label,
  htmlFor,
  type = 'text',
  options = [],
  placeholder,
  hint,
  className = '',
  inputClassName = '',
  children,
  ...inputProps
}) {
  const id = htmlFor || inputProps.name || inputProps.id;

  let control = children;
  if (!control) {
    if (type === 'select') {
      control = (
        <select id={id} className={`form-select ${inputClassName}`.trim()} {...inputProps}>
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>
      );
    } else {
      control = (
        <input
          id={id}
          type={type}
          className={`form-input ${inputClassName}`.trim()}
          placeholder={placeholder}
          {...inputProps}
        />
      );
    }
  }

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && <label htmlFor={id}>{label}</label>}
      {control}
      {hint && <small className="form-hint">{hint}</small>}
    </div>
  );
}
