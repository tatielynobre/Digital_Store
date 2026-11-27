import { useState } from 'react'
import arrowLeft from '../assets/arrow-left.svg'
import arrowRight from '../assets/arrow-right.svg'

export default function Gallery({
  images,
  className = '',
  width = '100%',
  height,
  radius = '0',
  showThumbs = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentImage = images[currentIndex]
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    maxWidth: '100%',
    ...(height
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : {}),
    borderRadius: radius,
  }

  if (!currentImage) {
    return null
  }

  return (
    <div className={`gallery ${className}`}>
      <div className="gallery__stage" style={style}>
        <img
          className="gallery__image"
          src={currentImage.src}
          alt={currentImage.alt ?? `Imagem ${currentIndex + 1}`}
          style={{ borderRadius: radius }}
        />
        <button
          aria-label="Imagem anterior"
          className="gallery__arrow gallery__arrow--left"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => index - 1)}
          type="button"
        >
          <img src={arrowLeft} alt="" />
        </button>
        <button
          aria-label="Próxima imagem"
          className="gallery__arrow gallery__arrow--right"
          disabled={currentIndex === images.length - 1}
          onClick={() => setCurrentIndex((index) => index + 1)}
          type="button"
        >
          <img src={arrowRight} alt="" />
        </button>
      </div>
      {showThumbs && (
        <div className="gallery__thumbs">
          {images.map((image, index) => (
            <button
              aria-label={`Exibir imagem ${index + 1}`}
              aria-pressed={currentIndex === index}
              className={`gallery__thumb ${
                currentIndex === index ? 'gallery__thumb--selected' : ''
              }`}
              key={image.src}
              onClick={() => setCurrentIndex(index)}
              type="button"
            >
              <img src={image.src} alt="" style={{ borderRadius: radius }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
