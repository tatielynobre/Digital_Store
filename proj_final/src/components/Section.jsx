import { Link } from 'react-router-dom'

export default function Section({
  title,
  titleAlign = 'left',
  link,
  children,
}) {
  return (
    <section className={`content-section content-section--${titleAlign}`}>
      <div className="content-section__heading">
        <h2>{title}</h2>
        {link && <Link to={link.href}>{link.text}</Link>}
      </div>
      {children}
    </section>
  )
}
