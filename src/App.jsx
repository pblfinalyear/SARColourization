import React, { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import SARImage from './components/SARImage'

const PAGES = {
  home: 'home',
  image: 'image',
  video: 'video',
  about: 'about',
}

function App() {
  const [activePage, setActivePage] = useState(PAGES.home)

  return (
    <div className="app">
      <Navigation activePage={activePage} onNavChange={setActivePage} />

      {activePage === PAGES.home && <Hero />}
      {activePage === PAGES.image && <SARImage />}
      {activePage === PAGES.video && (
        <div className="section-placeholder">Video section is under development.</div>
      )}
      {activePage === PAGES.about && (
        <div className="section-placeholder">About section is under development.</div>
      )}
    </div>
  )
}

export default App
