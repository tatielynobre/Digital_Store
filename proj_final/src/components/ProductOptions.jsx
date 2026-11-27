import { useState } from 'react'

export default function ProductOptions({
  options,
  radius = '4px',
  shape = 'square',
  type = 'text',
  title,
}) {
  const [selectedOption, setSelectedOption] = useState(options[0])

  return (
    <fieldset className="product-options">
      {title && <legend>{title}</legend>}
      <div className={`product-options__items product-options__items--${shape}`}>
        {options.map((option) => (
          <button
            aria-label={type === 'color' ? `Cor ${option}` : option}
            aria-pressed={selectedOption === option}
            className={`product-options__item ${
              selectedOption === option ? 'product-options__item--selected' : ''
            }`}
            key={option}
            onClick={() => setSelectedOption(option)}
            style={{
              ...(shape === 'square' ? { borderRadius: radius } : {}),
              ...(type === 'color' ? { backgroundColor: option } : {}),
            }}
            type="button"
          >
            {type === 'text' && option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
