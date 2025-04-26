const express = require('express');
const db=require('../db')

const router=express.Router()

router.get('/',(req,res,next)=>{
    db.query('SELECT * FROM ESSEX.PROPERTIES;', (propertiesErr, propertiesResults, propertiesField) => {
        if (propertiesErr){
            res.status(500).send()
        }else{
            res.status(200).json({
                status:"success",
                properties:propertiesResults.map((obj)=>({
                    latitude: parseFloat(obj.LATITUDE),
                    longitude: parseFloat(obj.LONGITUDE),
                    propertyAddress: obj.PROPERTY_ADDRESS,
                    city: obj.CITY,
                    state: obj.STATE,
                    zip: obj.ZIP,
                    county: obj.COUNTY,
                    yearBuilt: obj.YEAR_BUILT,
                    occupiedSpaceCount: obj.OCCUPIED_SPACE_COUNT,
                    totalSpaceCount: obj.TOTAL_SPACE_COUNT,
                    parking: obj.PARKING,
                    evCharger: obj.EV_CHARGER,
                    redevelopmentOpportunities: obj.REDEVELOPMENT_OPPORTUNITIES
                }))
            })

        }
    });
})

module.exports=router;