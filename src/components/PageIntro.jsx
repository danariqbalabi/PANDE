import { Link } from 'react-router-dom'
import './nav-pages.css'

export default function PageIntro({ code, title, description, meta = [], children }) {
  return <header className="navpage-intro">
    <div className="wrap">
      <div className="navpage-breadcrumb"><Link to="/">PANDE</Link><span>/ {code}</span><span>TEMPA PASIR WETAN</span></div>
      <div className="navpage-heading">
        <div><h1>{title}</h1><p>{description}</p>{children}</div>
        {meta.length > 0 && <dl className="navpage-meta">{meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      </div>
    </div>
  </header>
}
