import axios from "axios";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

function AdminPage(){

  const [search, setsearch] = useState("");
    const[sortcol, setsortcol] = useState<string | null>(null);
    const [sortorder, setsortorder] = useState("Asc");
    const [records, setrecords] = useState<any[]>([]);
    const [selectedmonth, setselectedmonth] = useState(0);

    const navigate = useNavigate();

    const paymentOpen = (receipt: any) => {
      navigate("/receipt", {replace: true, state: {receipt}});
    };


  useEffect(() => {
    const fetchedRecords = async() => {
      try{
        const response = await axios.get(`${BACKEND_URL}/admin/getall`,{
          withCredentials: true
        });
        //console.log(response.data.DatatoSend);
        if (Array.isArray(response.data.DatatoSend)) {
          //console.log("ddd");
          setrecords(response.data.DatatoSend); 
        }
        //console.log(records);
        //setrecords(response.data);
      }
      catch(e){
        console.log(e);
      }
    };
    fetchedRecords();
  }, []);
    

    const handlemonthsort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setselectedmonth(parseInt(event.target.value));
    };

    const filteredusers = records.filter((user) => user.monthstatus[selectedmonth]);

    const handlesearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setsearch(event.target.value);
      };
    
      const filteredRecords = records.filter((res: { shopName?: string; }) => res.shopName &&
        res.shopName.toLowerCase().includes(search.toLowerCase())
      );
    
      //sort in onclick name
      const handlesort = (column: string) => {
        const order = sortcol === column && sortorder === "Asc" ? "Desc" : "Asc";
        setsortcol(column);
        setsortorder(order);
    
        const sortedData = [...filteredRecords].sort((a, b) => {
          const aValue = a[column as keyof typeof a];
          const bValue = b[column as keyof typeof b];
          return order === "Asc"
            ? aValue > bValue
              ? 1
              : -1
            : aValue < bValue
            ? 1
            : -1;
        });
        setrecords(sortedData);
    };
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Records List</h1>
      <div className="flex gap-4 my-4">
        <Card className="p-4 flex-1 text-center">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-xl font-bold">123</p>
        </Card>
        {/* <Card className="p-4 flex-1 text-center">
          <h2 className="text-lg font-semibold">Confirmed</h2>
          <p className="text-xl font-bold">123</p>
        </Card> */}
        <Card className="p-4 flex-1 text-center">
          <h2 className="text-lg font-semibold">Completed</h2>
          <p className="text-xl font-bold">146</p>
        </Card>
      </div>
      <div className="flex items-center space-x-4">
      <Input
        type="text"
        placeholder="Search Record"
        value={search}
        onChange={handlesearch}
        className="mb-4 p-2 border rounded"
      />
      <div className="flex items-center space-x-1">
      <label>Select Month</label>
      <select value={selectedmonth} onChange={handlemonthsort} className="p-2 border rounded">
        {
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))
        }
      </select>
      </div>
      </div>
      
      {filteredusers.length >= 0 ? (
      <Table className="w-full mt-4 border-collapse">
      <Thead>
        <Tr className="bg-gray-200">
          <Th className="p-2">No.</Th>
          <Th className="p-2">Username</Th>
          <Th className="p-2">Shop Name</Th>
          <Th className="p-2">Payment Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {filteredusers.map((user, index) => (
          <tr key={user._id} className="border-b">
            <td className="p-2">{index + 1}</td>
            <td className="p-2">{user.username}</td>
            <td className="p-2">{user.shopName}</td>
            <td className="p-2 text-green-600 font-semibold hover:text-green-500 cursor-pointer" onClick={() => paymentOpen(user.receipt)}>{user.receipt}</td>
          </tr>
        ))}
      </Tbody>
    </Table>
      ) : (
        <Table className="w-full mt-4">
        <Thead>
          <Tr>
            <Th onClick={() => handlesort("id")}>No.</Th>
            <Th onClick={() => handlesort("shop name")}>Shop Name</Th>
            <Th onClick={() => handlesort("rent")}>Rent</Th>
            <Th onClick={() => handlesort("address")}>Address</Th>
            <Th onClick={() => handlesort("owner")}>Owner</Th>
            <Th onClick={() => handlesort("mobile")}>Mobile No.</Th>
            <Th onClick={() => handlesort("payment")}>Payment</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredRecords.map((res, index) => (
            <Tr key={res.id || index}>
              <Td>{index + 1}</Td>
              <Td>{res.shopName}</Td>
              <Td>{res.currentRent}</Td>
              <Td>{res.address}</Td>
              <Td>{res.username}</Td>
              <Td>{res.contact}</Td>
              <td onClick={() => {
                if(res.receipt){
                  paymentOpen(res.receipt)
                }
              }} className={res.receipt ? "text-green-600 font-semibold cursor-pointer hover:text-green-500" : "text-red-600 font-semibold"}>{res.receipt ? res.receipt : "Not Paid"}</td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      )}
      
        </div>
    )
}

interface CardProps {
    children: ReactNode;
    className?: string;
  }

function Card({ children, className}: CardProps){
    return(
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
    );
}

// interface ButtonProps {
//     children: ReactNode;
//     onClick?: () => void;
//     className?: string;
//   }

// function Butoon({ children, onClick, className}: ButtonProps){
//     return (
//         <button
//           onClick={onClick}
//           className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${className}`}
//         >
//           {children}
//         </button>
//       );
// }

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }

function Input({ type = "text", placeholder, value, onChange, className}: InputProps){
    return (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 ${className}`}
        />
      );
}

interface TableProps {
    children: ReactNode;
    className?: string;
  }
  
   function Table({ children, className }: TableProps) {
    return <table className={`w-full border-collapse ${className}`}>{children}</table>;
  }

  interface TheadProps {
    children: ReactNode;
    className?: string;
  }
  
   function Thead({ children, className }: TheadProps) {
    return <thead className={`bg-gray-200 ${className}`}>{children}</thead>;
  }

  interface TbodyProps {
    children: ReactNode;
    className?: string;
  }
  
   function Tbody({ children, className }: TbodyProps) {
    return <tbody className={className}>{children}</tbody>;
  }

  interface TrProps {
    children: ReactNode;
    className?: string;
  }
  
   function Tr({ children, className }: TrProps) {
    return <tr className={`border-b hover:bg-gray-100 ${className}`}>{children}</tr>;
  }
  

  interface ThProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
  }
  
   function Th({ children, onClick, className }: ThProps) {
    return (
      <th
        onClick={onClick}
        className={`p-2 text-left cursor-pointer select-none font-semibold ${className}`}
      >
        {children}
      </th>
    );
  }

  interface TdProps {
    children: ReactNode;
    className?: string;
  }
  
   function Td({ children, className }: TdProps) {
    return <td className={`p-2 ${className}`}>{children}</td>;
  }

export default AdminPage;