import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'; //document  ===>   https://react-google-maps-api-docs.netlify.app/#googlemap

let properties=[]
let maxChartData=0
function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [propertiesDisplay,setPropertiesDisplay] = useState([]);
  const [property,setProperty] = useState(null);
  const [newOccupiedSpaceCount,setNewOccupiedSpaceCount] = useState(null);
  const [newTotalSpaceCount,setNewTotalSpaceCount] = useState(null);
  const [newParking,setNewParking] = useState(null);
  const [newEvCharger,setNewEvCharger] = useState(null);
  const [newRedevelopmentOpportunities,setNewRedevelopmentOpportunities] = useState(null);
  const [censusData,setCensusData] = useState([[],[]]);
  const [chartData,setChartData] = useState([])
  const [pickedDecade,setPickedDecade] = useState(null)
  const [loading,setLoading] = useState(false)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: undefined
  })
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
        setPropertiesDisplay(properties)
        let decades={}
        properties.map((property)=>{
          let decade=Math.floor(property.yearBuilt/10)*10
          if(!decades[decade])decades[decade]=0
          decades[decade]+=1
          maxChartData=Math.max(maxChartData,decades[decade])
        })
        setChartData(Object.keys(decades).map((decade)=>([parseInt(decade),decades[decade]])).sort((decade)=>(decade[0])))
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
  const getCensus = async (inProperty)=>{
    setLoading(true)
    setCensusData([[],[]])
    await axios({
      url:`http://localhost:3002/getPropertyCensus?street=${inProperty.propertyAddress}&city=${inProperty.city}&state=${inProperty.state}`,
      method:'GET',
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response)=>{
      setCensusData(response.data.census)
      setLoading(false)
    }).catch((error)=>{
      alert("Error getting Census data")
      setLoading(false)
    })
  }
  const styles={
    page:{
      width: '100vw',
      height: '100svh',
      display:'flex',
      flexDirection:'row'
    },
    column:{
      overflowY: 'auto',
      width:windowWidth<700?'100%':'3in',
      height:'100%',
      backgroundColor:'grey',
      display:'flex',
      flexDirection:'column'
    },
    search:{
      padding:'0.04in',
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
    mapProperty:{
      flex:1,
      display:'flex',
      flexDirection:windowWidth<700?'column':'row'
    },
    map:{
      flex:1
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
    updateBtn:{
      backgroundColor:'rgb(57, 98, 155)',
      color:'white',
      borderRadius:'0.05in',
      border: 0,
      marginTop:'0.1in', 
      padding:'0.04in',
      outline: 'none',
      fontSize:'0.2in',
      textAlign:'center',
    },
    table:{
      borderRadius:'0.05in',
      backgroundColor:'white',
      margin:'0.08in',
      marginTop:0,
      tableLayout:'fixed',
      flex:1
    },
    cell:{
      paddingLeft:'0.08in',
      paddingRight:'0.08in',
      border: '1px solid grey'
    },
    chart:{
      height:'2in',
      display:'flex',
      flexDirection:'row',
      overflowX:'auto',
      paddingTop:'0.1in',
      backgroundColor:'rgb(169,169,169)'
    },
    resetBtn:{
      backgroundColor:'rgb(57, 98, 155)',
      color:'white',
      padding:'0.04in',
      margin:'0.08in',
      borderRadius:'0.05in',
      border: 0,
      outline: 'none',
      fontSize:'0.2in',
      textAlign:'center',
      userSelect:'none'
    },
    backMobileBtn:{
      backgroundColor:'rgb(57, 98, 155)',
      color:'white',
      borderRadius:'0.05in',
      border: 0,
      marginBottom:'0.1in', 
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
      {(!property || windowWidth>=700) && <div style={styles.column}>
        <div style={styles.properties}>
          {propertiesDisplay.map((property,index)=>(
            <div key={index} style={styles.property} onClick={()=>{
              setProperty(property)
              getCensus(property)
            }}>
              <b>{`(${property.yearBuilt}) `}</b>
              {`${property.propertyAddress}, ${property.city}, ${property.county}, ${property.state}, ${property.zip}`}
            </div>
          ))}
        </div>
        {!pickedDecade && <input
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
        />}
        {pickedDecade && <div style={styles.resetBtn} onClick={()=>{
          setPropertiesDisplay(properties)
          setPickedDecade(null)
        }}>
          Reset filter
        </div>}
        <div style={styles.chart}>
          {chartData.map((decade)=>{
          return (
            <div style={{height:'100%',display:'flex',flexDirection:'column',marginLeft:'0.1in', userSelect:'none',color:'white'}} onClick={()=>{
              setPickedDecade(decade[0])
              setPropertiesDisplay(properties.filter((property)=>
                (decade[0]<=property.yearBuilt && property.yearBuilt<decade[0]+9)
              ))
            }}>
              <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
                <div style={{flex:1,textAlign:'center',display:'flex',flexDirection:'column', justifyContent:'flex-end'}}>{decade[1]}</div>
                <div style={{backgroundColor:decade[0]===pickedDecade?'rgb(57, 98, 155)':'rgb(239, 239, 77)',height:`${decade[1]/maxChartData*100}%`}}></div>
              </div>
              <div>{decade[0]}</div>
            </div>
          )})}
          <div style={{marginLeft:'0.1in'}}></div>
        </div>
      </div>}
      <div style={styles.mapProperty}>
        {(property || windowWidth>=700) && <div style={styles.map}>
          {isLoaded && <GoogleMap
            mapContainerStyle={{width: '100%',height: '100%'}}
            center={{lat:39.82874138954248, lng:-98.57956553069293}}
            zoom={3}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  stylers: [{ visibility: 'off' }],
                },
                {
                  featureType: 'transit',
                  stylers: [{ visibility: 'off' }],
                },
                {
                  featureType: 'landscape',
                  stylers: [{ visibility: 'off' }],
                }
              ],
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false
            }}
          >
            <MarkerF
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
              }}
              position={property?{lat:property.latitude, lng:property.longitude}:null}
            />
          </GoogleMap>}
        </div>}
        {property && <div style={{...styles.column,height:windowWidth<700?'50%':'100%'}}>
          <div style={styles.property}>
            {windowWidth<700 && <div style={styles.backMobileBtn} onClick={()=>{
              setProperty(null)
            }}>Back</div>}
            <b>{`(${property.yearBuilt}) `}</b>
            {`${property.propertyAddress}, ${property.city}, ${property.county}, ${property.state}, ${property.zip}`}
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
              && <div style={styles.updateBtn} onClick={()=>{update({
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
          <table style={styles.table}>
            {Array(Math.min(censusData[0].length,censusData[1].length)).fill(0).map((i,index)=>(
              <tr key={index}>
                  <th style={styles.cell}>{censusData[0][index]}</th>
                  <td style={styles.cell}>{censusData[1][index]}</td>
              </tr>
            ))}
            {Math.min(censusData[0].length,censusData[1].length)===0 && <tr><td style={{textAlign:'center', height:'1in'}}>{`Census data ${loading?'loading...':'unavailable'}`}</td></tr>}
          </table>
        </div>}
      </div>
    </div>
  );
}

export default App;
