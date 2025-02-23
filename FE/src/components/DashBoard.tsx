import { useEffect, useState } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function DashBoard() {
    const slides = [
        {
            image: "http://redcross.mp.gov.in/uploads/slider/slider3.jpg",
            title: "Helping Those In Need",
        },
        {
            image: "http://redcross.mp.gov.in/uploads/slider/slider21.jpg",
            title: " Response",
        }
    ];
    const [currentSlide, setcurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setcurrentSlide((prev) => (prev+1)%slides.length);
        }, 5000);
        return () => clearInterval(timer);
    },[]);

    return(
        <div className="min-h-screen bg-white w-full">
            {/* Header part */}
            <header>
                <div className="flex justify-between items-center border-b-2 border-red-500 bg-red-500 px-4 py-1">
                    {/* <div className="flex items-center gap-1 cursor-pointer">
                        <Globe size={14}/>
                        <button className="cursor-pointer">
                            Hindi
                        </button>
                    </div> */}
                    <div className="flex items-center space-x-4 ">
                        <button className="cursor-pointer">
                        <Link to="/auth">    Register/Login</Link>
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Main part */}
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-red-600">
                                Red Cross
                            </span>
                        </div>
                        <div className="hidden md:flex space-x-6">
                            <a href="#" className="text-gray-700 hover:text-red-600">Home</a>
                            <a href="#" className="text-gray-700 hover:text-red-600">About Us</a>
                            <a href="#" className="text-gray-700 hover:text-red-600">Services</a>
                            <a href="#" className="text-gray-700 hover:text-red-600">Contact</a>
                        </div>
                        <button className="animate-pulse bg-red-600 text-white px-6 p-2 rounded-full hover:bg-teal-500 transition-all duration-500 cursor-pointer">
                            Donate
                        </button>
                    </div>
                </div>
            </nav>

            {/* Slideshow part */}
            <section className="relative h-[600px] overflow-hidden">
                <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div 
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000
                    ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute top-0 left-0 w-full h-full object-cover brightness-50">
                        </img>
                        
                        <div className="absolute inset-0 ">
                            <div className="container mx-auto px-4 h-full flex items-center">
                                <div className="max-w-2xl text-white drop-shadow-lg">
                                    <h1 className="text-5xl font-bold mb-6">{slide.title}</h1>
                                    {/* can add desciption */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                {/* slide indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {slides.map((_, index) => (
                        <button 
                        key={index}
                        onClick={() => setcurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                        />
                    ))}
                </div>
            </section>
            
            {/* <div className="container mx-auto my-5 p-5 bg-gray-100 rounded shadow-lg">
                <h3 className="mt-4 text-lg font-semibold">Contact Information</h3>
                <p>Address: XYZ Road</p>
                <p>Phone: 123</p>
                <p>Email: contact@</p>
            </div> */}
            <Footer/>
        </div>
    );
};


export default DashBoard;