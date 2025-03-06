import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";

const AdminView = () => {
  const [invoices, setInvoices] = useState([]);
  const [payment, setPayment] = useState([]);
  const [user, setUser] = useState({});

  const { userId } = useParams();
  const handleDownload = (url) => {
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
  }, []);

  console.log(payment);
  console.log(invoices);
  console.log(user);

  return (
    <div>
      Hello
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-4 gap-2">
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
                className={`p-3 rounded-md text-center shadow-md font-medium ${
                  user?.monthstatus?.[index]
                    ? "bg-green-300 border-2 border-blue-600"
                    : "bg-gray-200"
                }`}
              >
                {month}
              </div>
            ))
          ) : (
            <div> Loading.... </div>
          )}
        </div>
        <div>
            id: {user?._id}
            username : {user?.username}
            Donations: {user?.totalDonation}
            shop name: {user?.shopName}
            email : {user?.email}
            contact : {user?.contact}
            address: {user?.address}
            monthly rent= {user?.monthRent}
        </div>
      </div>

<div>
    <div className="text-4xl">Payments</div>
    <div>
    {/* Donations Section */}
    <h2 className="text-xl font-bold mt-4">Donations</h2>
    {payment
      .filter((e) => e?.notes?.paymentType === "donation")
      .map((e, idx) => (
        <div key={idx} className="border p-3 mb-2 rounded-md shadow-md">
          <p><strong>Username:</strong> {e?.username}</p>
          <p><strong>Amount:</strong> ₹{e?.amount}</p>
          <p><strong>Order ID:</strong> {e?.orderId}</p>
          <p><strong>Status:</strong> {e?.status}</p>
          <p><strong>Paid At:</strong> {new Date(e?.paidAt).toLocaleString()}</p>
        </div>
      ))}

    {/* Rent Payments Section */}
    <h2 className="text-xl font-bold mt-4">Rent Payments</h2>
    {payment
      .filter((e) => e?.notes?.paymentType === "rent")
      .map((e, idx) => (
        <div key={idx} className="border p-3 mb-2 rounded-md shadow-md">
            <div>
          <p><strong>Username:</strong> {e?.username}</p>
          <p><strong>Amount:</strong> ₹{e?.amount}</p>
          <p><strong>Order ID:</strong> {e?.orderId}</p>
          <p><strong>Status:</strong> {e?.status}</p>
          <p><strong>Paid At:</strong> {new Date(e?.paidAt).toLocaleString()}</p>
          </div>
          <div>
          <button
                      onClick={(()=>{
                        handleDownload(e?.downloadUrl)
                      })}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-
    2 px-4 rounded"
                    >
                        Download

                    </button>
                    <button
                     onClick={() => window.open(e?.url, "_blank")}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-
    2 px-4 rounded"
                    >Rent</button>
          </div>
        </div>
      ))}
  </div>
</div>

    </div>
  );
};

export default AdminView;
