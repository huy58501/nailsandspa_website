import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import '@/src/styles/projects/NailsAndSpa/font-end/main.css';
import { ScrollTop } from 'primereact/scrolltop';
import { Image } from 'primereact/image';

export default function NailsAndSpa() {
    const introContainerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const aboutUsPhoto = useRef<HTMLDivElement>(null);
    const aboutUsRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const mapStyles = {
        height: "50vh",
        width: "70vw",
        margin: "auto"
    };

    const defaultCenter = {
        lat: 43.5930784,
        lng: -79.645066
    };

    const imageUrls = [
        "/images/projects/nailsandspa/spa-g-12.png",
        "/images/projects/nailsandspa/spa-g-11.png",
        "/images/projects/nailsandspa/spa-g-10.png",
        "/images/projects/nailsandspa/spa-g-9.png",
        "/images/projects/nailsandspa/spa-g-8.png",
        "/images/projects/nailsandspa/spa-g-7.png",
        "/images/projects/nailsandspa/spa-g-1.png",
        "/images/projects/nailsandspa/spa-g-2.png",
        "/images/projects/nailsandspa/spa-g-3.png",
        "/images/projects/nailsandspa/spa-g-4.png",
        "/images/projects/nailsandspa/spa-g-5.png",
        "/images/projects/nailsandspa/spa-g-6.png",
    ];

    const [startIndex, setStartIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState("");

    const showNext = () => {
        setAnimationClass('slide-left');
        setTimeout(() => {
            setStartIndex((prevIndex) => (prevIndex + 6) % imageUrls.length);
            setAnimationClass(''); // Reset animation class
        }, 500); // Wait for the sliding animation duration before changing images
    };

    const visibleImages = imageUrls.slice(startIndex, startIndex + 6);

    useEffect(() => {
        const interval = setInterval(showNext, 3000); // Change images every 3 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [startIndex]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const animatedPhoto = entry.target.querySelector('.animated-photo');
                        const animatedLeftHr = entry.target.querySelector('.line-left');
                        const animatedRightHr = entry.target.querySelector('.line-right');
                        if (animatedPhoto) {
                            animatedPhoto.classList.add('in-view');
                        }
                        if (animatedLeftHr) {
                            animatedLeftHr.classList.add('in-view');
                        }
                        if (animatedRightHr) {
                            animatedRightHr.classList.add('in-view');
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (aboutUsPhoto.current) observer.observe(aboutUsPhoto.current);
        if (aboutUsRef.current) observer.observe(aboutUsRef.current);
        if (servicesRef.current) observer.observe(servicesRef.current);
        if (galleryRef.current) observer.observe(galleryRef.current);
        if (locationRef.current) observer.observe(locationRef.current);

        return () => {
            if (aboutUsPhoto.current) observer.unobserve(aboutUsPhoto.current);
            if (aboutUsRef.current) observer.unobserve(aboutUsRef.current);
            if (servicesRef.current) observer.unobserve(servicesRef.current);
            if (galleryRef.current) observer.unobserve(galleryRef.current);
            if (locationRef.current) observer.unobserve(locationRef.current);
        };
    }, []);

    return (
        <div className="">
            {/* Banner */}
            <section className="image-container">
                <img src="/images/projects/nailsandspa/spa-1.png" alt="Responsive" className="responsive-image" />
                <a href='/projects/sweetienails/booking'><Button className="centered-button" label="Book Appointment" /></a>
            </section>

            {/* About Us */}
            <div ref={aboutUsRef} className="container">
                <hr className="line-left" />
                <h1>Who We Are</h1>
                <hr className="line-right" />
            </div>
            <section ref={aboutUsPhoto} className="intro-container">
                <div className="intro-content">
                    <img src="/images/projects/nailsandspa/spa-3.png" alt="Nail Salon" className="animated-photo" />
                    <div className="intro-text">
                    <h1>Welcome to NAILS & SPA</h1>
                    <p>Where elegance meets excellence. We offer a luxurious experience with a wide range of services, including manicures, pedicures, and custom nail art. Our skilled technicians are dedicated to providing the highest quality care in a relaxing and welcoming atmosphere. Treat yourself to the ultimate in nail care and leave feeling pampered and beautiful.</p>
                    <p>At our salon, we believe that nail care is an art form. Our talented team of technicians is trained in the latest techniques and trends, ensuring that you receive the most innovative and stylish nail treatments available. Whether you're looking for a classic French manicure, a bold and colorful design, or intricate nail art, we can create the perfect look for you.</p>                   
                    <p>Our goal is to provide you with an unparalleled level of service and a truly luxurious experience. We hope you'll leave our salon looking and feeling great, eagerly awaiting your next visit. Thank you for choosing us for your beauty needs – we look forward to serving you and helping you shine.</p>
                    </div>
                </div>
            </section>
            
            {/* Services */}
            <div ref={servicesRef} className="container">
                <hr className="line-left" />
                <h1>Our Services</h1>
                <hr className="line-right" />
            </div>
            <section className="services-section">
                <div className="service-container">
                    <div className="service-card">
                        <div className="service-card-front">
                            <a href="/projects/sweetienails/services-and-prices">
                                <img src="/images/projects/nailsandspa/spa-sv-1.png" alt="Manicure" className="service-image" />
                                <ul className="service-list">
                                    <li><strong>MANICURE</strong></li>
                                </ul>
                            </a>
                        </div>
                        <div className="service-card-back">
                            <p>Our manicure services are designed to pamper and perfect your hands.</p>
                            <p>Experience the best manicure services. Our manicures include nail shaping, cuticle care, hand massage, and your choice of polish.</p>
                            <a href="/projects/sweetienails/services-and-prices">See more...</a>
                        </div>
                    </div>
                </div>
                <div className="service-container">
                    <div className="service-card">
                        <div className="service-card-front">
                            <a href="/projects/sweetienails/services-and-prices">
                                <img src="/images/projects/nailsandspa/spa-sv-2.png" alt="Pedicure" className="service-image" />
                                <ul className="service-list">
                                    <li><strong>PEDICURE</strong></li>
                                </ul>
                            </a>
                        </div>
                        <div className="service-card-back">
                            <p>Indulge in our pedicure treatments that soothe and rejuvenate. Perfect for relieving foot fatigue and enhancing your overall comfort.</p>
                            <p>Relax with our luxurious pedicure treatments, featuring a soothing foot soak, exfoliation, and a relaxing foot massage.</p>
                            <a href="/projects/sweetienails/services-and-prices">See more...</a>
                        </div>
                    </div>
                </div>
                <div className="service-container">
                    <div className="service-card">
                        <div className="service-card-front">
                            <a href="/projects/sweetienails/services-and-prices">
                                <img src="/images/projects/nailsandspa/spa-sv-3.png" alt="Custom Nail Art" className="service-image" />
                                <ul className="service-list">
                                    <li><strong>CUSTOM NAIL ART</strong></li>
                                </ul>
                            </a>
                        </div>
                        <div className="service-card-back">
                            <p>Elevate your style with our custom nail art. Perfect for making a statement and showcasing your unique personality.</p>
                            <p>Get unique and creative nail art designs, tailored to your personal style. Perfect for special occasions or just for fun.</p>
                            <a href="/projects/sweetienails/services-and-prices">See more...</a>
                        </div>
                    </div>
                </div>
                <div className="service-container">
                    <div className="service-card">
                        <div className="service-card-front">
                            <a href="/projects/sweetienails/services-and-prices">
                                <img src="/images/projects/nailsandspa/spa-sv-4.png" alt="Waxing" className="service-image" />
                                <ul className="service-list">
                                    <li><strong>WAXING</strong></li>
                                </ul>
                            </a>
                        </div>
                        <div className="service-card-back">
                            <p>Enjoy smooth and silky skin with our waxing services, designed to be gentle yet effective for long-lasting results.</p>
                            <p>Smooth and gentle waxing services, ensuring your skin feels silky smooth and hair-free for weeks.</p>
                            <a href="/projects/sweetienails/services-and-prices">See more...</a>
                        </div>
                    </div>
                </div>
                <div className="service-container">
                    <div className="service-card">
                        <div className="service-card-front">
                            <a href="/projects/sweetienails/services-and-prices">
                                <img src="/images/projects/nailsandspa/spa-sv-5.png" alt="Massage" className="service-image" />
                                <ul className="service-list">
                                    <li><strong>MASSAGE</strong></li>
                                </ul>
                            </a>
                        </div>
                        <div className="service-card-back">
                            <p>Rejuvenate your body and mind with our massage therapies. Perfect for relieving stress and enhancing your relaxation.</p>
                            <p>Relax and unwind with our massage therapies, designed to relieve stress and improve your overall well-being.</p>
                            <a href="/projects/sweetienails/services-and-prices">See more...</a>
                        </div>
                    </div>
                </div>
                <div className="service-container">
                    <div className="service-card">
                        <div className="service-card-front">
                            <a href="/projects/sweetienails/services-and-prices">
                                <img src="/images/projects/nailsandspa/spa-sv-6.png" alt="Eyelash" className="service-image" />
                                <ul className="service-list">
                                    <li><strong>EYELASH</strong></li>
                                </ul>
                            </a>
                        </div>
                        <div className="service-card-back">
                            <p>Enhance your natural beauty with our eyelash services, designed to give you longer, fuller lashes with a touch of glamour.</p>
                            <a href="/projects/sweetienails/services-and-prices">See more...</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <div className="container">
                <hr className="line-left" />
                <h1>Our Gallery</h1>
                <hr className="line-right" />
            </div>
            <div className={`card carousel-container ${animationClass}`}>
                <div className="image-grid">
                    {visibleImages.map((url, index) => (
                        <Image key={index} src={url} alt={`Image ${startIndex + index + 1}`} preview />
                    ))}
                </div>
            </div>
            <div ref={locationRef} className="container">
                <hr className="line-left" />
                <h1>Our Location</h1>
                <hr className="line-right" />
            </div>
            <div id="Contact" className="location-container">
                <div className="address">
                    <h2>NAILS & SPA</h2>
                    <p>100 city center drive, Mississauga, ON, CANADA</p>
                </div>
                <iframe
                    title="Shop Map"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2889.646529069926!2d-79.64506602362249!3d43.59307837110503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b472ecbf930ef%3A0xd8fb6ae7a3676140!2s100%20City%20Centre%20Dr%2C%20Mississauga%2C%20ON%20L5B%202C9%2C%20Canada!5e0!3m2!1sen!2sus!4v1717109675582!5m2!1sen!2sus`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="map-iframe"
                />
            </div>
            <ScrollTop />
            <footer>
                <span>© 2023. All rights reserved by Tony Nguyen</span>
            </footer>
        </div>
    );
}
