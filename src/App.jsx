import React, { useState, useEffect } from 'react';
import axios from "axios";
import Scene from './components/Scene';
import "./styles/app.css";

import ModelScene from './components/ModelScene';

const App = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        axios.get("https://in5hxckmer2cr6gbvlb3qw7wnm0xsdjz.lambda-url.us-east-2.on.aws/").then((response) => {
            setProductData(response.data.data);
        }).catch((err) => {
            console.error(err);
        })
    }, []); 

    return (
        <> 
            <div id='restock-title'>
                <h1 style={{textTransform: "uppercase", fontWeight: "bold", textAlign: "center"}}>Bags will be restocked on March 8th</h1>
            </div>
            {/* <div id = "bags-canvas">
                <Scene productData={productData} />
            </div> */}
            <div id = "figure-canvas">
                <ModelScene />
            </div>
        </>

            
    )
}

export default App;