import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant"


export const getAllProducts = async (categoryId, typeId, colors = [], sizes = []) => {
  let url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?categoryId=${categoryId}`;

  if (typeId) {
    url += `&typeId=${typeId}`;
  }

  // Ajouter les filtres colors (chaque couleur en paramètre colors=White&colors=Black)
  if (colors.length > 0) {
    colors.forEach(color => {
      url += `&colors=${encodeURIComponent(color)}`;
    });
  }

  // Ajouter les filtres sizes
  if (sizes.length > 0) {
    sizes.forEach(size => {
      url += `&sizes=${encodeURIComponent(size)}`;
    });
  }

  try {
    const result = await axios.get(url);
    return result?.data;
  } catch (err) {
    console.error(err);
  }
};


export const getProductBySlug = async (slug)=>{
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
    try{
        const result = await axios(url,{
            method:"GET",
        });
        return result?.data?.[0];
    }
    catch(err){
        console.error(err);
    }
}
export const getSimilarProducts = async (categoryId, typeId, excludeProductId) => {
  try {
    const url = `${API_BASE_URL}${API_URLS.GET_PRODUCTS}?categoryId=${categoryId}&typeId=${typeId}`;
    const response = await axios.get(url);
    
    return response.data.filter(product => product.id !== excludeProductId);
  } catch (err) {
    console.error(err);
    return [];
  }
}