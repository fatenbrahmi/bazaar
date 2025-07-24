import React, { useMemo, useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import content from '../../data/content.json';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Rating from '../../components/Rating/Rating';
import SizeFilter from '../../components/Filters/SizeFilter';
import ProductColors from './ProductColors';
import { CartIcon } from '../../components/common/CartIcon';
import SvgCreditCard from '../../components/common/SvgCreditCard ';
import SvgCloth from '../../components/common/SvgCloth';
import SvgShipping from '../../components/common/SvgShipping ';
import SvgReturn from '../../components/common/SvgReturn';
import SectionHeading from '../../components/Sections/SectionsHeading/SectionHeading';
import ProductCard from '../../pages/ProductlistPage/ProductCard'; // ✅ ajouté

const categories = content?.categories;

const extraSections = [
  { icon: <SvgCreditCard />, label: 'Secure payment' },
  { icon: <SvgCloth />, label: 'Size & Fit' },
  { icon: <SvgShipping />, label: 'Free shipping' },
  { icon: <SvgReturn />, label: 'Free Shipping & Returns' }
];

const ProductDetails = () => {
  const product = useLoaderData();

  const [image, setImage] = useState(
    product?.images?.[0]?.startsWith('http') ? product?.images[0] : product?.thumbnail
  );

  const [breadCrumbLinks, setBreadCrumbLink] = useState([{ title: 'Shop', path: '/' }]);
  const [similarProduct, setSimilarProduct] = useState([]); // ✅ Ajouté



  const similarProducts =useMemo(()=>{
    return content?.products?.filter((item)=> item?.type_id === product?.type_id && item?.id!==product?.id )
  },[product])





  const productCategory = useMemo(() => {
    return categories?.find((category) => category?.id === product?.category_id);
  }, [product]);

  useEffect(() => {
    const arrayLinks = [{ title: 'Shop', path: '/' }];
    if (productCategory) {
      arrayLinks.push({
        title: productCategory.name,
        path: productCategory?.path
      });

      const productType = productCategory?.types?.find(
        (item) => item?.type_id === product?.type_id
      );

      if (productType) {
        arrayLinks.push({
          title: productType?.name,
          path: productType?.name
        });
      }
    }
    setBreadCrumbLink(arrayLinks);
  }, [productCategory, product]);

  return (
    <div>
      <div className='flex flex-col md:flex-row px-10'>
        <div className='w-[100%] lg:w-[50%] md:w-[40%]'>
          <div className='flex flex-col md:flex-row'>
            <div className='w-[100%] md:w-[20%] justify-center h-[40px] md:h-[420px]'>
              <div className='flex flex-row md:flex-col justify-center h-full'>
                {product?.images?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(item)}
                    className='rounded-lg w-fit p-2 mb-2'
                  >
                    <img
                      src={item}
                      className='h-[60px] w-[60px] rounded-lg bg-cover bg-center hover:scale-105 hover:border'
                      alt={'sample-' + index}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className='w-full md:w-[80%] flex justify-center md:pt-0 pt-10'>
              <img
                src={image}
                className='h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-cover'
                alt={product?.name}
              />
            </div>
          </div>
        </div>

        <div className='w-[60%] px-10'>
          <Breadcrumb links={breadCrumbLinks} />
          <p className='text-3xl pt-4'>{product?.title}</p>
          <Rating rating={product?.rating} />
          <p className='text-xl font-bold py-2'>${product?.price}</p>

          <div className='flex flex-col py-2'>
            <div className='flex gap-2'>
              <p className='text-sm font-bold'>Select Size</p>
              <Link
                className='text-sm text-gray-500 hover:text-gray-900'
                to='https://en.wikipedia.org/wiki/Clothing_sizes'
                target='_blank'
              >
                {'Size Guide ->'}
              </Link>
            </div>
          </div>

          <div className='mt-2'>
            <SizeFilter sizes={product?.size} hideTitle />
          </div>

          <div>
            <p className='text-lg font-bold'>Colors Available</p>
            <ProductColors colors={product?.color} />
          </div>

          <div className='flex py-4'>
            <button className='bg-black rounded-lg w-[150px]'>
              <div className='flex items-center bg-black text-white'>
                <CartIcon bgColor='black' />
                Add to Cart
              </div>
            </button>
          </div>

          <div className='grid md:grid-cols-2 gap-4 pt-4'>
            {extraSections?.map((section, index) => (
              <div key={index} className='flex items-center'>
                {section?.icon}
                <p className='px-2'>{section?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Description */}
      <SectionHeading title='Product Description' />
      <div className='md:w-[50%] w-full p-2'>
        <p className='px-8'>{product?.description}</p>
      </div>

      {/* Similar Products */}
      <SectionHeading title='Similar Products' />
      <div className='flex px-10'>

      
      <div className='pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 px-2 pb-10'>
        {similarProducts?.map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
         {!similarProduct?.length && <p>No Products Found!</p>}
       </div>
      </div>
    </div>
  );
};

export default ProductDetails;
