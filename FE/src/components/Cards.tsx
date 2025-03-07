import axios from 'axios';
import { useEffect, useState } from 'react'
import DOMPurify from "dompurify";
import { BlogData } from '../Types';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Utils/store';

export const Cards = () => {
const [apiData,setApiData]=useState<BlogData[]>([]);
const navigate = useNavigate();
const tokenInfo = useSelector((store: RootState) => store.auth);
const getData = async ()=>{
    try{
      //console.log(userInfo);
      
        const res = await axios.get(`${BACKEND_URL}/blog/all`,{ headers: { authorization: `Bearer ${tokenInfo.token}` } });
        //console.log(res);
        //chack for apidata is always an array
        setApiData(Array.isArray(res.data) ? res.data : []);
            }
            catch(err){
                console.log(err);
              }
  }

  const openblog = (Id: string) => {
    try{
      navigate(`/openBlog/${Id}`);
    }
    catch(e){
      console.log(e);
    }
  }

useEffect(()=>{
  getData();
},[tokenInfo.token])




  return (
    <div className='flex flex-wrap justify-center gap-6 p-4'>
{
    apiData ? (

        apiData.map((e,index)=>{
            return(
                <div className="max-w-md w-full lg:max-w-2xl flex flex-col lg:flex-row rounded-xl shadow-lg overflow-hidden border border-red-200 transition-all duration-300" key={index}>
                {/* image part */}
                <div
                  className="h-48 lg:h-auto lg:w-48 flex-none bg-cover bg-center"
                  style={{ backgroundImage: `url(${e?.images[0]})` }}
                  title="blog image"
                />
                {/* Content */}
                <div onClick={() => openblog(e._id)} className="flex-1 cursor-pointer border-red-300 border-2 bg-red-50 rounded-xl p-6 flex flex-col justify-between shadow-md transition-all duration-300 hover:bg-red-100 ">
                  {/* title */}
                  <div>
                    {/* <p className="text-sm text-gray-600 flex items-center">
                      <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                      </svg>
                      Members only
                    </p> */}
                    <h2 className="text-gray-900 font-bold text-xl mb-2">{e?.heading}</h2>
                    
                    <div
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(e?.body) }}
                      className="text-gray-700 text-base line-clamp-3"
                    />

                  </div>
                  {/* Writer info */}
                  <div className="flex items-center mt-4">
                    {/* <img className="w-10 h-10 rounded-full mr-4 border border-red-200" src="../assets/images-1740082952135-530291957.jpg" alt="Avatar of Jonathan Reinink"/> */}
                    <div className="text-sm">
                      <p className="text-gray-900 font-semibold">{e?.location}</p>
                      <p className="text-gray-600 text-xs">{e?.dateTime.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

            )
        })
       

    ) : (
        <div>NO data </div>
    )
}

    </div>
  )
}
