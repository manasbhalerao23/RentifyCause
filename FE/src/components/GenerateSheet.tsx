import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";

export const GenerateSheet = () => {
  const obj: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const [date, setDate] = useState("");
  const [selectedType, setSelectedType] = useState(""); // State for type selection
  const [selectedMonth, setSelectedMonth] = useState(""); // State for month selection

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/admin/generate-excel`,
        {
          date: date,
          month:obj[selectedMonth]
          
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      link.setAttribute('download', `receipts_${new Date(Date.now())}.xlsx`); 

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200 mt-10 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Generate Report</h2>

      {/* Type Selection */}
      <div>
        <label className="block text-gray-600 font-medium mb-2">Select Time</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none transition"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Time Type</option>
          <option value="date">Date</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Month Selection */}
      {selectedType === "month" && (
        <div>
          <label className="block text-gray-600 font-medium mb-2">Select Month</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {["Select Month", ...Object.keys(obj)].map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Selection */}
      {selectedType === "date" && (
        <div>
          <label className="block text-gray-600 font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none transition"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Generate Report
      </button>
    </div>
  );
};
