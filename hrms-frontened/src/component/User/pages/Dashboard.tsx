import React, { Fragment, useCallback, useEffect ,useState} from "react";
import "./page.css";
import 'bootstrap/dist/css/bootstrap.css';

import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button';
import AllEmployeeActivities from "../UI/AllEmployeeActivitiesApi";
import useAxios from "../../../hooks/useAxios";
import Card from "../../../utils/Card";
import DailyLogsApi from "../UI/DailyLogsApi";
import { useDispatch, useSelector } from 'react-redux';
import { navbarTitle } from '../../../reducers/authReducer';
import DateTime from "../../../utils/DateTime";
import Holidays from "../UI/Holidays";
import BirthDays from "../UI/BirthDays";
import DashboardAttendance from "../UI/DashboardAttendance";
// import Chat from "../UI/Chat";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import refresh from "../../../assets/refresh.png"

import { RootState } from "../../../types";

const Dashboard : React.FC= () => {
  const [searchQuery, setSearchQuery] =useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(true);
 
  const dispatch = useDispatch();
  dispatch( navbarTitle({navTitle: "DashBoard"}));
  const axiosInstance = useAxios();
  const [employeeStatus,setEmployeeStatus]= useState<string>("blank")
  const [isStatusChanged,setIsStatusChanges]= useState<string>("")
  const  [refreshCount,setRefreshCount]= useState<number>(0)
  
  const  handleAllEmployeeLogsRefresh = ()=>{    
    setRefreshCount(refreshCount+1)   
  }
 let timer : ReturnType<typeof setTimeout>;;
 const handleInputChange =(event : React.ChangeEvent<HTMLInputElement>)=>{
  if (timer) clearTimeout(timer);
  setTimeout(()=>{
    setSearchQuery(event.target.value)  
  },2000)
 }
  useEffect(()=>{
    let lastestStatus:string ="";
    axiosInstance.get('latestEmployeeActivity/').then(
      res=>{       
        const result = res.data  
    
        if(result.length>0){
          let lastResult = result[result.length-1]  
          lastestStatus =  lastResult.status      

          setEmployeeStatus(lastestStatus)  
        }        
        else{          
            setEmployeeStatus("")       
        }
      }  
    )    
    setIsFetching(false); 
  },[isStatusChanged])

  if (isFetching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleEmployeeActivity = (event : any)=>{   
    const value = event.currentTarget.getAttribute("value")
    if(value === "checkIn")
      { 
        axiosInstance.post('checkIn/').then(
          (res)=>{
            const result = res.data
            setIsStatusChanges("checkIn")
            console.log(result)
          }
        )
        
      }
    else if(value === "breakIn")
    {
      Swal.fire({title: 'Are You Really Want To Break In?',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.post('breakIn/').then((res)=>{
            const result = res.data
            setIsStatusChanges("breakIn")
            console.log(result)      
           })} })         
    }
    else if(value === "breakOut")
    {
      Swal.fire({title: 'Are You Really Want To Break Out?',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.post('breakOut/').then((res)=>{
            const result = res.data
            setIsStatusChanges("breakOut")
            console.log(result)
           })
          } })    
    }
    else
    {
      Swal.fire({title: 'Are You Really Want To Check Out?',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        
       axiosInstance.post('checkOut/').then((res)=>{
        const result = res.data
        setIsStatusChanges("Check Out")
        console.log(result)
       })
        } })      
    }   
  }

  const logsTitle : string = "Logs"
  const logsContent : string = "All Logs"  

  let dateObj : Date = new Date();

  let month = String(dateObj.getMonth() + 1)
      .padStart(2, '0');
      
  let day = String(dateObj.getDate())
      .padStart(2, '0');
  
  let year = dateObj.getFullYear();
  let todayDate = day + '/' + month + '/' + year; 
 
  let buttonList:any=``;
  switch(employeeStatus)
  {
    case "Check In":
      buttonList = <div className="innerButton">
        <Button variant="primary" disabled value="checkIn" onClick={handleEmployeeActivity}> checkIn</Button>
              <Button variant="warning"  value="breakIn" onClick={handleEmployeeActivity}> BreakIn</Button>
              <br></br>
              <Button variant="info" disabled value="breakOut" onClick={handleEmployeeActivity}> BreakOut </Button>
              <Button variant="danger"  value="checkOut" onClick={handleEmployeeActivity}> checkOut</Button>
        </div>    
      break    
    
    case "Break In":
      buttonList = <div className="innerButton">
        <Button variant="primary" disabled value="checkIn" onClick={handleEmployeeActivity}> checkIn</Button>
              <Button variant="warning" disabled value="breakIn" onClick={handleEmployeeActivity}> BreakIn</Button>
              <br></br>
              <Button variant="info" value="breakOut" onClick={handleEmployeeActivity}> BreakOut </Button>
              <Button variant="danger" disabled value="checkOut" onClick={handleEmployeeActivity}> checkOut</Button>
        </div>    
      break

    case "Break Out":
      buttonList = <div className="innerButton">
        <Button variant="primary" disabled value="checkIn" onClick={handleEmployeeActivity}> checkIn</Button>
              <Button variant="warning" value="breakIn" onClick={handleEmployeeActivity}> BreakIn</Button>
              <br></br>
              <Button variant="info" disabled value="breakOut" onClick={handleEmployeeActivity}> BreakOut </Button>
              <Button variant="danger"  value="checkOut" onClick={handleEmployeeActivity}> checkOut</Button>
              
      </div>
      break

      case "Check Out":
        buttonList = <div className="innerButton">
          <Button variant="primary" disabled value="checkIn" onClick={handleEmployeeActivity}> checkIn</Button>
                <Button variant="warning" disabled value="breakIn" onClick={handleEmployeeActivity}> BreakIn</Button>
                <br></br>
                <Button variant="info"  disabled value="breakOut" onClick={handleEmployeeActivity}> BreakOut </Button>
                <Button variant="danger" disabled value="checkOut" onClick={handleEmployeeActivity}> checkOut</Button>                
        </div>
        break

      default:       
      buttonList = <div className="innerButton">
      <Button variant="primary"  value="checkIn" onClick={handleEmployeeActivity}> checkIn</Button>
              <Button variant="warning" disabled value="breakIn" onClick={handleEmployeeActivity}> BreakIn</Button>
              <br></br>
              <Button variant="info" disabled  value="breakOut" onClick={handleEmployeeActivity}> BreakOut </Button>
              <Button variant="danger" disabled value="checkOut" onClick={handleEmployeeActivity}> checkOut</Button>
              </div>      
      break   
  }      
  return (
    <>
      <div className="dashBoardrow">
      <div className="dashBoardcol1">
        <div className="cardDashboard"         
        > 
          <DashboardAttendance />
          <Card title = {logsTitle} content ={logsContent}/>         
        </div>
        <div  className="cardDashboard"        
        >
          <BirthDays />
          <Holidays />          
        </div>
        <div
        >
          <div           
            style={{ marginLeft: `70px` ,display: `flex` ,marginTop:`40px`}}
          >       
          <div className="e-card-header-title employeeActivities">
            Todays Employee Activity
                 
                  <input className="inputElement"                   
                    type="text"            
                    onChange={handleInputChange} 
                    placeholder="search Name"
                 />                 
                 
                <img src={refresh} onClick={handleAllEmployeeLogsRefresh} alt="Refresh"/>                   
                               
              <div className="e-card-content" style={{marginTop:`5px`}}>              
               <AllEmployeeActivities  refresh={refreshCount} inputValue={searchQuery}/>                     
              </div>
              </div> 
            
          </div>
        </div>
      </div>

      <div className="dashboardcol2 cardBorder">       
          <div
            className="e-card e-card-horizontal"
            style={{ marginLeft: `50px` }}
          >     
            
              <div className="e-card-header-title">Today's Action</div>              
               
              <div style={{                   
                    display: `flex`,
                    flexDirection: `row`,                    
                  }}>
                      <div style={{padding : `8px`}}>Ip Address  <p>103.215.154.12</p></div>    
                      <div style={{padding : `8px`}}>Current Date <p>{todayDate}</p></div>         
              </div>            
              <div className="dateTime">
                  <div>Current Time</div> 
              <div>{<DateTime/>}</div>
              </div>           
              
              <div className="buttonList">
              {buttonList}
              </div>           
              <div className="e-card-header-title"><h3>Attendance</h3></div>
                
              <div className="e-card-content dailyLogs">                
                <DailyLogsApi status={isStatusChanged}/>
              </div>     

            <h4>Add Your Comment</h4>
            {/* <EmployeeChat recipientId="2"/> */}

          </div>
        </div>     
    </div>
    </>
  );
};

export default Dashboard;
