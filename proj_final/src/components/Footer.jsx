import './Footer.css'
import Logo from './Logo.jsx'
import facebookIcon from '../assets/facebook.svg'
import instagramIcon from '../assets/instagram.svg'
import twitterIcon from '../assets/twitter.svg'

const informationGroups = [
  {
    title: 'Informações',
    informations: [
      { text: 'Sobre Drip Store', link: '/about' },
      { text: 'Blog', link: '/blog' },
      { text: 'Trabalhe conosco', link: '/work-with-us' },
      { text: 'Política de privacidade', link: '/privacy-policy' },
    ],
  },
  {
    title: 'Categorias',
    informations: [
      { text: 'Camisetas', link: '/categories/t-shirts' },
      { text: 'Calças', link: '/categories/pants' },
      { text: 'Bonés', link: '/categories/caps' },
      { text: 'Tênis', link: '/categories/sneakers' },
    ],
  },
  {
    title: 'Contato',
    informations: [
      { text: 'Fale conosco', link: '/contact' },
      { text: 'Atendimento', link: '/customer-service' },
    ],
  },
]

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/', icon: facebookIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/', icon: instagramIcon },
  { name: 'Twitter', href: 'https://www.twitter.com/', icon: twitterIcon },
]
 
function FooterInformation({ title, informations }) {
  return (
    <section className="site-footer__information">
      <h2>{title}</h2>
      <ul>
        {informations.map(({ text, link }) => (
          <li key={`${text}-${link}`}>
            <a href={link}>{text}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}


export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__brand">
          <Logo variant="footer" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            commodo ligula eget dolor.
          </p>
          <div className="site-footer__socials">
            {socialLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
              >
                <img src={icon} alt="" />
              </a>
            ))}
          </div>
        </div>

        {informationGroups.map(({ title, informations }) => (
          <FooterInformation
            key={title}
            title={title}
            informations={informations}
          />
        ))}
      </div>

      <div className="site-footer__bottom">
        <hr />
        <p>© 2024 Digital Store</p>
      </div>
    </footer>
  )
}
