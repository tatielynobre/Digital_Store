import headerLogo from '../assets/logo-header.svg'
import footerLogo from '../assets/logo-footer.svg'

export default function Logo({ variant = 'header' }) {
  const logo = variant === 'footer' ? footerLogo : headerLogo

  return <img src={logo} alt="Digital Store" width={253} height={44} />
}
