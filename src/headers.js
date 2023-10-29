import './headers.css'
import React, {useState} from 'react'
import ProgressBar from './progressbar'
import Amazon from './options'
import ReRunBtn from './rerun'
import AddKeywords from './addKeywords'
import { isMobile } from './ismobile'

export default function Headers() {
    const [percentage, setPercentage] = useState(0);
    var dict = {};

    const socket = new WebSocket("ws://localhost:3000/");//window.location.host + "/ws/");

    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });

    socket.addEventListener('message', function (event) {
        //console.log('Message from server ', event.data);
        try{
            const data = JSON.parse(event.data);
            var percentage =0;
            for (const b of Object.keys(data)){
                percentage += data[b] / Object.keys(data).length
            }
            setPercentage(percentage);

            
        }
        catch(e){
            console.log('not json');
        }
        
    });

    return (
        <div className={`options ${isMobile ? 'mobile' : ''}`}>
            <h1>Amazon DATA</h1>
            <ProgressBar
                percentage = {percentage*100}
                />
            <div className= {`containers ${isMobile ? 'mobile':''}`}>
                <Amazon/>
                <ReRunBtn/>
                {/* <AddKeywords/> */}
            </div>
        </div>
    )
}