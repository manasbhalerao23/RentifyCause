import axios from 'axios';
import { useEffect, useState } from 'react'
import DOMPurify from "dompurify";
import { BlogData } from '../Types';

export const Cards = () => {
const [apiData,setApiData]=useState<BlogData>();
const getData= async ()=>{
    try{
        const res= await axios.get("http://localhost:4000/blog/all")
        console.log(res);
        setApiData(res?.data);
        
            }catch(err){
                console.log(err);
                
            }
}

useEffect(()=>{
  getData();
},[])



  return (
    <div>
{
    apiData ? (

        apiData.map((e,index)=>{
            return(
                <div className="max-w-sm w-full lg:max-w-full lg:flex" key={index}>
                <div
  className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
  style={{ backgroundImage: `url(${e?.images[0]})` }}
  title="Woman holding a mug"
/>

                <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                  <div className="mb-8">
                    {/* <p className="text-sm text-gray-600 flex items-center">
                      <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                      </svg>
                      Members only
                    </p> */}
                    <div className="text-gray-900 font-bold text-xl mb-2">{e?.heading}</div>
                    
                    <div
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(e?.body) }}
  className="text-gray-700 text-base"
/>

                  </div>
                  <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full mr-4" src="../assets/images-1740082952135-530291957.jpg" alt="Avatar of Jonathan Reinink"/>
                    <div className="text-sm">
                      <p className="text-gray-900 leading-none">{e?.location}</p>
                      <p className="text-gray-600">{e?.dateTime}</p>
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
