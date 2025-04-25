const express = require('express');
const db=require('../db')

const router=express.Router()

router.post('/',(req,res,next)=>{
    db.query(`
        UPDATE ESSEX.PROPERTIES
        SET 
            OCCUPANCY_RATE = COALESCE(?,OCCUPANCY_RATE), 
            PARKING = COALESCE(?,PARKING), 
            EV_CHARGER = COALESCE(?,EV_CHARGER), 
            REDEVELOPMENT_OPPORTUNITIES = COALESCE(?,REDEVELOPMENT_OPPORTUNITIES)
        WHERE 
            PROPERTY_ADDRESS = ?
            AND CITY = ?
            AND STATE = ?
            AND ZIP = ?
            AND COUNTY = ?;
    `
    , [
        req.body.occupancyRate,
        req.body.parking,
        req.body.evCharger,
        req.body.redevelopmentOpportunities,
        req.body.propertyAddress,
        req.body.city,
        req.body.state,
        req.body.zip,
        req.body.county
    ]
    , (updateErr, updateResults, updateField) => {
        if (updateErr){
            res.status(500)
        }else{
            res.status(200).json({
                status:"success"
            })

        }
    });
})

module.exports=router;