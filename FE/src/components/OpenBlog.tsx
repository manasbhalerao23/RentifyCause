import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";

export const OpenBlog = () => {
  const [body, setBody] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [heading, setHeading] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [rcpt, setRcpt] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const { blogId } = useParams();
  const [num, setNum] = useState<number>();
  const [collections, setcollections] = useState({});
  const [isAdmin, setisAdmin] = useState(false);
  const tokenInfo = useSelector((store: RootState) => store.auth);

  const navigate = useNavigate();

  const AdminShowData = async() => {
    try{
      const res = await axios.get(`${BACKEND_URL}/blog/collection?blog_id=${blogId}` ,{
        headers: { authorization: `Bearer ${tokenInfo.token}` },
      });
      console.log(res);
      if(res) setisAdmin(true);
      setcollections(res.data.resp);
    }
    catch(e){
      console.log(e);
    }
  }

  const fetchblog = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/blog/open/${blogId}`,{ headers: { authorization: `Bearer ${tokenInfo.token}` } });
      // console.log(res.data);
      const { body, dateTime, heading, images: fetched, location } = res.data;

      setBody(body);
      setDateTime(dateTime);
      setHeading(heading);
      setImages(fetched);
      setLocation(location);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (tokenInfo.token) {
      fetchblog();
      AdminShowData();
    }
  }, [tokenInfo.token]);

  const handleDonation = async () => {
    try {
      if (num === 0) {
        alert("Please select number of Months");
        return;
      }
      console.log(tokenInfo);
      const order = await axios.post(
        `${BACKEND_URL}/payment/create/donate/${blogId}`,
        { num: num },
        { headers: { authorization: `Bearer ${tokenInfo.token}` } }
      );

      const { amount, currency, orderId, keyId, notes } = order.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Red Cross Society Rent Payment",
        description: "Rent Transaction",
        order_id: orderId,
        prefill: {
          name: notes.username,
          email: notes.email,
          contact: notes.contact,
        },
        theme: { color: "#F37254" },
      };

      setOrderInfo(order.data.orderId);
      setRcpt(order.data.receiptId);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 p-4 lg:p-6">

      {isAdmin && (<div className="absolute z-20 right-0">
        <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105" onClick={() => navigate('/collections', { state: {collections}})}>
          View Collections
          </button>
      </div>)}
      {/* Image Slider */}
      <div className="w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="w-full max-h-72 md:max-h-96 rounded-lg"
        >
          {images.map((e, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={e}
                alt={`Blog Image ${idx}`}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Blog Content */}
      <div className="w-full">
        <div className="border-2 border-red-300 bg-red-50 rounded-xl p-6 flex flex-col justify-between shadow-md transition-all duration-300 hover:bg-red-100">
          <div>
            <h2 className="text-gray-900 font-bold text-xl mb-3">{heading}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
              className="text-gray-700 text-sm md:text-base"
            />
          </div>

          {/* Location and Date */}
          <div className="mt-4 flex flex-col">
            <p className="text-gray-900 font-semibold">{location}</p>
            <p className="text-gray-600">{dateTime.toLocaleString().slice(0, 10)}</p>
          </div>

          {/* Donation Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Donate Now!</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
              {[
                10000, 7500, 5000, 2500, 1000, 750, 500, 250, 100, 50
              ].map((info, index) => (
                <div
                  key={index}
                  className={`p-2 md:p-3 rounded-md text-center shadow-md font-medium text-sm md:text-base cursor-pointer ${
                    num === index
                      ? "bg-green-300 border-2 border-blue-600"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setNum(index)}
                >
                  {info}
                </div>
              ))}
            </div>

            <button
              onClick={handleDonation}
              className="mt-6 w-full md:w-auto p-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-500 transition"
            >
              Donate
            </button>

            <p className="text-sm md:text-lg font-semibold mt-2">
              Order ID: {orderInfo || "N/A"}
            </p>
            <p className="text-sm md:text-lg font-semibold">Receipt ID: {rcpt || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
