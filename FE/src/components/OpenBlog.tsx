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

export const OpenBlog = () => {
  const [body, setBody] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [heading, setHeading] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const { blogId } = useParams();

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
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchblog();
  }, []);

  return (
    <div className="grid  grid-cols-[30%_70%] gap-3">
      <div className="w-full">
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
              <p className="text-gray-600">{dateTime.toString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
