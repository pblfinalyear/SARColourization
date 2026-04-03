import React from 'react'
import './Navigation.css'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
  { id: 'about', label: 'About' },
]

const Navigation = ({ activePage = 'home', onNavChange = () => {} }) => {
  return (
    <div>
      <nav>
        <div className="logo_div"> 
          <img src="./Logo.png" className='logo' alt="Logo" />
        </div>
        <div className="menu">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activePage === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                onNavChange(item.id)
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Navigation
