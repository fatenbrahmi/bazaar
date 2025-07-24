import { createBrowserRouter } from "react-router-dom";
import ProductlistPage from "./pages/ProductlistPage/ProductlistPage";
import Bazaar from "./Bazaar";
import BazaarApplicationWrapper from "./pages/BazaarApplicationWrapper";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails"
import { loadProductById } from './routes/products';





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
            path:"/women",
            element:<ProductlistPage categoryType={'WOMEN'}/>,
        },
        {
          path:"/men",
          element:<ProductlistPage categoryType={'MEN'}/>,
        },
         {
        path: "/product/:productId",
        element: <ProductDetails />,
        loader: ({ params }) => loadProductById(params),
        }
      ]
    }
  ]);
