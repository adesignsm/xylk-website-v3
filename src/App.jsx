import React, { useState, useEffect } from 'react';
import $ from "jquery";
import axios from "axios";
import "./styles/app.css";

import Scene from './components/Scene';
import ShopifyScene from "./components/Shopify/ShopifyScene";
import ModelScene from './components/ModelScene';

import GREENHILL_BUTTON from "./media/greenhill.png";
import EXPENSIVE_BUTTON from "./media/expensive.png";

import Client from "shopify-buy";

const client = Client.buildClient({
    domain: "grocerybagsbyxylk.myshopify.com",
    storefrontAccessToken: "3895fb433bae31ded42f6816a2e086a3"
});

const App = () => {
    const [productData, setProductData] = useState([]);
    const [shopifyProductData, setShopifyProductData] = useState([]);

    useEffect(() => {
        $("body, html").animate({scrollLeft: $("#bags-canvas-shopify").css("left")}, 0);
    }, []);

    useEffect(() => {
        const collectionId = "gid://shopify/Collection/445732815150";

        client.collection.fetchAllWithProducts(collectionId).then((collections) => {
            collections.forEach((collection) => {
                if (collection.id === collectionId) {
                    setShopifyProductData(collection.attrs.products);
                }
            })
        });
    }, []);

    useEffect(() => {
        const collectionId = "gid://shopify/Collection/449198522670";

        client.collection.fetchAllWithProducts(collectionId).then((collections) => {
            collections.forEach((collection) => {
                if (collection.id === collectionId) {
                    setProductData(collection.attrs.products);
                }
            })
        });
    }, []);

    //bigcommerce
    // useEffect(() => {
    //     axios.get("https://in5hxckmer2cr6gbvlb3qw7wnm0xsdjz.lambda-url.us-east-2.on.aws/").then((response) => {
    //         setProductData(response.data.data);
    //     }).catch((err) => {
    //         console.error(err);
    //     })
    // }, []); 

    const handleGreenHillButton = () => {
        $("body, html").animate({scrollLeft: $("#bags-canvas-shopify").css("left")}, 800);
    }

    const handleExpensiveBagsButton = () => {
        $("body, html").animate({scrollLeft: $("#bags-canvas").css("left")}, 800);
    }

    return (
        <> 
            <div>
                <div id = "bags-canvas">
                    <Scene productData={productData} />
                </div>
                <div id="bags-canvas-shopify">
                    <ShopifyScene shopifyProductData={shopifyProductData} />
                </div>
                <div id = "figure-canvas"></div>
                <ModelScene />
            </div>
            <div id="button-navigation-container">
                <button id="expensive-grocery-bags-button" onClick={handleExpensiveBagsButton}>
                    <img src={EXPENSIVE_BUTTON} />
                </button>
                <button id="greenhill-collection-button" onClick={handleGreenHillButton}>
                    <img src={GREENHILL_BUTTON} />
                </button>
            </div>
        </>
    )
}

export default App;