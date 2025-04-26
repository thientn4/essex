import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

let properties=[]
function App() {
  const [propertiesDisplay,setPropertiesDisplay] = useState([]);
  const [property,setProperty] = useState(null);
  const [newOccupiedSpaceCount,setNewOccupiedSpaceCount] = useState(null);
  const [newTotalSpaceCount,setNewTotalSpaceCount] = useState(null);
  const [newParking,setNewParking] = useState(null);
  const [newEvCharger,setNewEvCharger] = useState(null);
  const [newRedevelopmentOpportunities,setNewRedevelopmentOpportunities] = useState(null);
  const load = async ()=>{
    await axios({
      url:'http://localhost:3002/getProperties',
      method:'GET',
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response)=>{
      if(response.data.status==='success'){
        properties=response.data.properties
        // deliveries.sort((a,b)=>{
        //   const a_score=
        //     (a.phoneNum?1:0)+
        //     (a.acceptTime?1:0)+
        //     (a.podTime?1:0)
        //   const b_score=
        //     (b.phoneNum?1:0)+
        //     (b.acceptTime?1:0)+
        //     (b.podTime?1:0)
        //   return a_score-b_score
        // })
        setPropertiesDisplay(properties)
        // filtered=deliveries
        // setQuery("")
        // window.scrollTo({ top: 0 });
      }else{
        alert("Error loading properties")
      }
    }).catch((error)=>{
      alert("Error loading properties")
    })
  }
  const update = async (inProperty)=>{
    if(inProperty.occupiedSpaceCount>inProperty.totalSpaceCount){
      alert("Invalid occupancy rate")
      return
    }
    await axios({
      url:'http://localhost:3002/updateProperty',
      method:'POST',
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      },
      data:JSON.stringify(inProperty)
    }).then((response)=>{
      if(response.data.status==='success'){
        alert("Updated property successfully")
        setNewOccupiedSpaceCount("")
        setNewTotalSpaceCount("")
        setNewParking("")
        setNewEvCharger("")
        setNewRedevelopmentOpportunities("")
        setProperty(inProperty)
        load()
      }else{
        alert("Error updating property")
      }
    }).catch((error)=>{
      alert("Error updating property")
    })
  }
  const styles={
    page:{
      width: '100vw',
      height: '100svh',
      display:'flex',
      flexDirection:'row'
    },
    map:{
      flex:1
    },
    column:{
      width:'3in',
      height:'100%',
      backgroundColor:'grey',
      display:'flex',
      flexDirection:'column'
    },
    search:{
      margin:'0.08in',
      borderRadius:'0.05in',
      border: 0,
      outline: 'none',
      fontSize:'0.2in',
      textAlign:'center'
    },
    properties:{
      flex:1,
      overflowY: 'auto',
      backgroundColor: 'rgb(169,169,169)'
    },
    property:{
      borderRadius:'0.05in',
      backgroundColor:'white',
      margin:'0.08in',
      padding:'0.08in',
      userSelect:'none'
    },
    occupancyRate:{
      display:'flex',
      flexDirection:'row'
    },
    inputRow:{
      display:'flex', 
      flexDirection:'row',
      width:'100%',
      justifyContent:'space-between',
      marginTop:'0.2in'
    },
    input:{
      width:'0.5in'
    },
    textArea:{
      resize:'none', 
      marginTop:'0.1in', 
      width:'100%', 
      boxSizing:'border-box',
      height:'1in'
    },
    button:{
      backgroundColor:'green',
      color:'white',
      borderRadius:'0.05in',
      border: 0,
      marginTop:'0.1in', 
      padding:'0.04in',
      outline: 'none',
      fontSize:'0.2in',
      textAlign:'center',
    }
  }
  useEffect(() => {
    load()
  }, []);
  return (
    <div style={styles.page}>
      <div style={styles.column}>
        <input
          style={styles.search}
          placeholder="search"
          onChange={(e)=>{
            if(e.target.value.length>0){
              setPropertiesDisplay(properties.filter((property)=>
                (`(${property.yearBuilt}) ${property.propertyAddress}, ${property.city}, ${property.county}, ${property.state}, ${property.zip}`)
                .toLowerCase().includes(e.target.value.toLowerCase())
              ))
            }else{
              setPropertiesDisplay(properties)
            }
          }}
        />
        <div style={styles.properties}>
          {propertiesDisplay.map((property,index)=>(
            <div style={styles.property} onClick={()=>{setProperty(property)}}>
              <b>{`(${property.yearBuilt}) `}</b>
              {`${property.propertyAddress}, ${property.city}, ${property.county}, ${property.state}, ${property.zip}`}
            </div>
          ))}
        </div>
      </div>
      <div style={styles.map}>
      </div>
      {property && <div style={styles.column}>
          <div style={styles.property}>
            <b>{`(${property.yearBuilt}) `}</b>
            {`${property.propertyAddress}, ${property.city}, ${property.county}, ${property.state}, ${property.zip}`}
            <div style={{width:'100%'}}>
              <div style={styles.inputRow}>
                Occupied:
                <div style={styles.occupancyRate}>
                  <input style={styles.input} placeholder={property.occupiedSpaceCount||0} onChange={(e)=>{setNewOccupiedSpaceCount(e.target.value.replace(/[^0-9]/g, ""))}} value={newOccupiedSpaceCount}/>
                  <div>&nbsp;/&nbsp;</div>
                  <input style={styles.input} placeholder={property.totalSpaceCount||0} onChange={(e)=>{setNewTotalSpaceCount(e.target.value.replace(/[^0-9]/g, ""))}} value={newTotalSpaceCount}/>
                </div>
              </div>
              <div style={styles.inputRow}>
                # Parking:
                <input style={styles.input} placeholder={property.parking||0} onChange={(e)=>{setNewParking(e.target.value.replace(/[^0-9]/g, ""))}} value={newParking}/>
              </div>
              <div style={styles.inputRow}>
                # EV charger:
                <input style={styles.input} placeholder={property.evCharger||0} onChange={(e)=>{setNewEvCharger(e.target.value.replace(/[^0-9]/g, ""))}} value={newEvCharger}/>
              </div>
              <div style={styles.inputRow}></div>
              Redevelopment opportunities:
              <textarea style={styles.textArea} placeholder={property.redevelopmentOpportunities} onChange={(e)=>{setNewRedevelopmentOpportunities(e.target.value)}} value={newRedevelopmentOpportunities}></textarea>
              {
                (newOccupiedSpaceCount || newTotalSpaceCount || newParking || newEvCharger || newRedevelopmentOpportunities)
                && <div style={styles.button} onClick={()=>{update({
                  occupiedSpaceCount: parseInt(newOccupiedSpaceCount)||property.occupiedSpaceCount,
                  totalSpaceCount: parseInt(newTotalSpaceCount)||property.totalSpaceCount,
                  parking: parseInt(newParking)||property.parking,
                  evCharger: parseInt(newEvCharger)||property.evCharger,
                  redevelopmentOpportunities: newRedevelopmentOpportunities||property.redevelopmentOpportunities,
                  propertyAddress: property.propertyAddress,
                  city: property.city,
                  state: property.state,
                  zip: property.zip,
                  county: property.county,
                  yearBuilt:property.yearBuilt
                })}}>Update</div>
              }
            </div>
          </div>
      </div>}
    </div>
  );
}

export default App;
