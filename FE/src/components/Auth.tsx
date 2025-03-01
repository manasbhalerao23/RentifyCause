import axios from "axios";
import {  useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import {  setUser } from "../Utils/cartSlice";
import {motion, AnimatePresence } from "framer-motion";
import { addToken } from "../Utils/authSlice";

function AuthForm() {
    const [isLogin, setisLogin] = useState(false);
    const [username,setusername] = useState("");
    const [password, setpassword] = useState("");
    const [contact, setcontact] = useState("");
    const [address, setaddress] = useState("");
    const [shopName, setshopName] = useState("");
    const [email, setemail] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const toggle = () => {
        setisLogin(!isLogin);
        setusername("");
        setpassword("");
    };

 
    



    const handleSubmit =  async(e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(!isLogin){
            try{
                const res = await axios.post(`${BACKEND_URL}/auth/signup`,
                    {username,password,contact,address,shopName,email},
                    {withCredentials: true}
                );
                console.log(res?.data);
                setisLogin(!isLogin);
            }
            catch(e){
                console.log(e);
            }
        }
        else{
            try{
                const res = await axios.post(`${BACKEND_URL}/auth/login`,
                    {username,password},
                    {withCredentials: true}
                );
                console.log(res.data);
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
            console.log(user);
            dispatch(addToken(res.data.token))

                navigate('/card');
            }
            catch(e){
                console.log(e);
            }
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="w-96 p-6 shadow-xl bg-white rounded-2xl overflow-hidden relative">
            <h2 className="text-xl font-bold text-center mb-4">{isLogin ? "Login" : "Sign up"}</h2>
            <AnimatePresence mode="wait">
                <motion.form
                    key={isLogin ? "login" : "signup"}
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                >
                    <input
                        type="text"
                        value={username}
                        placeholder="Username or Email..."
                        onChange={(e) => setusername(e.target.value)}
                        required
                        className="w-full p-2 border rounded-xl"
                    />
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setpassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded-xl"
                    />

                    {!isLogin && (
                        <>
                            <input type="text" value={contact} placeholder="Contact" onChange={(e) => setcontact(e.target.value)} required className="w-full p-2 border rounded-xl" />
                            <input type="text" value={address} placeholder="Address" onChange={(e) => setaddress(e.target.value)} required className="w-full p-2 border rounded-xl" />
                            <input type="text" value={shopName} placeholder="Shop Name" onChange={(e) => setshopName(e.target.value)} required className="w-full p-2 border rounded-xl" />
                            <input type="email" value={email} placeholder="Email" onChange={(e) => setemail(e.target.value)} required className="w-full p-2 border rounded-xl" />
                        </>
                    )}
                    
                    <button type="submit" className="w-full bg-red-500 hover:bg-red-700 transition duration-300 text-white rounded-2xl py-2 cursor-pointer">
                        {isLogin ? "Login" : "Sign up"}
                    </button>
                </motion.form>
            </AnimatePresence>
            
            <p className="text-center mt-4 text-md">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggle} className="text-blue-500 cursor-pointer ml-1">
                    {isLogin ? "Sign up" : "Login"}
                </button>
            </p>
        </div>
    </div>
    )
}

export default AuthForm;