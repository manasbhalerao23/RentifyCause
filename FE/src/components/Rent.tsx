import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { Circle } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}
const Rent = () => {
  const [num] = useState(3);
  const handleRent = async () => {
    try {
      console.log(num);

      const order = await axios.post(
        `${BACKEND_URL}/payment/create`,
        {
          num: num,
        },
        {
          withCredentials: true,
        }
      );
      console.log(order);

      const { amount, currency, orderId, keyId, notes } = order.data;

      const options = {
        key: keyId, // Replace with your Razorpay key_id
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: currency,
        name: "Red Cross Society Rent payment",
        description: "Rent Transaction",
        order_id: orderId, // This is the order_id created in the backend
        // callback_url: 'http://localhost:3000/payment-success', // Your success URL
        prefill: {
          name: notes.username,
          email: notes.email,
          contact: notes.contact,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };
  {
    /**/
  }

  return (
    <div className="container h-screen grid grid-rows-[10%_15%_10%_65%] border ">
      <div className="flex justify-center items-center text-2xl font-bold">
        User Info
      </div>
      <div className="grid grid-cols-3 justify-items-center text-[17px]">
        <div className="grid grid-rows-3">
          <div>Name</div>
          <div>Email</div>
          <div>Contact</div>
        </div>
        <div className="grid grid-rows-3">
          <div>Shop Name</div>
          <div>Shop Address</div>
          <div>Total Donation</div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-40 h-40 flex items-center justify-center rounded-full bg-blue-500  border-amber-400 border-solid border-8 text-white text-xl font-bold shadow-lg">
            Content
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center text-2xl font-bold">
        Rent Info
      </div>

      <div className="grid grid-cols-[60%_40%] border p-2 px-5">
        <div className=" grid grid-rows-[45%_20%_35%]">
          <div className="grid grid-rows-[10%_30%_30%_30%]">
            <div className="flex items-center justify-center font-bold">
              Months Paid
            </div>
            <div className="grid grid-cols-4 gap-4 p-2">
              <div className="border flex items-center justify-center">
                January
              </div>
              <div className="border flex items-center justify-center">
                February
              </div>
              <div className="border flex items-center justify-center">
                March
              </div>
              <div className="border flex items-center justify-center">
                April
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-2">
              <div className="border flex items-center justify-center">May</div>
              <div className="border flex items-center justify-center">
                June
              </div>
              <div className="border flex items-center justify-center">
                July
              </div>
              <div className="border flex items-center justify-center">
                August
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-2">
              <div className="border flex items-center justify-center">
                September
              </div>
              <div className="border flex items-center justify-center">
                October
              </div>
              <div className="border flex items-center justify-center">
                Number
              </div>
              <div className="border flex items-center justify-center">
                December
              </div>
            </div>
          </div>
          <div className="grid grid-rows-2 ">
            <div>Month Rent</div>
            <div>Fine</div>
          </div>
          <div className="grid grid-rows-[50%_20%_30%] pb-2">
            <div className="grid grid-rows-[30%_70%]">
              <div>Number of Month</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex justify-center items-center border">1</div>
                <div className="flex justify-center items-center border">2</div>
                <div className="flex justify-center items-center border">3</div>
                
              </div>
            </div>
            <div>Amount</div>
            <div className="flex justify-center items-center">
              {" "}
              <button
                onClick={() => handleRent()}
                className=" p-2 cursor-pointer rounded-lg bg-red-500   hover:bg-blue-400 transition duration-500"
              >
                {" "}
                Pay Rent{" "}
              </button>{" "}
            </div>
          </div>
        </div>
        <div>INVOICE</div>
      </div>
    </div>
  );
};

export default Rent;
