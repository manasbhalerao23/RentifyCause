import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Collections() {
    interface User {
        _id: string;
        username: string;
        email: string;
        contact: string;
      }
      
      interface Notes {
        userId: User;
        paymentType: string;
        donationId: string;
      }
      
      interface CollectionItem {
        // filter(arg0: (item: CollectionItem) => boolean): unknown;
        _id: string;
        orderId: string;
        status: string;
        amount: number;
        currency: string;
        receipt: string;
        createdAt: string;
        updatedAt: string;
        paidAt?: string;
        notes: Notes;
      }
      
    const location = useLocation();
    const collections = (location.state?.collections || []) as CollectionItem[];
    //console.log(collections);
    const navigate = useNavigate();

    //filter collections
    const filtercollections = collections.filter((item: CollectionItem) => item.status === "captured") ;

    //pagination
    const [CurrPage, setCurrPage] = useState(1);
    const itemPerPage = 5;
    const totalPages = Math.ceil(filtercollections.length / itemPerPage);

    const currData = filtercollections.slice(
        (CurrPage - 1) * itemPerPage,
        CurrPage * itemPerPage
    )

    return(
        <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Donation Collections</h2>

      <button
        className="cursor-pointer mb-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Receipt</th>
            </tr>
          </thead>
          <tbody>
            { currData
              .map((item: CollectionItem, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.notes.userId.username}</td>
                  <td className="py-2 px-4">{item.notes.userId.email}</td>
                  <td className="py-2 px-4">{item.notes.userId.contact}</td>
                  <td className="py-2 px-4">{item.amount}</td>
                  <td className="py-2 px-4">{item.orderId}</td>
                  <td className="py-2 px-4">{item.receipt}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
          disabled={CurrPage === 1}
          className={`px-4 py-2 text-white rounded-md ${
            CurrPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          ← Prev
        </button>

        <span className="px-4 py-2 border rounded-md bg-gray-100">
          Page {CurrPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={CurrPage === totalPages}
          className={`px-4 py-2 text-white rounded-md ${
            CurrPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          Next →
        </button>
      </div>
            
        </div>
    );
}

export default Collections;