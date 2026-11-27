export default function FilterGroup({
  title,
  inputType = 'checkbox',
  name,
  options,
  selectedValues = [],
  onChange,
}) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {options.map((option) => {
        const value = option.value ?? option.text

        return (
          <label className="filter-group__option" key={value}>
            <input
              type={inputType}
              name={name ?? title}
              value={value}
              checked={selectedValues.includes(value)}
              onChange={() => onChange(value)}
            />
            <span>{option.text}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
