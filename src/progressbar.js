import './progressbar.css'
import React from 'react'

export default function ProgressBar({percentage}) {

    return (
        <>
        <h1 className="progressbartitle">RUN PROGRESS BAR</h1>
        <h1 className = "progressbartitle">{percentage.toFixed(1)}%</h1>
        <div className = "progressbar">
            <div style={{width: `${percentage}%`,height: '24px',backgroundColor: 'deeppink'}}>
            </div>

        </div>
        </>
    )
}