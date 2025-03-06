import axios from "axios";
import { useParams } from "react-router-dom";
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
  const { blogId } = useParams();C
  const [num, setNum]=useState<number>();
  const tokenInfo = useSelector((store: RootState) => store.auth);

  const fetchblog = async () => {

    try {
      const res = await axios.get(`${BACKEND_URL}/blog/open/${blogId}`);
      console.log(res.data);
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
    fetchblog();
  }, []);


  const handleDonation = async () =>{
    try {
      if (num === 0) {
        alert("Please select number of Months");
        return;
      }
      console.log(tokenInfo);
      const order = await axios.post(
        `${BACKEND_URL}/payment/create/donate/${blogId}`,
        { num: num },
        { headers: { authorization: `Bearer ${tokenInfo}` } }
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
        // handler: function () {
        //   gettingNewData(orderId);
        // },
      };
      console.log("ORDER");
      console.log(order);
      setOrderInfo(order.data.orderId);
      setRcpt(order.data.receiptId);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className="grid  grid-cols-[33%_65%] gap-3 p-2 py-5">
      <div className="w-full my-10 ">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {images.map((e, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={e}
                alt={`Blog Image ${idx}`}
                className=" w-full h-64 object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>

      <div className="max-w-sm w-full lg:max-w-full lg:flex">
        
        <div className="cursor-pointer border-red-300 border-2 bg-red-50 rounded-xl p-6 flex flex-col justify-between shadow-md transition-all duration-300 hover:bg-red-100 ">
          <div className="mb-8">
            {/* <p className="text-sm text-gray-600 flex items-center">
                      <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                      </svg>
                      Members only
                    </p> */}
            <div className="text-gray-900 font-bold text-xl mb-2">
              {heading}
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
              className="text-gray-700 text-base"
            />
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{location}</p>
              <p className="text-gray-600">{dateTime.toLocaleString().slice(0,10)}</p>
            </div>
          </div>
          <div className="my-10">
            <div>Donate Now!</div>
         <div className="grid grid-cols-10 gap-4"> {[
                10000,
                7500,
                5000,
                2500,
                1000,
                750,
                500,
                250,
                100,
                50
              ].map((info, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md text-center shadow-md font-medium ${
                      num === index
                        ? "bg-green-300 border-2 border-blue-600"
                        : "bg-gray-200"
                    }`}
                  onClick={() => setNum(index)}

                >
                  {info}
                </div>
              ))}</div>
            <button
              onClick={handleDonation}
              className="mt-6 p-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-500 transition"
            >
              Donate
            </button>
            <p className="text-lg font-semibold">
              Order ID: {orderInfo || "N/A"}
            </p>
            <p className="text-lg font-semibold">Receipt ID: {rcpt || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
