/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../Utils/store"
import { X } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { removeToken } from "../Utils/authSlice";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../Utils/cartSlice";


interface ProfileBarProps {
    closeSidebar: () => void;
  }
  

function ProfileBar({closeSidebar}: ProfileBarProps) {
    const userInfo = useSelector((store:RootState) => store.cart);
    const tokenInfo= useSelector((store:RootState)=>store.auth);
    // console.log(tokenInfo);
    

const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleLogout = async() =>{
  try{
 await axios.post(`${BACKEND_URL}/auth/logout`,{},{
  headers:{authorization: `Bearer ${tokenInfo}`},
  withCredentials:true
})
dispatch(removeToken());
dispatch(clearUser())
navigate("/")
window.location.reload();



  }catch(err){
    console.error(err);
  }
}

    return(
        <div className="fixed top-0 right-0 h-96 w-64 bg-white shadow-lg p-5 transition-transform transform translate-x-0 z-50 rounded-l-lg">
      <button className="absolute top-2 right-2 text-gray-500 cursor-pointer" onClick={() => {
        closeSidebar();}}>
        <X size={24} />
      </button>
      <h2 className="text-xl font-bold mb-4 text-red-600 text-center">Profile</h2>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-2xl">
          {userInfo.username.charAt(0).toUpperCase()}
        </div>
        <p className="text-lg font-semibold">Username: {userInfo.username}</p>
        
        <div className="align-text-bottom">
        <p className="text-gray-500">Email: {userInfo.email}</p>
        <p className="text-gray-500">Address: {userInfo.address}</p>
        <p className="text-gray-500">Contact: {userInfo.contact}</p>
        <p className="text-gray-500">Monthly Rent: {userInfo.monthRent}</p>
        <p className="text-gray-500">Donation: {userInfo.totalDonation}</p>
        </div>
        
      </div>
      <button onClick={handleLogout} className="mt-5 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">
        Logout
      </button>
    </div>
    )
}

export default ProfileBar;