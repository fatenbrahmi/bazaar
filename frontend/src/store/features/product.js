import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  products: [],
  filteredProducts: [],
};

const productSlice = createSlice({
    name:'productState',
    initialState:initialState,
    reducers:{
        addProduct:(state,action) =>{
            state.products.push(action?.payload)
            return state;
        },
        loadProducts:(state,action)=>{
            return {
                ...state,
                products: action?.payload
            }
        }
    }
})

export const { addProduct, loadProducts } = productSlice?.actions;
export default productSlice.reducer;