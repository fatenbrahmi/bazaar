import React from 'react'
import SectionHeading from './SectionsHeading/SectionHeading';
import Card from '../Card/Card';
import Jeans from '../../assets/images/jeans.jpg'
import Shirts from '../../assets/images/shirts.jpg'
import Tshirt from '../../assets/images/tshirts.jpeg'
import dresses from '../../assets/images/dresses.jpg'
import Carousel from 'react-multi-carousel';
import { responsive } from '../../utils/Section.constants';
import './NewArrivals.css';

const items = [{
    'title':'Jeans',
    imagePath:Jeans
},{
    'title':'Shirts',
    imagePath:Shirts
},{
    'title':'T-Shirts',
    imagePath:Tshirt
},{
    'title':'Dresses',
    imagePath:dresses
},
{
    'title':'Joggers',
    imagePath:require('../../assets/images/joggers.jpg')
},
{
    'title':'Kurtis',
    imagePath:require('../../assets/images/kurtis.jpg')
}];

const NewArrivals = () => {
  return (
    <>
    <SectionHeading title={'New Arrivals'}/>
    <Carousel
        responsive={responsive}
        autoPlay={false}
        swipeable={true}
        draggable={false}
        showDots={false}
        infinite={false}
        partialVisible={false}
        itemClass={'react-slider-custom-item'}
        className='px-8'
      >
        {items && items?.map((item,index)=> <Card key={item?.title +index} title={item.title} imagePath={item.imagePath}/>)}

      </Carousel>
    </>
  )
}

export default NewArrivals;