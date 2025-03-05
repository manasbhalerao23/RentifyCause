import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";

interface PaymentDetails {
    notes: {
        username: string;
        email: string;
        contact: string;
        userId: string;
        paymentType: string;
        donationId?: string;
    };
    _id: string;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    receipt: string;
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
}


function OpenReceipt() {
    const location = useLocation();
    const {receipt} = location.state;
    const [details, setdetails] = useState<PaymentDetails | null>(null);//check
    const navigate = useNavigate();


    useEffect(() => {
        const fetchdetails = async () => {
            const resp = await axios.get(`${BACKEND_URL}/admin/getpaydetails`,{
                withCredentials: true,
                params: {
                    rec: receipt
                }
            });
            console.log(resp);
            setdetails(resp.data.paydetail);
        };
        fetchdetails();
    }, [receipt]);
    
    return(
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Payment Information</h1>
  
        {details && (
          <div className="mb-4 p-4 border rounded bg-gray-100">
            <p><strong>Username:</strong> {details.notes?.username}</p>
            {/* <p><strong>Shop Name:</strong> {details.notes?.shopName}</p> */}
          </div>
        )}
  
        { (
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">No.</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {details ? (
                <div className="mb-4 p-4 border rounded bg-gray-100">
                    <p><strong>Username:</strong> {details.notes.username}</p>
                    <p><strong>Email:</strong> {details.notes.email}</p>
                    <p><strong>Contact:</strong> {details.notes.contact}</p>
                    <p><strong>Order ID:</strong> {details.orderId}</p>
                    <p><strong>Amount:</strong> ₹{details.amount} {details.currency}</p>
                    <p><strong>Status:</strong> {details.status}</p>
                    <p><strong>Paid At:</strong> {new Date(details.paidAt ?? "").toLocaleString()}</p>
                </div>
            ) : (
                <p className="mt-4 text-gray-500">Loading payment details...</p>
            )}
            </tbody>
          </table>
        ) }
          <p className="mt-4 text-gray-500">No payment records found.</p>
  
        <button
          onClick={() => navigate("/admin")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Admin
        </button>
      </div>
    )
}

export default OpenReceipt;