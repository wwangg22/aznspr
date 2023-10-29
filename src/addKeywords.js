import React, {useContext, useState, useEffect} from 'react';
import './addKeywords.css'
import { SelectedOptionsContext } from './options';
import url from './url';
import {isMobile} from './ismobile';


export default function AddKeywords() {
    const { selectedOptions, setSelectedOptions, keyword, setkeyword } = useContext(SelectedOptionsContext);
    const [isOpen, setIsOpen] = useState(false);

    function noscroll(){
        document.querySelector('body').style.overflow = "hidden";
        return ''
      }
    
      function disablenoscroll(){
        document.querySelector('body').style.overflow = "auto";
        return ''
      }

    useEffect(()=>{
        async function getKeywords(){
          return fetch(`${url.url}/keywords`,{
          mode: 'cors'
          }).then(response => {
            if (!response.ok){
              throw new Error(`HTTP error: ${response.status}`);
            }
            else{
              return response.json()
            }
          }).then((res) => {console.log(res);
            setkeyword(res.keywords)
            
        
          }).catch((err) => console.error(`Fetch problem: ${err.message}`));
        }
        getKeywords()
      }, [isOpen])

    const handeAddKeyword = text => {
        document.querySelector('.option.keywordinput').value = '';
        setkeyword([...keyword,text]);
        console.log(keyword);
        fetch(`${url.url}/a?keywords=${text}`,{
            mode: 'cors'
        }).then(response => {
            if (!response.ok){
            throw new Error(`HTTP error: ${response.status}`)}
            else{
                return response.json()
            }
        }).then((res) => {
            console.log(res)
        })
    }
    const handleRemoveKeyword = text =>{
        const arr = keyword;
        arr.splice(keyword.indexOf(text),1)
        setkeyword([...arr]);
        console.log(keyword);
        fetch(`${url.url}/a?keywords=${text}&remove=true`,{
            mode: 'cors'
        }).then(response => {
            if (!response.ok){
            throw new Error(`HTTP error: ${response.status}`)}
            else{
                return response.json()
            }
        }).then((res) => {
            console.log(res)
        })
    }

    return (<>
                <div className={`addkeywords ${isMobile ? 'mobile' : ''}`}>
                    <button className='addkeywordsbtn' onClick={() => setIsOpen(!isOpen)}>+ keywords</button>
                </div>
                <div className={`backdrop${isOpen ? ' show' : ''}`}>
                    <div className = {`popup${isOpen ? ` show${noscroll()}` : `${disablenoscroll()}`}`}>
                        <div className='popuptitle'>ADD KEYWORDS</div>
                        <div className='closebutton' onClick={()=>setIsOpen(!isOpen)}>X</div>
                        <div className = 'popupoptionslist'>
                            <input type= "text" className = 'option keywordinput' placeholder='Type Keyword'/>
                            <button className ='option addkeywordsbtn' onClick={() => handeAddKeyword(document.querySelector('.option.keywordinput').value)}>+</button>
                            <div className='block'>
                                {keyword.map(option => (
                                    <div
                                    key={option}
                                    className={`option pop`}
                                    
                                    >
                                        <div className='optionsname'>{option}</div>
                                        <button className ='deletebtn' onClick={()=>handleRemoveKeyword(option)}>DELETE</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
            );
}