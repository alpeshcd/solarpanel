import React from 'react'
import solarAvf from '../../../../../public/img/solar.jpg'
import home from '../../../../../public/img/home.png'
import './solar.css'
import power from '../../../../../public/img/power.avif'

const Solar = () => {
    return (
        <div>
            <div className="container py-4">
                <div className="status-row">
                    <div className="status-badge">Normal</div>
                    <div className="temperature">☀️ 40°C</div>
                </div>

                <div className="main-box example-5">
                    {/* <svg viewBox="0 0 420 420" className="animated-border">
                        <path
                            className="line"
                            d="M210,0 
           L0,0 
           L0,420 
           L420,420 
           L420,0 
           L210,0"
                        />
                    </svg> */}
                    <svg
                        viewBox="0 0 420 420"
                        className="animated-border"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            className="line"
                            d="
          M210,0 
          H36 
          A36,36 0 0 0 0,36 
          V384 
          A36,36 0 0 0 36,420 
          H384 
          A36,36 0 0 0 420,384 
          V36 
          A36,36 0 0 0 384,0 
          Z
        "
                        />
                    </svg>

                    <div className="icon-box solar">
                        <img
                            src={solarAvf}
                            alt="Solar Panel"
                            className="icon"
                        />
                        <div className="energy-label">101.4 kW</div>
                    </div>

                    <div className="icon-box house">
                        <img src={home} alt="House" className="icon" />
                    </div>

                    <div className="icon-box gridss">
                        <img src={power} alt="Grid" className="icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Solar
