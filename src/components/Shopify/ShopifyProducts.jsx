import React from "react";
import "../../styles/shopify-product.css"   

const ShopifyProducts = ({productData}) => {
    return (
        <div> 
            {productData.map((product) => {
                return (
                    <div className="bags-shopify" key={product.id}>
                        <img className="image-send" data-url={product.onlineStoreUrl} src={product.images[0].src} style={{display: "none"}}/>
                    </div>
                )
            })}   
        </div>
    )
}

export default ShopifyProducts;