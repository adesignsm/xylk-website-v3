import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import "./styles/app.css";

import ModelScene from './components/ModelScene';

const App = ({client}) => {
    console.log(client);
    const [productData, setProductData] = useState([]);

    useEffect(() => {

    }, []); 

    return (
        <>
            <div id = "bags-canvas">
                <Scene productData={productData}/>
            </div>
            
            <div id = "figure-canvas">
                <ModelScene />
            </div>
        </>

            
    )
}

export default App;