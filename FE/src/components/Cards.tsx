import axios from "axios";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { BlogData } from "../Types";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";

export const Cards = () => {
  const [apiData, setApiData] = useState<BlogData[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null); // To track which blog is being deleted
  const navigate = useNavigate();
  const tokenInfo = useSelector((store: RootState) => store.auth);
  const userInfo = useSelector((store: RootState) => store.cart);

  const getData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/blog/all`, {
        headers: { authorization: `Bearer ${tokenInfo.token}` },
      });
      setApiData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const openblog = (Id: string) => {
    try {
      navigate(`/openBlog/${Id}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (tokenInfo.token) {
      getData();
    }
  }, [tokenInfo.token]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${BACKEND_URL}/blog/delete/${deleteId}`, {
        headers: { authorization: `Bearer ${tokenInfo.token}` },
      });

      // Update state to remove deleted blog from UI
      setApiData((prevData) => prevData.filter((blog) => blog._id !== deleteId));

      // Close warning card
      setDeleteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {apiData.length > 0 ? (
        apiData.map((e, index) => (
          <div
            className="relative max-w-md w-full lg:max-w-2xl flex flex-col lg:flex-row rounded-xl shadow-lg overflow-hidden border-red-300 shadow-md bg-red-50 hover:bg-red-100 border-2 transition-all duration-300"
            key={index}
          >
            {/* Delete Button */}
            {userInfo.role === "admin" && (
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                onClick={() => setDeleteId(e._id)}
              >
                &times;
              </button>
            )}

            {/* Image Part */}
            <div
              className="h-48 lg:h-auto lg:w-48 flex-none bg-cover bg-center"
              style={{ backgroundImage: `url(${e?.images[0]})` }}
              title="blog image"
            />

            {/* Content */}
            <div
              onClick={() => openblog(e._id)}
              className="flex-1 cursor-pointer rounded-xl p-6 flex flex-col justify-between transition-all duration-300"
            >
              <h2 className="text-gray-900 font-bold text-xl mb-2">{e?.heading}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(e?.body) }}
                className="text-gray-700 text-base line-clamp-3"
              />
              <div className="flex items-center mt-4">
                <div className="text-sm">
                  <p className="text-gray-900 font-semibold">{e?.location}</p>
                  <p className="text-gray-600 text-xs">{new Date(e?.dateTime).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Floating Warning Card */}
            {deleteId === e._id && (
              <div className="absolute top-10 right-2 bg-white shadow-lg border border-gray-300 rounded-lg p-4 w-64 z-10">
                <h2 className="text-sm font-bold text-gray-800">Confirm Deletion</h2>
                <p className="text-xs text-gray-600 mt-1">Are you sure you want to delete this blog?</p>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    className="bg-gray-300 text-gray-700 px-3 py-1 text-xs rounded-md"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 text-xs rounded-md hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};
