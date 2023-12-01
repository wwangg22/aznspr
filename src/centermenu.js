import React, {useContext, useEffect, useState} from 'react';
import './centeredmenu.css';
import { SelectedOptionsContext } from './options';
import { NavLink } from 'react-router-dom';
import url from './url';
import { isMobile } from './ismobile';
import Summary from './summary';



export default function CenteredMenu() {

    const { selectedOptions, setSelectedOptions, keyword, setkeyword } = useContext(SelectedOptionsContext);
    const [data, setData] = useState([]);
    const [wordc, setWordc] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const boxTexts = selectedOptions;
    useEffect(()=>{
        async function getOptions(){
            for (const b of boxTexts){
                if (localStorage.getItem(b.split(" ").join("") !== null)){
                    console.log('used local storage!')
                    setData(prev => {
                        return [...prev, ...localStorage];
                    });
                }
                else{
                    fetch(`${url.url}/${b.split(' ').join('')}`,{
                    mode: 'cors'
                    }).then(response => {
                    if (!response.ok){
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    else{
                        return response.json()
                    }
                    }).then((ans) => {
                        const wc = ans[1];
                        const res = ans[0];
                        console.log(wc);
                    setWordc(wc);
                    const newArray = {};
                    for (const b of Object.keys(res)) {
                        newArray[b] = res[b];
                    };
                    console.log(Object.values(res)[0]);
                        setData(prev => {//console.log([...prev,...Object.values(res)]);
                            localStorage.setItem(b.replace(' ',''), JSON.stringify(Object.values(res)));
                            return [...prev,...Object.values(res)]});
                
                    }).catch((err) => console.error(`Fetch problem: ${err.message}`));
                }
                
            }}
            setData([]);
            getOptions();
    }, [boxTexts])

    const handleBoxClick = (text) => {
        console.log("Box with text", text, "was clicked!");
    };

    return (
        <div className="centered-wrapper">
            <input
                className = 'searchbox'
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Summary
                wordCount = {wordc}
            />
            <div className="centered-menu">
                {data.filter(item => 
                    item.dataasin.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                    
                    <NavLink className= 'navlink' to = {`/products/${item.dataasin}`}>
                        <div className="menu-box" onClick={() => handleBoxClick(item.dataasin)}>
                        <div className="menu-title">{item.dataasin}</div>
                        {[isMobile ? item.name.slice(0,30) : item.name.slice(0,70), item.price, item.numreviews].map((desc, idx) => (
                            <div key={idx} className="menu-description">{desc}</div>
                        ))}
                        </div>
                    </NavLink>
                ))
            }
            </div>
        </div>
      );
      
}
