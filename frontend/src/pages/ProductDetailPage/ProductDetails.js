import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductBySlug ,getSimilarProducts } from '../../api/fetchProducts';
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
import ProductCard from '../../pages/ProductlistPage/ProductCard';

const extraSections = [
  { icon: <SvgCreditCard />, label: 'Secure payment' },
  { icon: <SvgCloth />, label: 'Size & Fit' },
  { icon: <SvgShipping />, label: 'Free shipping' },
  { icon: <SvgReturn />, label: 'Free Shipping & Returns' }
];

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');
  const [breadCrumbLinks, setBreadCrumbLink] = useState([{ title: 'Shop', path: '/' }]);
  const [similarProducts, setSimilarProducts] = useState([]);
 const [selectedSizes, setSelectedSizes] = useState([]); 

 useEffect(() => {
    const fetchProductAndSimilar = async () => {
      try {
        // Chargement du produit principal
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        
        // Chargement des produits similaires
        if (productData?.categoryId && productData?.typeId) {
          const similar = await getSimilarProducts(
            productData.categoryId, 
            productData.typeId,
            productData.id // Exclure le produit actuel
          );
          setSimilarProducts(similar);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
  }, [slug]);




  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductBySlug(slug);
        
        if (!productData) {
          throw new Error('Product not found');
        }

        setProduct(productData);
        setImage(productData.thumbnail);
        setSimilarProducts([]); // À remplacer par un appel API pour les produits similaires
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      const arrayLinks = [{ title: 'Shop', path: '/' }];
      
      if (product.categoryName) {
        arrayLinks.push({
          title: product.categoryName,
          path: `/category/${product.categoryId}`
        });
      }

      if (product.categoryTypeName) {
        arrayLinks.push({
          title: product.categoryTypeName,
          path: `/category/${product.categoryId}/type/${product.categoryTypeId}`
        });
      }

      setBreadCrumbLink(arrayLinks);
    }
  }, [product]);


  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // Formatage des données pour correspondre à votre interface
  const productData = {
    ...product,
    title: product.name,
    images: product.productResources?.map(res => res.url) || [product.thumbnail],
    size: [...new Set(product.variants?.map(v => v.size))] || [],
    color: [...new Set(product.variants?.map(v => v.color))] || []
  };

  return (
    <div>
      <div className='flex flex-col md:flex-row px-10'>
        {/* Section Images */}
        <div className='w-full lg:w-[50%] md:w-[40%]'>
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-[20%] justify-center h-[40px] md:h-[420px]'>
              <div className='flex flex-row md:flex-col justify-center h-full'>
                {productData.images?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(item)}
                    className='rounded-lg w-fit p-2 mb-2'
                  >
                    <img
                      src={item}
                      className='h-[60px] w-[60px] rounded-lg bg-cover bg-center hover:scale-105 hover:border'
                      alt={`product-${index}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className='w-full md:w-[80%] flex justify-center md:pt-0 pt-10'>
              <img
                src={image}
                className='h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-cover'
                alt={productData.name}
              />
            </div>
          </div>
        </div>

        {/* Section Informations */}
        <div className='w-full md:w-[60%] px-10'>
          <Breadcrumb links={breadCrumbLinks} />
          <p className='text-3xl pt-4'>{productData.title}</p>
          <Rating rating={productData.rating} />
          <p className='text-xl font-bold py-2'>${productData.price}</p>

          <div className='flex flex-col py-2'>
            <div className='flex gap-2'>
              <p className='text-sm font-bold'>Select Size</p>
              <Link
                className='text-sm text-gray-500 hover:text-gray-900'
                to='https://en.wikipedia.org/wiki/Clothing_sizes'
                target='_blank'
              >
                Size Guide →
              </Link>
            </div>
          </div>
          <div className='mt-2'>
             <SizeFilter 
              sizes={productData.size || []} 
              appliedSizes={selectedSizes}
              setAppliedSizes={setSelectedSizes}
              hideTitle
             />
          </div>

          <div>
            <p className='text-lg font-bold'>Colors Available</p>
            <ProductColors colors={productData.color} />
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
            {extraSections.map((section, index) => (
              <div key={index} className='flex items-center'>
                {section.icon}
                <p className='px-2'>{section.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description du produit */}
      <SectionHeading title='Product Description' />
      <div className='md:w-[50%] w-full p-2'>
        <p className='px-8'>{productData.description}</p>
      </div>

      {/* Produits similaires */}
      {/* Produits similaires */}
<SectionHeading title='Similar Products' />
<div className='flex px-10'>
  <div className='pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 px-2 pb-10'>
    {similarProducts.length > 0 ? (
      similarProducts.slice(0, 4).map((item) => ( // Limitez à 4 produits max
        <ProductCard 
          key={item.id} // Utilisez item.id plutôt que l'index
          {...item}
          slug={item.slug || item.id} // Garantissez un slug valide
        />
      ))
    ) : (
      <div className="col-span-full text-center py-10">
        <p className="text-gray-500">No similar products found</p>
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default ProductDetails;