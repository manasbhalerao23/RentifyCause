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
        `${BACKEND_URL}/admin/generate-receipts-without-link`,
        {
          date: "2025-03-03",
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipts_2025-03-03.xlsx`); // Set file name 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Type Selection */}
      <div>
        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Time</option>
          <option value="date">Date</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Month Selection - Only visible if type is "month" */}
      {selectedType === "month" && (
        <div>
          <select
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
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

      {/* Date Selection - Only visible if type is "date" */}
      {selectedType === "date" && (
        <div className="flex items-center gap-5">
          <div>Date:</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
          />
        </div>
      )}
      <button onClick={handleSubmit}>Generate</button>
    </div>
  );
};
