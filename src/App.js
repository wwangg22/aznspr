import Amazon, { SelectedOptionsProvider } from './options'
import CenteredMenu from './centermenu';
import AddKeywords from './addKeywords';
import React from 'react';
import ReRunBtn from './rerun'
import Main from './main'
import ProductPage from './productpage/productpage';
import { NavLink, Routes, Route } from 'react-router-dom';

function App() {
  
  return (
    <SelectedOptionsProvider>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/products/*" element={<ProductPage/>} />
      </Routes>
    </SelectedOptionsProvider>
  );
}

export default App;
