import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { RootState } from "../Utils/store";
import {  setUser } from "../Utils/cartSlice";

function AuthForm() {
    const [isLogin, setisLogin] = useState(false);
    const [username,setusername] = useState("");
    const [password, setpassword] = useState("");
    const [contact, setcontact] = useState("");
    const [address, setaddress] = useState("");
    const [shopname, setshopname] = useState("");
    const [email, setemail] = useState("");
    const userInfo= useSelector((store:RootState)=>store.cart);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const toggle = () => {
        setisLogin(!isLogin);
        setusername("");
        setpassword("");
    }


    const handleSubmit =  async(e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(!isLogin){
            try{
                const res = await axios.post(`${BACKEND_URL}/auth/signup`,
                    {username,password,contact,address,shopname,email}
                    // {withCredentials: true}
                );
                console.log(res?.data);
                setisLogin(!isLogin);
            }
            catch(e: any){
                console.log(e.message);
            }
        }
        else{
            try{
                const res = await axios.post(`${BACKEND_URL}/auth/login`,
                    {username,password},
                    {withCredentials: true}
                );
                console.log(res.data.msg);
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
                    language:"English"
                }
dispatch(setUser(user));
console.log(user);

                navigate('/card');
            }
            catch(e: any){
                console.log(e.message);
            }
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-96 p-6 shadow-xl bg-white rounded-2xl">
                <h2 className="text-xl font-bold text-center mb-4">{isLogin ? "Login" : "Sign up"}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                    type="name"
                    name="name"
                    value={username}
                    placeholder="Username or Email..."
                    onChange={(e) => {(setusername(e.target.value))}}
                    required
                    className="w-full p-2 border rounded-xl"
                    />
                    <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => {(setpassword(e.target.value))}}
                    required
                    className="w-full p-2 border rounded-xl"
                    />

                    {!isLogin && (
                        <>
                        <input
                        type="text"
                        name="contact"
                        value={contact}
                        placeholder="Contact"
                        onChange={(e) => {(setcontact(e.target.value))}}
                        required
                        className="w-full p-2 border rounded-xl"
                        />
                        <input
                        type="text"
                        name="address"
                        value={address}
                        placeholder="Address"
                        onChange={(e) => {(setaddress(e.target.value))}}
                        required
                        className="w-full p-2 border rounded-xl"
                        />
                        <input
                        type="text"
                        name="shopname"
                        value={shopname}
                        placeholder="Shop Name"
                        onChange={(e) => {(setshopname(e.target.value))}}
                        required
                        className="w-full p-2 border rounded-xl"
                        />
                        <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {(setemail(e.target.value))}}
                        required
                        className="w-full p-2 border rounded-xl"
                        />
                        </>
                    )}

                    <button type="submit" className="w-full bg-red-500 text-white rounded-2xl py-2 cursor-pointer" >
                        {isLogin ? "Login" : "Sign up"}
                    </button>
                </form>
                <p className="text-center mt-4 text-sm">
                    {isLogin ? "Don't have account" : "Already have an account?"}
                    <span>  </span>
                    <button onClick={toggle} className="text-blue-500 cursor-pointer">
                        {isLogin ? "Sign up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default AuthForm;