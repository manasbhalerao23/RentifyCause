import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { Link } from "react-router-dom";

const AdminTest = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [records, setRecords] = useState<any[]>([]);
  const [selectedmonth, setselectedmonth] = useState("Select Month");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handlemonthsort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value;
    setselectedmonth(month === "Select Month" ? "Select Month" : month);
  };

  useEffect(() => {
    console.log(selectedmonth);
  }, [selectedmonth]);

  useEffect(() => {
    const fetchedRecords = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/admin/getall`, {
          withCredentials: true,
        });

        if (Array.isArray(response.data.DatatoSend)) {
          setRecords(response.data.DatatoSend);
          console.log(response.data.DatatoSend);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchedRecords();
  }, []);

  // **Filter records based on search input**
  const filteredRecords = records.filter((e) => {
    const username = e.username ? e.username.toLowerCase() : "";
    const shopName = e.shopName ? e.shopName.toLowerCase() : "";
    return (
      username.includes(searchTerm.toLowerCase()) ||
      shopName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or shop name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Month Selection */}
      <div className="flex items-center space-x-3 mb-6">
        <label className="text-lg font-semibold">Select Month:</label>
        <select
          value={selectedmonth}
          onChange={handlemonthsort}
          className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {["Select Month", ...Object.keys(obj)].map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRecords.map((e, idx) => (
            <Link to= {`/admin/view/${e._id}`} key={idx}>
          <div
            className={`p-4 rounded-lg shadow-lg border transition-transform transform hover:scale-105 ${
              selectedmonth !== "Select Month"
                ? e.monthstatus?.[obj[selectedmonth]]
                  ? "bg-green-200"
                  : "bg-red-200"
                : "bg-white"
            }`}
            key={idx}
          >
            <p className="text-lg font-semibold">{e.username}</p>
            <p className="text-sm text-gray-600">📞 {e.contact}</p>
            <p className="text-sm text-gray-600">🏪 {e.shopName}</p>
            <p className="text-sm text-gray-600">📍 {e.address}</p>
            <p className="text-sm font-semibold">💰 Rent: {e.currentRent}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminTest;
