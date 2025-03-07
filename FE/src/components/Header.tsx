import { Circle, CircleUserRound, Facebook, Twitter, Youtube } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { changeLanguage } from "../Utils/cartSlice";
import { RootState } from "../Utils/store";
import ProfileBar from "./ProfileBar";
import { useState } from "react";

function Header() {
   const [menuOpen, setMenuOpen] = useState(false);
   const [profileopen, setprofileopen] = useState(false);
   const userInfo = useSelector((store: RootState) => store.cart);
   const dispatch = useDispatch();
   const changeLang = () => {
      if (userInfo.language === "English") dispatch(changeLanguage("हिन्दी"));
      else dispatch(changeLanguage("English"));
   };

   return (
      <>
         <header>
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 sm:px-6 text-sm bg-red-600 py-2">
               <button className="cursor-pointer text-white font-semibold hover:underline" onClick={changeLang}>
                  {userInfo.language}
               </button>
               <div className="flex space-x-3 text-white">
                  <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
                  <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
                  <Youtube className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
               </div>
            </div>

            {/* Main Header */}
            <div className="flex flex-wrap justify-between items-center px-4 sm:px-8 md:px-16 py-3 bg-red-100 text-black ">
               {/* Logo */}
               <Link to="/" className="flex items-center gap-3">
                  <img className="h-14 sm:h-20 md:h-24" src="http://res.cloudinary.com/dz0sdsbfa/image/upload/v1740478249/u2eaqolxjdlpwk9kwqia.png" alt="Logo" />
                  <div>
                     <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Indian Red Cross Society</h1>
                     <p className="text-sm sm:text-lg text-gray-600">Chhindwara, Madhya Pradesh State Branch</p>
                  </div>
               </Link>

               {/* Buttons & Profile */}
               <div className="flex space-x-2 sm:space-x-4 items-center">
                  

                  {userInfo.username ? (
                     <button className="relative rounded-md flex gap-1 font-medium cursor-pointer" onClick={() => setprofileopen(true)}>
                        <Circle className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500" />
                        <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg sm:text-xl">
                           {userInfo.username.charAt(0).toUpperCase()}
                        </span>
                     </button>
                  ) : (
                     <Link to="/auth">
                        <button className="rounded-md flex items-center gap-1 font-medium cursor-pointer bg-red-200 px-3 py-1 hover:bg-blue-400 transition-all duration-300">
                           <CircleUserRound className="w-5 h-5" /> Register/Login
                        </button>
                     </Link>
                  )}
               </div>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-red-600 shadow-md">
   <div className="container mx-auto px-4 flex items-center justify-between ">
      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 font-medium">
         <Link to="/" className="text-gray-100 hover:text-red-300 transition-all duration-300">Home</Link>
         <a href="#" className="text-gray-100 hover:text-red-300 transition-all duration-300">About Us</a>
         <Link to="/card" className="text-gray-100 hover:text-red-300 transition-all duration-300">Services</Link>
         <a href="#" className="text-gray-100 hover:text-red-300 transition-all duration-300">Contact</a>
      </div>

      {/* Mobile Menu Button */}
      <button
         className="md:hidden text-white text-2xl focus:outline-none"
         onClick={() => setMenuOpen(!menuOpen)}
      >
         ☰
      </button>

      {/* Donate Button */}
      {userInfo.role ? <div className="py-1 grid grid-cols-2 gap-2">
      <Link to="/card">
      <button className="hidden md:block bg-gradient-to-r from-red-400 to-red-500 text-white px-8 py-3 rounded-full shadow-lg border border-white hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer">
   Donate
</button>

      </Link>
    {userInfo?.role=="admin" ?  <Link to="/createBlog">
      <button className="hidden md:block bg-gradient-to-r from-red-400 to-red-500 text-white px-8 py-3 rounded-full shadow-lg border border-white hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer">
   Create Blog
</button>

      </Link> :  <Link to="/rent">
      <button className="hidden md:block bg-gradient-to-r from-red-400 to-red-500 text-white px-8 py-3 rounded-full shadow-lg border border-white hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer">
      Rent
      </button>
                     </Link>}
</div> : <div className="py-7"></div>}

   </div>

   {/* Mobile Menu */}
   <div className={`md:hidden bg-red-600 border-t shadow-md transition-all duration-300 ease-in-out ${menuOpen ? "max-h-60 opacity-100" : " max-h-0 opacity-0 overflow-hidden"}`}>
      <div className="flex flex-col items-center space-y-4 py-4">
         <Link to="/" className="text-gray-100 hover:text-red-300 transition-all duration-300">Home</Link>
         <a href="#" className="text-gray-100 hover:text-red-300 transition-all duration-300">About Us</a>
         <Link to="/card" className="text-gray-100 hover:text-red-300 transition-all duration-300">Services</Link>
         <a href="#" className="text-gray-100 hover:text-red-300 transition-all duration-300">Contact</a>
      </div>
   </div>
</nav>
         </header>

         {/* Profile Sidebar */}
         {profileopen && <ProfileBar closeSidebar={() => setprofileopen(false)} />}
      </>
   );
}

export default Header;
