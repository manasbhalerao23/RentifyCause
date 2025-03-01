import { ChangeEvent, ReactNode, useState } from "react";

function AdminPage(){
    // const Records = ; from BE
    //sample data
    const reservationsData = [
        {
          id: 1,
          shop_name: "mnnc",
          rent: "5253",
          address: "ajbcau",
          owner: "ajbwec",
          mobile: "+652522359",
          payment: "24200"
        },
        {
            id: 2,
            shop_name: "mnnsvsc",
            rent: "3525",
            address: "ajwgsu",
            owner: "gwgsec",
            mobile: "+6012636789",
            payment: "24567"
        },
      ];
    
    const [search, setsearch] = useState("");
    const[sortcol, setsortcol] = useState<string | null>(null);
    const [sortorder, setsortorder] = useState("Asc");
    const [records, setrecords] = useState(reservationsData);//BE data go here

    const handlesearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setsearch(event.target.value);
      };
    
      const filteredRecords = records.filter((res: { shop_name: string; }) =>
        res.shop_name.toLowerCase().includes(search.toLowerCase())
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
        <Card className="p-4 flex-1 text-center">
          <h2 className="text-lg font-semibold">Confirmed</h2>
          <p className="text-xl font-bold">123</p>
        </Card>
        <Card className="p-4 flex-1 text-center">
          <h2 className="text-lg font-semibold">Completed</h2>
          <p className="text-xl font-bold">146</p>
        </Card>
      </div>
      <Input
        type="text"
        placeholder="Search Record"
        value={search}
        onChange={handlesearch}
        className="mb-4 w-full p-2 border rounded"
      />
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
            <Tr key={res.id}>
              <Td>{index + 1}</Td>
              <Td>{res.shop_name}</Td>
              <Td>{res.rent}</Td>
              <Td>{res.address}</Td>
              <Td>{res.owner}</Td>
              <Td>{res.mobile}</Td>
              <Td className="text-green-600 font-semibold">{res.payment}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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