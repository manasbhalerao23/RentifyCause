import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";

function CashBook() {
    const [transactions, setTransactions] = useState([]);
    const tokenInfo = useSelector((store: RootState) => store.auth);

    useEffect(() => {
        const getdata = async() => {
            const res = await axios.get(`${BACKEND_URL}/admin/getRentDonations`,
                {
                 headers: { authorization: `Bearer ${tokenInfo.token}` } 
                }
            );
            setTransactions(res);
        };
        getdata();
    }, [tokenInfo.token]);
    return(
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Cash Books</h1>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">New Revenue</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg">New Expense</button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <input type="text" placeholder="Search" className="border p-2 rounded-lg w-1/3" />
              <input type="date" className="border p-2 rounded-lg" />
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Leader Id</th>
                  <th className="p-2">Date & Time</th>
                  <th className="p-2">Account</th>
                  <th className="p-2">Account Name</th>
                  <th className="p-2">Billing Reason</th>
                  <th className="p-2">Receipt No</th>
                  <th className="p-2">Operator</th>
                  <th className="p-2">Cash In / Out</th>
                  <th className="p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{txn.id}</td>
                    <td className="p-2">{txn.date} {txn.time}</td>
                    <td className="p-2">{txn.account}</td>
                    <td className="p-2">{txn.name}</td>
                    <td className="p-2">{txn.reason}</td>
                    <td className="p-2">{txn.receipt}</td>
                    <td className="p-2">{txn.operator}</td>
                    <td className={`p-2 font-bold ${txn.cash > 0 ? "text-green-500" : "text-red-500"}`}>
                      ${txn.cash.toFixed(2)}
                    </td>
                    <td className="p-2">${txn.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
}

export default CashBook;