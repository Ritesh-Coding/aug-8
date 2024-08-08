import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form,FormikHelpers } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../utils/InputField';
import SelectField from '../../../utils/SelectField';
import Swal from 'sweetalert2';
import { Pagination } from '../../../hooks/usePaginationRange';
import LeavesDeatils from '../../../utils/LeavesDeatils';
import axios from 'axios';
interface RequestedLeaveFormat{
      id?: number,
      date : string,
      leave_day_type : string, 
      reason : string
      type:string
      api?: string    
}

interface ApiErrorResponse {
  non_field_errors: string;
}
const UpdateLeave : React.FC = () => {
  const [requestedLeave, setRequestedLeave] = useState<RequestedLeaveFormat[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [requestStatus,setRequestStatus] = useState<string>("")
  const [startDate,setStartDate] = useState<string>("")
  const [endDate,setEndDate]= useState<string>("")
  const [selectedLeave, setSelectedLeave] = useState<RequestedLeaveFormat | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const rowsPerPage : number= 1;
  const axiosInstance = useAxios();
  const [isUpdated,setIsUpdated]=useState<boolean>(false)
   
  function myFunction() {
    const startDateElement = document.getElementById("startDate") as HTMLInputElement | null;
    const endDateElement = document.getElementById("endDate") as HTMLInputElement | null;
    if (startDateElement && endDateElement) {
      const startDate = startDateElement.value;
      const endDate = endDateElement.value;

      if (startDate && endDate) {
        setStartDate(startDate);
        setEndDate(endDate);
        setCurrentPage(1);
      }
    }    
  }  

  const fetchRequestedLeaveData=(page : number,status : string,start_date : string,end_date : string)=>{
    axiosInstance.get(`/leave`,{
      params :{
        page,
        status,
        start_date,
        end_date
      }
    }).then((res)=>{
      console.log("these is my result",res.data)
      setIsUpdated(false)
      setRequestedLeave(res.data["results"]);
      if (res.data.count === 0){
        setTotalPages(1);
      }
      else{
      setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    })
  }

  useEffect(() => {
    fetchRequestedLeaveData(currentPage,requestStatus,startDate,endDate)
  }, [currentPage,requestStatus,startDate,endDate,isUpdated]);

  const handleUpdate = (leave : RequestedLeaveFormat) => {
    setSelectedLeave(leave);
    setShowUpdateModal(true);
  };

  const handleDelete = (leave : RequestedLeaveFormat) => {
    setSelectedLeave(leave);
    setShowDeleteModal(true);
  };

  const handleUpdateSubmit = async (values : RequestedLeaveFormat, { setSubmitting, setErrors } : FormikHelpers<RequestedLeaveFormat>) => {
    try {
      await axiosInstance.put(`/leave/${selectedLeave!.id}/`, values);
      setShowUpdateModal(false);
      setIsUpdated(true)
      // setRequestedLeave((prev) =>
      //   prev.map((leave) => (leave.id === selectedLeave.id ? { ...leave, ...values } : leave))
      // );
      Swal.fire('Success!', 'Leave Request is Updated Successfully!', 'success');
    } catch (err) {
      if(axios.isAxiosError(err) && err.response){
        const apiError = err.response.data as ApiErrorResponse;
        if (apiError.non_field_errors) {
          setErrors({ api: apiError.non_field_errors[0] });
        } else {
          setErrors({ api: 'An error occurred.' });
        }
      }
    
    } finally {
      setSubmitting(false);
    }
  };
  const handleInputChange=(event : any)=>{
    setRequestStatus(event.target.value)    
    setCurrentPage(1)  
  }
  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`/leave/${selectedLeave!.id}/`);
      setShowDeleteModal(false);
      setIsUpdated(true)
      // setRequestedLeave((prev) => prev.filter((leave) => leave.id !== selectedLeave.id));
    } catch (err) {
      console.error(err);
    }
  };

  const validationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    type: Yup.string().required('Type is required'),
    leave_day_type: Yup.string().required('Leave day type is required'),
    reason: Yup.string().required('Reason is required'),
  });

  const leaveChoices = [
    { value: 'PL', label: 'PL' },
    { value: 'SL', label: 'SL' },
    { value: 'CL', label: 'CL' },
  ];

  const leaveDayTypes = [
    { value: 'Full_Day', label: 'Full Day' },
    { value: 'First_Half', label: 'First Half' },
    { value: 'Last_Half', label: 'Last Half' },
  ];
  const handlePageChange = (page : number)=>{
    setCurrentPage(page)
   }

 
  return (
    <div style={{ marginLeft: '260px' }}>
      <LeavesDeatils />
      <div style={{float:`right`}}>
    <Button>
        <input type="date" id="startDate" onChange={myFunction}></input>
    </Button>
    <Button>
    <input type="date" id="endDate" onChange={myFunction}></input>
    </Button> 

    </div>    
      <select className="form-select form-select mb-3" aria-label=".form-select-lg example"
                 id="statusDropDown"  onChange={handleInputChange}>
                      <option selected value="">Select Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
      </select>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Leave Day Type</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {requestedLeave.length > 0 ? (requestedLeave.map((leave) => (
            <tr key={leave.id}>
              <th scope="row">{leave.date}</th>
              <td>{leave.type}</td>
              <td>{leave.leave_day_type}</td>
              <td>
                <Button variant="primary" onClick={() => handleUpdate(leave)}>
                  Update
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(leave)}>
                  Delete
                </Button>
              </td>
            </tr>)
          )): (
            <tr>
            <td >No leave data available</td>
          </tr>
          )}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <Formik
              initialValues={{
                date: selectedLeave.date,
                type: selectedLeave.type,
                leave_day_type: selectedLeave.leave_day_type,
                reason: selectedLeave.reason,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateSubmit}
            >
              {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                <Form>
                  {errors.api && <p className="text-danger">{errors.api}</p>}
                  <InputField
                    label="Date"
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Date"
                    isInvalid={touched.date && !!errors.date}
                    error={errors.date}
                  />
                  <SelectField
                    label="Leave Type"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={leaveChoices}
                    isInvalid={touched.type && !!errors.type}
                    error={errors.type}
                  />
                  <SelectField
                    label="Leave Day Type"
                    name="leave_day_type"
                    value={values.leave_day_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={leaveDayTypes}
                    isInvalid={touched.leave_day_type && !!errors.leave_day_type}
                    error={errors.leave_day_type}
                  />
                  <InputField
                    label="Reason"
                    type="text"
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Reason"
                    isInvalid={touched.reason && !!errors.reason}
                    error={errors.reason}
                  />
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this leave?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdateLeave;
