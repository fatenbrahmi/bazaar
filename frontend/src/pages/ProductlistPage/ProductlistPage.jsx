import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FilterIcon from "../../components/common/FilterIcon";
import Categories from "../../components/Filters/Categories";
import PriceFilter from "../../components/Filters/PriceFilter";
import ColorsFilter from "../../components/Filters/ColorsFilter";
import SizeFilter from "../../components/Filters/SizeFilter";
import ProductCard from './ProductCard';

import { getAllProducts } from '../../api/fetchProducts';
import { fetchCategories } from '../../store/features/category';
import { setLoading } from '../../store/features/common';

const ProductlistPage = () => {
  const dispatch = useDispatch();
  const { categoryType } = useParams();
  const { categories } = useSelector((state) => state.categoryState);

  const [products, setProducts] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
const [availableSizes, setAvailableSizes] = useState([]);
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const category = useMemo(() => {
    return categories?.find((cat) => cat.code.toLowerCase() === categoryType?.toLowerCase());
  }, [categories, categoryType]);

useEffect(() => {
  const fetchProducts = async () => {
    if (category) {
      dispatch(setLoading(true));
      const res = await getAllProducts(category.id, null, selectedColors, selectedSizes);
      setProducts(res);

      // Extraction dynamique des couleurs et tailles
      const allColors = new Set();
      const allSizes = new Set();

      res.forEach(product => {
        product.variants?.forEach(variant => {
          if (variant.color) allColors.add(variant.color);
          if (variant.size) allSizes.add(variant.size);
        });
      });

      setAvailableColors([...allColors]);
      setAvailableSizes([...allSizes]);

      dispatch(setLoading(false));
    }
  };
  fetchProducts();
}, [category, selectedColors, selectedSizes, dispatch]);



  return (
    <div className='flex'>
      {/* Filtres */}
      <div className='w-[20%] p-[10px] border rounded-lg m-[20px]'>
        <div className='flex justify-between'>
          <p className='text-[16px] text-gray-600'>Filter</p>
          <FilterIcon />
        </div>

        <div>
          <p className='text-[16px] text-black mt-5'>Categories</p>
          <Categories types={category?.categoryTypes} />
          <hr />
        </div>

        <PriceFilter />
        <ColorsFilter
  colors={availableColors}
  appliedColors={selectedColors}
  setAppliedColors={setSelectedColors}
/>

      <SizeFilter
  sizes={availableSizes}
  appliedSizes={selectedSizes}
  setAppliedSizes={setSelectedSizes}
/>
      </div>

      {/* Liste de produits */}
      <div className='p-[15px]'>
        <p className='text-black text-lg'>{category?.description}</p>
        <div className='pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2'>
          {products?.map((item, index) => (
            <ProductCard key={item?.id + "_" + index} {...item} title={item?.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductlistPage;
