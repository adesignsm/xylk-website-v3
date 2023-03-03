import React from "react";
import axios from "axios";
import { createRoot } from 'react-dom/client';

import App from "../src/App"

const BIGCOMMERCE_KEY = process.env.REACT_APP_BIGCOMMERCE_SECRET;
const BIGCOMMERCE_ID = process.env.REACT_APP_BIGCOMMERCE_ID;
const BIGCOMMERCE_TOKEN = process.env.REACT_APP_BIGCOMMERCE_TOKEN;
const BIGCOMMERCE_HASH = process.env.REACT_APP_BIGCOMMERCE_HASH;

const options = {
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    'X-Auth-Token': '346r9xuftwqs0ettx51bqe4h8ktjmx9'
  }
};

axios.get("https://api.bigcommerce.com/stores/n82ib26bvw/v3/catalog/products", options).then((response) => {
  response.json()
}).then((response) => {
  console.log(response);
}).catch((err) => {
  console.error(err);
})

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <App />
)
