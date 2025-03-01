import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Utils/store";
import { setUser } from "../Utils/cartSlice";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const Rent = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: RootState) => store.cart);
  const tokenInfo = useSelector((store:RootState) => store.auth);
console.log(tokenInfo);

  console.log(userInfo);
const [rcpt, setRcpt]=useState("");
const [orderInfo,setOrderInfo]=useState("")
  const gettingNewData = async () => {
    const res = await axios.post(
      `${BACKEND_URL}/auth/getInfo`,
      { id: userInfo._id },
      { headers: {authorization: `Bearer ${tokenInfo}`} }
    );
    const user = res.data;
    console.log(user?.msg);
    dispatch(setUser(user?.msg));
  };

  const [num, setNum] = useState(0);

  const handleRent = async () => {
    try {
      if (num === 0) {
        alert("Please select number of Months");
        return;
      }
console.log(tokenInfo);

      const order = await axios.post(
        `${BACKEND_URL}/payment/create`,
        { num: num },
        { headers: {authorization: `Bearer ${tokenInfo}`}
         }
      );

      const { amount, currency, orderId, keyId, notes } = order.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Red Cross Society Rent Payment",
        description: "Rent Transaction",
        order_id: orderId,
        prefill: {
          name: notes.username,
          email: notes.email,
          contact: notes.contact,
        },
        theme: { color: "#F37254" },
        handler: gettingNewData,
      };
      console.log(order);
      setOrderInfo(order.data.orderId)
      setRcpt(order.data.receiptId)



      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto p-5 h-screen flex flex-col gap-6 bg-gray-100 shadow-lg rounded-xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">User Info</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-lg font-semibold">Name: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
            <p>Contact: {userInfo.contact}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Shop Name: {userInfo.shopName}</p>
            <p>Address: {userInfo.address}</p>
            <p>Total Donation: {userInfo.totalDonation}</p>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-500 border-4 border-amber-400 text-white text-3xl font-bold shadow-lg">
              {userInfo.username[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Rent Info</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3">Months Paid</h3>
            <div className="grid grid-cols-4 gap-2">
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
                (month, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md text-center shadow-md font-medium ${
                      userInfo.monthStatus[index] ? "bg-green-300 border-2 border-blue-600" : "bg-gray-200"
                    }`}
                  >
                    {month}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between">
          <p className="text-lg font-semibold">Month Rent: {Number(userInfo.monthRent) * num}</p>
<p className="text-lg font-semibold">Fine: -</p>
<p className="text-lg font-semibold">Order ID: {orderInfo || "N/A"}</p>
<p className="text-lg font-semibold">Receipt ID: {rcpt || "N/A"}</p>

            <div className="mt-4">
              <h3 className="text-lg font-bold">Number of Months</h3>
              <div className="flex gap-4 mt-2">
                {[1, 2, 3].map((value) => (
                  <div
                    key={value}
                    onClick={() => setNum(value)}
                    className={`cursor-pointer p-3 rounded-md shadow-md font-semibold w-12 text-center ${
                      num === value ? "bg-green-300 border-2 border-blue-600" : "bg-gray-200"
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRent}
              className="mt-6 p-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-500 transition"
            >
              Pay Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rent;
