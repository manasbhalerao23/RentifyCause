import { useSelector } from "react-redux"
import { RootState } from "../Utils/store"
import { X } from "lucide-react";


interface ProfileBarProps {
    closeSidebar: () => void;
  }
  

function ProfileBar({closeSidebar}: ProfileBarProps) {
    const userInfo = useSelector((store:RootState) => store.cart);

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
      <button className="mt-5 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">
        Logout
      </button>
    </div>
    )
}

export default ProfileBar;