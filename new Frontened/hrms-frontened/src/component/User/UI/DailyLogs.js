import React from 'react'
import "../pages/page.css"
const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit'}
    return new Date(dateString).toLocaleString(undefined, options)
  }
const DailyLogs = (props) => {
   
    return (
        <div>
            {props.checkIn  &&   <p className='dailyEmployeeLogCheckIn'>Check In Time : {formatDate(props.checkIn)} </p>}
            
            {props.breaks  && props.breaks.length>0 && (props.breaks.map((brk,index)=>(
                <div key={index}>
                    {brk.breakIn && <p className='dailyEmployeeLogBreakIn'>BreakIn : {formatDate(brk.breakIn)}</p>}
                    {brk.breakOut && <p className='dailyEmployeeLogBreakOut'>BreakOut : {formatDate(brk.breakOut)}</p>}
                </div>
            )))
            }
            {props.checkOut &&  <p className='dailyEmployeeLogCheckOut'>Check Out Time : {formatDate(props.checkOut)}</p>}      
        </div>
      )
}

export default DailyLogs