import { createBrowserRouter } from "react-router-dom";
import ProductlistPage from "./pages/ProductlistPage/ProductlistPage";
import Bazaar from "./Bazaar";
import BazaarApplicationWrapper from "./pages/BazaarApplicationWrapper"

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
      ]
    }
  ]);
