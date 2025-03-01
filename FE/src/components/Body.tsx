
import { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header'
import { Outlet } from 'react-router-dom'
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useDispatch } from 'react-redux';
import { setUser } from '../Utils/cartSlice';
import { addToken } from '../Utils/authSlice';


const Body = () => {
const dispatch= useDispatch()





  useEffect(() => { 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const TokenValidation= async ()=>{
try{
const res= await axios.post(`${BACKEND_URL}/auth/reconnection`,{},{withCredentials:true});
const data= res.data.msg;
                const user= {
                    _id:data._id,//
                    username:data.username,//
                    email:data.email,//
                    address:data.address,//
                    contact:data.contact,//
                    currentDonation:data.currentDonation,//
                    currentRent:data.currentRent,//
                    monthRent:data.monthRent,//
                    totalDonation:data.totalDonation,//
                    role:data.role,//
                    shopName:data.shopName,
                    language:"English",
                    monthStatus:data.monthStatus
                }
            dispatch(setUser(user));
            dispatch(addToken(res.data.token))
            console.log(res.data.token);
            
}catch(err){
    console.log("Cant Authneticate! Login again"+err);
    
}
    }
TokenValidation()

}, [dispatch]);
  return (
    <div className='flex flex-col min-h-screen'>
        <Header/>
        <main className='flex-1 '>
          <div className='relative'>
              <Outlet/>
          </div>
        </main>
        {/* footer compo */}
          <Footer/>
    </div>
  )
}


export default Body;