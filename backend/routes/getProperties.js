const express = require('express');
const db=require('../db')

const router=express.Router()

router.get('/',(req,res,next)=>{
    db.query('SELECT * FROM ESSEX.PROPERTIES;', (propertiesErr, propertiesResults, propertiesField) => {
        if (propertiesErr){
            res.status(500)
        }else{
            res.status(200).json({
                status:"success",
                properties:propertiesResults.map((obj)=>({
                    latitude: obj.LATITUDE,
                    longitude: obj.LONGITUDE,
                    propertyAddress: obj.PROPERTY_ADDRESS,
                    city: obj.CITY,
                    state: obj.STATE,
                    zip: obj.ZIP,
                    county: obj.COUNTY,
                    yearBuilt: obj.YEAR_BUILT,
                    occupancyRate: obj.OCCUPANCY_RATE,
                    parking: obj.PARKING,
                    evCharger: obj.EV_CHARGER,
                    redevelopmentOpportunities: obj.REDEVELOPMENT_OPPORTUNITIES
                }))
            })

        }
    });
})

module.exports=router;