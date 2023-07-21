import React from "react";
import "../styles/product.css"       

const Products = ({productData}) => {
    return (
        <div>
            {productData.map((product) => {
                return (
                    <div className="bags" key={product.id}>
                         <img className="image-send" data-url={product.onlineStoreUrl} src={product.images[0].src} style={{display: "none"}}/>
                    </div>
                )
            })}   
        </div>
    )
}

export default Products;