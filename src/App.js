import Amazon, { SelectedOptionsProvider } from './options'
import CenteredMenu from './centermenu';
import AddKeywords from './addKeywords';
import React from 'react';
import ReRunBtn from './rerun'
import Main from './main'
import ProductPage from './productpage/productpage';
import { NavLink, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import url from './url';

function App() {
  const [isVerified, setIsVerified] = useState(false);

  var requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'React POST Request Example' }),
    mode: "cors"
  };

  const checkPw = () => {
    // gets the current input value
    const answer = document.getElementById("pass").value;
    document.getElementById('pass').value = '';
    console.log(answer);
    console.log(url.url);
    requestOptions['body'] = JSON.stringify({password: answer})
    fetch(`${url.url}/`, requestOptions)
        .then(response => response.json())
        .then(data => 
          {
            console.log(data['response'] === 'success')
            if (data['response'] === 'success'){
              setIsVerified(true);
            }
          });

  };
  
  return (
    <>
  {isVerified ?
    (
      <SelectedOptionsProvider>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/products/*" element={<ProductPage/>} />
        </Routes>
      </SelectedOptionsProvider>
    ) :
    (
      <div>
       <input id="pass" name="pass" />
       <button onClick={checkPw}>open sesame</button>
      </div>
    )
  }
  </>
  )
}

export default App;
