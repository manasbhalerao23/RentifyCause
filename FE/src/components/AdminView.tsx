import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";

interface User {
  _id?: string;
  username?: string;
  totalDonation?: number;
  shopName?: string;
  email?: string;
  contact?: string;
  address?: string;
  monthRent?: number;
  monthstatus?: boolean[]; // Assuming monthstatus is an array of booleans
}

interface Payment {
  username: string;
  amount: number;
  orderId: string;
  status: string;
  paidAt: string;
  createdAt: string;
  downloadUrl?: string;
  receipt?: string;
  url?: string;
  notes?: {
    paymentType: string;
    username: string;
  };
}

const AdminView = () => {
  const [, setInvoices] = useState([]);
  const [payment, setPayment] = useState<Payment[]>([]);
  const [user, setUser] = useState<User>({});
  const tokenInfo = useSelector((store: RootState) => store.auth);
  const [compartment,setCompartment]=useState(1);

  const { userId } = useParams();
  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf"); // Optional: Suggests a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // fetch data from server
    const fetchingData = async () => {
      try {
        // console.log(userId);

        const res = await axios.get(`${BACKEND_URL}/admin/getInfo/${userId}`, {
          headers: { authorization: `Bearer ${tokenInfo.token}` },
        });
        setInvoices(res.data.invoices);
        setPayment(res.data.payments);
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    if(tokenInfo.token){
    fetchingData();
    }
  }, [userId, tokenInfo.token]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>
      {/* User details */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full">
            {user ? (
              [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
              ].map((month, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center text-white font-medium transition transform hover:scale-105 shadow-md ${
                    user?.monthstatus?.[index + 12 * compartment] ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {month}
                </div>
              ))
            ) : (
              <div> Loading.... </div>
            )}
          </div>
  
          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-6 mt-6">
            <button
              onClick={() => setCompartment((prev) => Math.max(prev - 1, 0))}
              className="text-2xl font-bold bg-gray-300 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
            >
              {"<"}
            </button>
            <span className="text-xl font-semibold">Year- {new Date().getFullYear() + compartment - 1}</span>
            <button
              onClick={() => setCompartment((prev) => Math.min(prev + 1, 2))}
              className="text-2xl font-bold bg-gray-300 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
            >
              {">"}
            </button>
          </div>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-md border w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">User Info</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>ID:</strong> {user?._id}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Donations:</strong> ₹{user?.totalDonation}</p>
            <p><strong>Shop Name:</strong> {user?.shopName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Contact:</strong> {user?.contact}</p>
            <p><strong>Address:</strong> {user?.address}</p>
            <p><strong>Monthly Rent:</strong> ₹{user?.monthRent}</p>
          </div>
        </div>
      </div>
  
      {/* Payment section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Payments</h2>
  
        {/* Donations Section */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Donations</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {payment.filter((e) => e?.notes?.paymentType === "donation").map((e, idx) => (
              <div key={idx} className="border p-6 rounded-lg shadow-md bg-white transition transform hover:scale-105">
                <p><strong>Username:</strong> {e?.notes?.username}</p>
                <p><strong>Amount:</strong> ₹{e?.amount}</p>
                <p><strong>Order ID:</strong> {e?.orderId}</p>
                <p><strong>Receipt:</strong> {e?.receipt}</p>
                <p><strong>Status:</strong> {e?.status}</p>
                <p><strong>Paid At:</strong> {new Date(e?.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* Rent Payments Section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Rent Payments</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {payment.filter((e) => e?.notes?.paymentType === "rent").map((e, idx) => (
              <div key={idx} className="border p-6 rounded-lg shadow-md bg-white flex flex-col transition transform hover:scale-105">
                <div className="flex-1">
                  <p><strong>Username:</strong> {e?.notes?.username}</p>
                  <p><strong>Amount:</strong> ₹{e?.amount}</p>
                  <p><strong>Order ID:</strong> {e?.orderId}</p>
                  <p><strong>Receipt:</strong> {e?.receipt}</p>
                  <p><strong>Status:</strong> {e?.status}</p>
                  <p><strong>Paid At:</strong> {new Date(e?.createdAt).toLocaleString()}</p>
                </div>
                {e?.status === "captured" && (
                  <div className="mt-4 flex justify-between">
                    <button onClick={() => handleDownload(e?.downloadUrl ?? "")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition">Download Invoice</button>
                    <button onClick={() => window.open(e?.url, "_blank")} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition">View Rent</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminView;