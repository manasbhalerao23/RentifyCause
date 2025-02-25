import axios from 'axios';
import { useState } from 'react';
import { BACKEND_URL } from '../config';

declare global {
    interface Window {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Razorpay: any;
    }
  }
const Rent = ()=>{
const [num]=useState(3);
const handleRent= async ()=>{
    try{
const order= await axios.post( `${BACKEND_URL}/payment/create`,{
  num:num  
},{
    withCredentials:true
})
console.log(order);

const {amount, currency,orderId,keyId,notes}= order.data;

const options = {
    key:keyId, // Replace with your Razorpay key_id
    amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: currency,
    name: 'Red Cross Society Rent payment',
    description: 'Rent Transaction',
    order_id: orderId, // This is the order_id created in the backend
    // callback_url: 'http://localhost:3000/payment-success', // Your success URL
    prefill: {
      name: notes.username,
      email: notes.email,
      contact: notes.contact
    },
    theme: {
      color: '#F37254'
    },
  };
  
  
const rzp = new window.Razorpay(options);
rzp.open();
    }catch(err){
console.log(err);

    }
}

    return(
        <div className="container p-10">
<button onClick={()=> handleRent()} className=" p-2 cursor-pointer rounded-lg bg-red-500  px-3 hover:bg-blue-400 transition duration-500">    Pay Rent     </button>

        </div>
    )
}

export default Rent;