import { useEffect } from 'react';
import Head from 'next/head';
import '@/src/styles/projects/NailsAndSpa/font-end/service.css';
import MenuBar from '@/src/components/projects/NailsAndSpa/front-end/menuBar';

const servicesData = [
  { 
    id: 1, 
    title: 'Spa Treatments', 
    image: '/images/projects/nailsandspa/spa-sv-1.png', 
    services: [
      'Swedish Massage - $100', 
      'Deep Tissue Massage - $200'
    ] 
  },
  { 
    id: 2, 
    title: 'Manicure & Pedicure', 
    image: '/images/projects/nailsandspa/spa-sv-2.png', 
    services: [
      'Classic Manicure - $50', 
      'Deluxe Pedicure - $75'
    ] 
  },
  { 
    id: 3, 
    title: 'Massage Therapy', 
    image: '/images/projects/nailsandspa/spa-sv-3.png', 
    services: [
      'Hot Stone Massage - $150', 
      'Aromatherapy Massage - $180'
    ] 
  },
];

const Services: React.FC = () => {
  useEffect(() => {
    servicesData.forEach((_, index) => {
      const photo = document.getElementById(`photo-${index}`);
      const services = document.getElementById(`services-${index}`);

      if (photo) {
        setTimeout(() => {
          photo.style.transform = 'translateX(0)'; // Move the photo to its original position
        }, 100 * index); // Add a delay for each item for sequential animation
      }
      if (services) {
        setTimeout(() => {
          services.style.transform = 'translateX(0)'; // Move the services list to its original position
        }, 100 * index); // Add a delay for each item for sequential animation
      }
    });
  }, []);

  return (
    <>
      <MenuBar />
      <div className="container-servicePage">
        {servicesData.map((item, index) => (
          <div className="item" key={item.id}>
            <div id={`photo-${index}`} className="photo">
              <img src={item.image} alt={`Service ${item.id}`} />
            </div>
            <div id={`services-${index}`} className="services">
              <h1>{item.title}</h1>
              <ul>
                {item.services.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <footer>
        <span>© 2023. All rights reserved by Tony Nguyen</span>
      </footer>
    </>
  );
};

export default Services;
