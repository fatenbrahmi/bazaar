
import './Bazaar.css';

import HeroSection from './components/HeroSection/HeroSection';
import NewArrivals from './components/Sections/NewArrivals';
import Category from './components/Sections/Categories/Category'
import content from './data/content.json';
import Footer from './components/Footer/Footer';




function Bazaar() {
  return (
    <div className="Bazaar ">
   
     <HeroSection/>
     <NewArrivals/>
     {content?.pages?.shop?.sections && content?.pages?.shop?.sections?.map((item, index) => <Category key={item?.title+index} {...item} />)}
    <Footer content={content?.footer} />
    </div>
  );
}

export default Bazaar;
