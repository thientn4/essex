const express = require('express');

const router=express.Router()

router.get('/',async (req,res,next)=>{
    try {
        const response = await fetch(`https://geocoding.geo.census.gov/geocoder/geographies/address?street=${req.query.street}&city=${req.query.city}&state=${req.query.state}&benchmark=Public_AR_Current&vintage=Current_Current&layers=10&format=json`);
        if (!response.ok) return res.status(500).send()
        const data = await response.json();
        let census=[[],[]]
        if(
            data.result.addressMatches.length>0 &&
            data.result.addressMatches[0].geographies['Census Block Groups'].length>0
        ){
            let state=data.result.addressMatches[0].geographies['Census Block Groups'][0].STATE
            let county=data.result.addressMatches[0].geographies['Census Block Groups'][0].COUNTY
            const response2 = await fetch(`https://api.census.gov/data/2023/acs/acs1?get=NAME,C25004_001E,C25004_002E,C25004_003E&for=county:${county}&in=state:${state}`);
            if (!response2.ok) return res.status(500).send()
            census= await response2.json();
        }
        res.status(200).json({
            status:"success",
            census:census
        })
    } catch (error) {
        res.status(500).send()
    }
})

module.exports=router;