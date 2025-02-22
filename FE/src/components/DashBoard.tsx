import { useEffect, useState } from "react";
import Footer from "./Footer";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

function DashBoard() {
    const slides = [
        {
            image: "",
            title: ""
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
        <div className="min-h-screen bg-white">
            {/* Header part */}
            <header>
                <div className="flex justify-between items-center border-b-2 border-red-500 bg-red-500 px-4 py-1">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <Globe size={14}/>
                        <button className="cursor-pointer">
                            Hindi
                        </button>
                    </div>
                    <div className="">
                        <button className="cursor-pointer">
                        <Link to="/auth">    Register/Login</Link>
                        </button>
                    </div>
                </div>
            </header>
            
            
            <div className="container mx-auto my-5 p-5 bg-gray-100 rounded shadow-lg">
                <h3 className="mt-4 text-lg font-semibold">Contact Information</h3>
                <p>Address: XYZ Road</p>
                <p>Phone: 123</p>
                <p>Email: contact@</p>
            </div>
            <Footer/>
        </div>
    );
};


export default DashBoard;