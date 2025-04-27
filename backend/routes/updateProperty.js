const express = require('express');
const db=require('../db')

const router=express.Router()

router.post('/',(req,res,next)=>{
    if (req.body.occupiedSpaceCount>req.body.totalSpaceCount) return res.status(400).send() ////// avoid invalid occupancy rate
    db.query(`
        UPDATE ESSEX.PROPERTIES
        SET 
            OCCUPIED_SPACE_COUNT = COALESCE(?,OCCUPIED_SPACE_COUNT), 
            TOTAL_SPACE_COUNT = COALESCE(?,TOTAL_SPACE_COUNT), 
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
        req.body.occupiedSpaceCount,
        req.body.totalSpaceCount,
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
            res.status(500).send()
        }else{
            res.status(200).json({
                status:"success"
            })

        }
    });
})

module.exports=router;