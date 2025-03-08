import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";

interface Record {
  _id: string;
  username: string;
  contact: string;
  shopName: string;
  address: string;
  currentRent: number;
  monthstatus?: boolean[];
}

const AdminTest = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedmonth, setselectedmonth] = useState<string>("Select Month");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetcherr, setfetcherr] = useState("");
  const tokenInfo = useSelector((store: RootState) => store.auth);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 8;

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
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchedRecords = async () => {
      try {
        const response = await axios.get<{ DatatoSend: Record[] }>(
          `${BACKEND_URL}/admin/getall`,
          {
            headers: { authorization: `Bearer ${tokenInfo.token}` },
          }
        );
        if (Array.isArray(response.data.DatatoSend)) {
          setRecords(response.data.DatatoSend);
        }
      } catch (e) {
        if (!records) {
          const err = e as AxiosError<{ message?: string }>;
          setfetcherr(
            err.response?.data?.message ?? "Error occured while fetching Data"
          );
          console.error(e);
        }
      }
    };
    fetchedRecords();
  }, [tokenInfo.token]);

  const filteredRecords = records.filter((e) => {
    const username = e.username?.toLowerCase() || "";
    const shopName = e.shopName?.toLowerCase() || "";
    return (
      username.includes(searchTerm.toLowerCase()) ||
      shopName.includes(searchTerm.toLowerCase())
    );
  });

  const paidCount = filteredRecords.filter(
    (e) =>
      selectedmonth !== "Select Month" && e.monthstatus?.[obj[selectedmonth]]
  ).length;

  const unpaidCount = filteredRecords.filter(
    (e) =>
      selectedmonth !== "Select Month" && !e.monthstatus?.[obj[selectedmonth]]
  ).length;

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Pending & Completed Counts */}
      {selectedmonth !== "Select Month" && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Records List</h1>
          <div className="flex flex-wrap gap-4 my-4">
            <div className="p-5 w-full sm:w-1/2 md:w-1/3 text-center bg-red-100 border border-red-300 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-red-700">Pending</h2>
              <p className="text-2xl font-bold text-red-900">{unpaidCount}</p>
            </div>
            <div className="p-5 w-full sm:w-1/2 md:w-1/3 text-center bg-green-100 border border-green-300 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-green-700">
                Completed
              </h2>
              <p className="text-2xl font-bold text-green-900">{paidCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or shop name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />
      </div>

      {/* Month Selection */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
        <label className="text-lg font-semibold text-gray-700">
          Select Month:
        </label>
        <select
          value={selectedmonth}
          onChange={handlemonthsort}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
          {["Select Month", ...Object.keys(obj)].map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {fetcherr && <p className="text-red-500 text-center">{fetcherr}</p>}

      {/* Records Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedRecords.map((e) => (
          <Link to={`/admin/view/${e._id}`} key={e._id} className="block">
            <div
              className={`p-5 rounded-xl border shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                selectedmonth !== "Select Month"
                  ? e.monthstatus?.[obj[selectedmonth]]
                    ? "bg-green-200 border-green-400"
                    : "bg-red-200 border-red-400"
                  : "bg-white border-gray-300"
              }`}
            >
              <p className="text-lg font-semibold text-gray-900">
                {e.username}
              </p>
              <p className="text-sm text-gray-600">📞 {e.contact}</p>
              <p className="text-sm text-gray-600">🏪 {e.shopName}</p>
              <p className="text-sm text-gray-600">📍 {e.address}</p>
              <p className="text-sm font-semibold text-gray-800">
                💰 Rent: {e.currentRent}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-lg font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTest;
