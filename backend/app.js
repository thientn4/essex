const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors({
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}));




const getProperties = require("./routes/getProperties")
app.use('/getProperties',getProperties)
const updateProperty = require("./routes/updateProperty")
app.use('/updateProperty',updateProperty)
const getPropertyCensus = require("./routes/getPropertyCensus")
app.use('/getPropertyCensus',getPropertyCensus)



let port=process.env.PORT || 3002
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
