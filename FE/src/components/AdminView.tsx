import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";

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
  downloadUrl?: string;
  url?: string;
  notes?: {
    paymentType: string;
  };
}

const AdminView = () => {
  const [invoices, setInvoices] = useState([]);
  const [payment, setPayment] = useState<Payment[]>([]);
  const [user, setUser] = useState<User>({});

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
        console.log(userId);

        const res = await axios.get(`${BACKEND_URL}/admin/getInfo/${userId}`, {
          withCredentials: true,
        });
        // console.log(res.data)
        setInvoices(res.data.invoices);
        setPayment(res.data.payments);
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchingData();
  }, [userId]);//depend changed due to error

  console.log(payment);
  console.log(invoices);
  console.log(user);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      {/* User details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {user ? (
            [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <div
                key={index}
                className={`p-3 rounded-md text-center text-white shadow-md font-medium ${
                  user?.monthstatus?.[index]
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              >
                {month}
              </div>
            ))
          ) : (
            <div> Loading.... </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Info</h2>
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

 {/* Payment section */}
<div className="mt-8">
    <h2 className="text-2xl font-semibold text-center mb-4">Payments</h2>

    {/* Donations Section */}
    <div className="mt-4">
    <h3 className="text-xl font-bold mt-4">Donations</h3>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {payment
      .filter((e) => e?.notes?.paymentType === "donation")
      .map((e, idx) => (
        <div key={idx} className="border p-4 rounded-lg shadow-md bg-white">
          <p><strong>Username:</strong> {e?.username}</p>
          <p><strong>Amount:</strong> ₹{e?.amount}</p>
          <p><strong>Order ID:</strong> {e?.orderId}</p>
          <p><strong>Status:</strong> {e?.status}</p>
          <p><strong>Paid At:</strong> {new Date(e?.paidAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
    </div>
   

    {/* Rent Payments Section */}
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">Rent Payments</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {payment
      .filter((e) => e?.notes?.paymentType === "rent")
      .map((e, idx) => (
        <div key={idx} className="border p-4 rounded-lg shadow-md bg-white flex flex-col">
            <div className="flex-1">
          <p><strong>Username:</strong> {e?.username}</p>
          <p><strong>Amount:</strong> ₹{e?.amount}</p>
          <p><strong>Order ID:</strong> {e?.orderId}</p>
          <p><strong>Status:</strong> {e?.status}</p>
          <p><strong>Paid At:</strong> {new Date(e?.paidAt).toLocaleString()}</p>
          </div>

          {/* Button */}
          <div className="mt-4 flex justify-between">
          <button
                      onClick={(()=>{
                        handleDownload(e?.downloadUrl ?? "")
                      })}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        Download Invoice
                    </button>
                    <button
                     onClick={() => window.open(e?.url, "_blank")}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition"
                    > View Rent</button>
          </div>
        </div>
      ))}
      </div>
  </div>
</div>

    </div>
  );
};

export default AdminView;
