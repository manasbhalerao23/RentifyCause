/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../Utils/store"
import { X } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { removeToken } from "../Utils/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../Utils/cartSlice";
import { useEffect, useState } from "react";


interface ProfileBarProps {
    closeSidebar: () => void;
  }
  

  function ProfileBar({ closeSidebar }: ProfileBarProps) {
    const userInfo = useSelector((store: RootState) => store.cart);
    const tokenInfo = useSelector((store: RootState) => store.auth);
    const [role,setRole]=useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();


useEffect(()=>{
    
    const fetchDetails = async () =>{
        const token = tokenInfo.token;
    console.log(token);

       const res= await axios.get(`${BACKEND_URL}/auth/userInfo`,{
            headers: {
                'authorization': `Bearer ${token}`
                }
                })
                console.log(res);
                
setRole(res.data.role);

    }
    fetchDetails();
})

    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
                headers: { authorization: `Bearer ${tokenInfo?.token}` }
            });
            dispatch(removeToken());
            dispatch(clearUser());
            navigate("/");
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
      <div className="fixed top-0 right-0 w-96 sm:w-72 bg-white shadow-2xl p-6 transition-transform transform translate-x-0 z-50 rounded-l-lg flex flex-col min-h-[80vh]">
      {/* Close Button */}
      <button className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-300" onClick={closeSidebar}>
          <X size={24} />
      </button>
  
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-red-600">Profile</h2>
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center rounded-full text-4xl font-bold shadow-md">
              {userInfo.username.charAt(0).toUpperCase()}
          </div>
          <p className="text-lg font-semibold">{userInfo.username}</p>
      </div>
  
      {/* User Details */}
      <div className="bg-gray-50 shadow-sm rounded-lg p-4 text-sm sm:text-base w-full border border-gray-200 mt-4">
          <p className="text-gray-700 font-medium"><span className="font-bold text-gray-900">Email:</span> {userInfo.email}</p>
          <p className="text-gray-700 font-medium truncate"><span className="font-bold text-gray-900">Address:</span> {userInfo.address}</p>
          <p className="text-gray-700 font-medium"><span className="font-bold text-gray-900">Contact:</span> {userInfo.contact}</p>
          <p className="text-gray-700 font-medium"><span className="font-bold text-gray-900">Monthly Rent:</span> ₹{userInfo.monthRent}</p>
          <p className="text-gray-700 font-medium"><span className="font-bold text-gray-900">Total Donation:</span> ₹{userInfo.totalDonation}</p>
      </div>

     
{  role=="admin" ?  <div className=" grid grid-rows-2 gap-2"> <Link to="/createBlog">
      <button 
              className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer text-lg font-semibold">
              Create Blog
          </button>
          </Link>
          <Link to="/adminTest">
          <button 
              className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer text-lg font-semibold">
              Admin Panel
          </button>
          </Link> </div> : <div></div>}
     
     
      {/* Logout Button */}
      <div className="mt-auto w-full flex justify-center">
    
          <button 
              onClick={handleLogout} 
              className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300 cursor-pointer text-lg font-semibold">
              Logout
          </button>
      </div>
  </div>
    );
}


export default ProfileBar;