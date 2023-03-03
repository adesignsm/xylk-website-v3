import React, {useState} from "react";
import axios from "axios";
import { createRoot } from 'react-dom/client';
// import data from "./data/response.json";

import App from "../src/App"

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <App />
)
