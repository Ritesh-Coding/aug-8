import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import { Button, Modal } from 'react-bootstrap';

import { Pagination } from '../../../hooks/usePaginationRange';
import { Link } from 'react-router-dom';
import { navbarTitle } from '../../../reducers/authReducer';
import { useDispatch } from 'react-redux';

const AllAttendance = () => {
const [employee, setEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedemployee, setSelectedemployee] = useState(null);
  const [refresh,setRefresh]=useState(0)
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  dispatch(navbarTitle({ navTitle: "Attendance" }));
  const [name,setName]= useState("")
  const rowsPerPage =5;
  const handlePageChange = (page)=>{
    setCurrentPage(page)
   }

   const handleNameChange=(event)=>{
    setName(event.target.value)
}
const fetchAllEmployees=(page,name)=>{
    
    axiosInstance.get(`api/employees/`,{
      params:{
        page,
        name
      }
    }
    ).then((res) => {
      setEmployee(res.data["results"]);
      if (res.data.count === 0){
        setTotalPages(1);
      }
      else{
      setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    }); 
  }
  useEffect(() => {
    fetchAllEmployees(currentPage,name) 
  }, [refresh,currentPage,name]);

  return (
    <div style={{ marginLeft: '260px' }}>
    <Button style={{float:`right`}}>
   <input type="text" onChange={handleNameChange} placeholder='Search Employee Name'></input>
 </Button>
   <table className="table">
     <thead>
       <tr>
         <th scope="col">Id</th>
         <th scope="col">UserName</th>
         <th scope="col">First Name</th>
         <th scope="col">Email</th>
         <th scope="col">Update</th>
     
       </tr>
     </thead>
     <tbody>
       {employee.length>0  && employee.map((employee) => (
         <tr key={employee.id}>
           <th scope="row">{employee.id}</th>
           <td>{employee.username}</td>
           <td>{employee.first_name}</td>
           <td>{employee.email}</td>
           <td>
           {<Link to={`/dashboard/attendance/${employee.id}`}>
             <Button>Attendance Report</Button>
           </Link>}
           </td>
           
         </tr>
       ))}
     </tbody>
   </table>
   <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
  

 </div>
   

);
};
export default AllAttendance