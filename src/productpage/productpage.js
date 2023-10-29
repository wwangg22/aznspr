import './productpage.css';
import React, { useEffect } from 'react';
import Dropdown from './dropdown';
import { useState } from 'react';
import ProductInfo from './productinfo';
import { useLocation } from 'react-router-dom';
import TopLevelMenu from './toplevelmenu';
import url from '../url';

export default function ProductPage() {
    const [dates, setdates] = useState([])
    const [description, setdescription] = useState([])
    const [selecteddesc, setselecteddesc] = useState()
    const location = useLocation();
    console.log(location);
    const dataasin = location.pathname.split("/")[2];
    console.log(dataasin);
    useEffect(()=>{
        fetch(`${url.url}/?search=${dataasin}`,{
            mode: 'cors'
            }).then(response => {
            if (!response.ok){
                console.log('bitch');
                throw new Error(`HTTP error: ${response.status}`);
            }
            else{
                console.log(response);
                return response.json()
            }
            }).then((res) => {console.log(res);
                for (const b of Object.keys(res)){
                    console.log(b);
                    setdates(prev => [...prev, new Date(res[b]['created']).toLocaleString()]);
                    setdescription(prev => [...prev, res[b]]);
                }
            })
    },[location])

    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        if (description){
            console.log(description)
            for (const a of description){
                if (new Date(a['created']).toLocaleString() == event.target.value){
                    console.log(typeof(a['specs']))
                    console.log(a['specs'])
                    console.log(Object.keys(a['specs']))
                    setselecteddesc(a);

                }
            }
        }
        setSelectedDate(event.target.value);


    }

    return (
        <div>
            <TopLevelMenu/>
            <Dropdown dates={dates} onChange={handleDateChange} />
            {selectedDate && <p>You selected: {selectedDate}</p>}
            <ProductInfo
                title={`${selecteddesc ? selecteddesc['name'] : 'Sample Product'}`}
                price={`${selecteddesc ? selecteddesc['price'] : '0.00'}`}
                reviews={[
                    { author: "John", comment: "Great product!" },
                    { author: "Jane", comment: "Loved it." }
                ]}
                description={`${selecteddesc ? selecteddesc['descriptions']  : 'Sample description'}`}
                features = {`${selecteddesc ? selecteddesc['features'] : 'Sample features'}`}
                averageRating = {`${selecteddesc ? selecteddesc['review'] : '0.00'}`}
                reviewCount = {`${selecteddesc ? selecteddesc['numreview'] : '0'}`}
                href={`${selecteddesc ? selecteddesc['href'] : 'https://www.amazon.com'}`}
                details={selecteddesc ? selecteddesc['specs'] : {'testing': 'test'}}
            />
        </div>
    );
}
