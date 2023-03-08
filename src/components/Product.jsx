import React from "react";
import "../styles/product.css"       

const Products = ({productData}) => {
    console.log(productData);

    return (
        <div>
            {productData.map((product) => {
                return (
                    <div className="bags" key={product.id}>
                         <img className="image-send" data-url={product.custom_url.url} src={product.sku} style={{display: "none"}}/>
                    </div>
                )
            })}   
        </div>
    )
}

export default Products;