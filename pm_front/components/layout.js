// This is the top nav bar that goes on both pages

import Link from 'next/link'
import css from "../style.css"

const Header = () => (
  <div className="topnav">
    <Link prefetch href="/">
      <a>Trade </a>
    </Link>
    <Link prefetch href="/markets">
      <a>Markets</a>
    </Link>
  </div>
)

export default Header
