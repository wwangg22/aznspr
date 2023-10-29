import React, {useState} from "react";
import './rerun.css'
import url from "./url";
import { isMobile } from "./ismobile";
import AddKeywords from "./addKeywords";

export default function ReRunBtn(){
    const [isOpen, setIsOpen] = useState(false);

    function noscroll(){
        document.querySelector('body').style.overflow = "hidden";
        return ''
      }
    
      function disablenoscroll(){
        document.querySelector('body').style.overflow = "auto";
        return ''
      }


    function updateAmazon(cookies){
        document.querySelector('.cookies').value = '';
        setIsOpen(false);
        return fetch(`${url.url}/a?amazon=true`,{
            method: 'POST',
            body: JSON.stringify({
                'Cookie':cookies
            }),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(response => {
            if (!response.ok){
            throw new Error(`HTTP error: ${response.status}`);
            }
            else{
            console.log(response);
            return response.json();
            }
        }).then((res) => {console.log(res);
        
        }).catch((err) => console.error(`Fetch problem: ${err.message}`));

    }
    return (
        <>
        <button className={`rerunbtn ${isMobile ? 'mobile':''}`} type='submit' onClick={()=>{ setIsOpen(!isOpen);}}>run</button>
        <AddKeywords/>
        <div className={`backdrop${isOpen ? ' show' : ''}`}>
            <div className = {`popup${isOpen ? ` show${noscroll()}` : `${disablenoscroll()}`}`}>
                <label className="cookielabel">COOKIES</label>
                <div className='closebutton' onClick={()=>setIsOpen(!isOpen)}>X</div>
                <input type='text' className="cookies"></input>
                <button type= 'submit' className="cookiebutton" onClick={()=>updateAmazon(document.querySelector('.cookies').value)}>GO</button>
            </div>
        </div>
        </>

    )
}