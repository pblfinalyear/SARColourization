import './Hero.css'
import EarthScene from './EarthScene'
import Navigation from './Navigation'

function Hero() {
  return (
    <section className="hero">
      
       
    <EarthScene />
     <div className="hero-content">
      {/* <h1 className='title_name'>COLORITHM</h1> */}
      <div className="title-wrapper">
  <div className="top-curve"></div>
  <h1 className="title_name">COLORITHM</h1>
  <div className="bottom-line"></div>
</div>
      {/* <div className="curve-text">
  <svg viewBox="0 0 1000 300">
    
    <path
      id="curve"
      d="M 150 200 A 350 180 0 0 0 850 200"
      fill="transparent"
    />

    <text
      fill="white"
      fontSize="90"
      fontFamily="Big Shoulders Stencil"
      textAnchor="middle"
    >
      <textPath href="#curve" startOffset="50%">
        COLORITHM
      </textPath>
    </text>

  </svg>
</div> */}
      </div> 
    </section>
    
    
  )
  
}

export default Hero