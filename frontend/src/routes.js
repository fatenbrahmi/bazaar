import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import ProductlistPage from "./pages/ProductlistPage/ProductlistPage";
import Bazaar from "./Bazaar";
import BazaarApplicationWrapper from "./pages/BazaarApplicationWrapper";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails"

import AuthenticationWrapper from "./pages/AuthenticationWrapper";
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login"; // ← Laissez comme ça



export const router = createBrowserRouter([
    {
      path: "/",
      element: <BazaarApplicationWrapper />,
      children:[
        {
            path:"/",
            element:<Bazaar />
        },
       {
          path: "/:categoryType",
          element: <ProductlistPage />
        },
         {
          path: "/product/:slug",
          element: <ProductDetails />
        }
      ]
    },
    {
      path:"/v1/",
      element:<AuthenticationWrapper />,
      children:[
        {
          path:"login",
          element:<Login /> // ← Utilisez createElement
        },
        {
          path:"register",
          element:<Register />
        }
      ]
    },
  ]);