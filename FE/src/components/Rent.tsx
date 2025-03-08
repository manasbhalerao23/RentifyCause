import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Utils/store";
import { setUser } from "../Utils/cartSlice";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Rent = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: RootState) => store.cart);
  const tokenInfo = useSelector((store: RootState) => store.auth);

  const [compartment, setCompartment] = useState(1); // Default to Year 2
  const [num, setNum] = useState(0);
  const [orderInfo, setOrderInfo] = useState("");
  const [rcpt, setRcpt] = useState("");
  const [url, setUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const gettingNewData = async (orderId: string) => {
    const res = await axios.post(
      `${BACKEND_URL}/auth/getInfo`,
      { id: userInfo._id, orderId: orderId },
      { headers: { authorization: `Bearer ${tokenInfo.token}` } }
    );
    const data = res.data;
    dispatch(setUser(data?.msg));
    setDownloadUrl(data.downloadUrl);
    setUrl(data.Url);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRent = async () => {
    if (num === 0) {
      alert("Please select number of Months");
      return;
    }
    try {
      const order = await axios.post(
        `${BACKEND_URL}/payment/create`,
        { num: num },
        { headers: { authorization: `Bearer ${tokenInfo.token}` } }
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
        handler: function () {
          gettingNewData(orderId);
        },
      };
      setOrderInfo(order.data.orderId);
      setRcpt(order.data.receiptId);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-7xl bg-red-100 mx-auto p-5 h-screen flex flex-col gap-6 shadow-lg rounded-xl px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">User Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-lg font-semibold">Name: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
            <p>Contact: {userInfo.contact}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">
              Shop Name: {userInfo.shopName}
            </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid">
            <div>
              <h3 className="text-lg font-bold mb-3">Months Paid</h3>
              <h1 className="text-lg font-bold mb-3">
                Year- {new Date().getFullYear() + compartment - 1}
              </h1>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[...Array(12)].map((_, index) => {
                const monthIndex = compartment * 12 + index;
                return (
                  <div
                    key={monthIndex}
                    className={`p-3 rounded-md text-center shadow-md font-medium ${
                      userInfo.monthStatus[monthIndex]
                        ? "bg-green-300 border-2 border-blue-600"
                        : "bg-gray-200"
                    }`}
                  >
                    {new Date(0, index).toLocaleString("default", {
                      month: "long",
                    })}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center items-center gap-6 m-2">
              <button
                onClick={() => setCompartment((prev) => Math.max(prev - 1, 0))}
                className="text-2xl font-bold bg-gray-300 px-3 py-1 rounded-md shadow-md"
              >
                {"<"}
              </button>
              <button
                onClick={() => setCompartment((prev) => Math.min(prev + 1, 2))}
                className="text-2xl font-bold bg-gray-300 px-3 py-1 rounded-md shadow-md"
              >
                {">"}
              </button>
            </div>
            {url &&    (
              <button
                onClick={handleDownload}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Invoice
              </button>
            )}
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-lg font-semibold">
              Month Rent: {Number(userInfo.monthRent) * num}
            </p>
            <p className="text-lg font-semibold">Fine: -</p>
            <p className="text-lg font-semibold">
              Order ID: {orderInfo || "N/A"}
            </p>
            <p className="text-lg font-semibold">Receipt ID: {rcpt || "N/A"}</p>
            <h3 className="text-lg font-bold mt-4">Number of Months</h3>
            <div className="gap-4 mt-2 grid grid-cols-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => (
                <div
                  key={value}
                  onClick={() => setNum(value)}
                  className={`cursor-pointer p-3 rounded-md shadow-md font-semibold w-12 text-center ${
                    num === value
                      ? "bg-green-300 border-2 border-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  {value}
                </div>
              ))}
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
