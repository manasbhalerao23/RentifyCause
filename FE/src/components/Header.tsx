import { Circle, CircleUserRound, Facebook, Twitter, Youtube } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { changeLanguage } from "../Utils/cartSlice";
import { RootState } from "../Utils/store";
import ProfileBar from "./ProfileBar";
import { useState } from "react";
function Header() {
  const [profileopen, setprofileopen] = useState(false);
  const userInfo = useSelector((store:RootState) => store.cart);
  const dispatch = useDispatch();
  const changeLang = () => {
    if (userInfo.language == "English") dispatch(changeLanguage("हिन्दी"));
    else dispatch(changeLanguage("English"));
  };
  
  return (
    <>
    <header>
      <div className="flex justify-between items-center px-6  text-sm bg-red-600">
        <div className="flex space-x-4 ">
          <button className="cursor-pointer" onClick={changeLang}>
            {userInfo.language}
          </button>
        </div>
        <div className="cursor-pointer flex space-x-3">
          <Twitter />
          <Facebook />
          <Youtube />
        </div>
      </div>
      {/*main part*/}
      <div className=" flex justify-between items-center px-16 py-1 bg-red-100 text-black border-b-2 border-red-200">
        <div className="flex items-center space-x-4">
        <Link to="/">
          <div className=" flex items-center gap-3">
            <img className="h-28" src="http://res.cloudinary.com/dz0sdsbfa/image/upload/v1740478249/u2eaqolxjdlpwk9kwqia.png"/>
            <div>
            <h1 className="text-2xl font-bold">
               Indian Red Cross Society
            </h1>
            <p className="text-xl">Chhindwara, Madhya Pradesh State Branch</p>
            </div>
          </div>
          </Link>
        </div>
        <div className="flex space-x-3 items-center gap-7">
          {userInfo.role == "Admin" ? (
            <Link to="/createBlog">
              <button className="bg-red-600 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-teal-500 transition duration-500 animate-pulse ease-in-out ">
                Create Blog
              </button>
            </Link>
          ) : userInfo.role == "user" ? (
           <Link to="/rent"> <button className="bg-red-600 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-teal-500 transition duration-500 animate-pulse ease-in-out ">
              Rent
            </button></Link>
          ) : (
            <div></div>
          )}
          {userInfo.username ? 
          <button className="rounded-md flex gap-1 font-medium cursor-pointer relative" onClick={() => {setprofileopen(true)}}>
            <Circle className="w-10 h-10 text-blue-500 flex items-center justify-center text-xl font-bold">
            </Circle>
            
            {/* Letter inside the circle */}
            <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-xl">
              {userInfo.username.charAt(0).toUpperCase()}
            </span>
          </button>  : <div>
          <button className="rounded-md flex gap-1 font-medium cursor-pointer">
            <CircleUserRound />
            Guest
          </button>
            </div> }
        </div>
      </div>
      <div className="flex justify-between items-center border-b-2 border-red-500 bg-red-500 px-4 py-1">
                    {/* <div className="flex items-center gap-1 cursor-pointer">
                        <Globe size={14}/>
                        <button className="cursor-pointer">
                            Hindi
                        </button>
                    </div> */}
                    <div className="flex items-center space-x-4 ">
                      {userInfo.username ?
                        <button className="cursor-pointer">
                        Logout
                        </button>:<Link to="/auth"> <button className="cursor-pointer rounded-lg bg-red-200 px-3 hover:bg-blue-400 transition duration-500">    Register/Login     </button></Link>}
                    </div>
                </div>
    </header>
    
     {/* Profile Sidebar */}
     {profileopen && <ProfileBar closeSidebar={() => setprofileopen(false)} />}
     </>
  );
}

export default Header;
