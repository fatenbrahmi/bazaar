import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import './index.css';
import 'react-multi-carousel/lib/styles.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import Navigation from './components/Navigation/NavigationBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
    <RouterProvider router={router}>
        <Navigation/>
        
      
    </RouterProvider>
    </React.StrictMode>
   
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
