import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import "bulma/css/bulma.css";
import axios from "axios";
import { BrowserRouter } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from "./util/accessToken";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

