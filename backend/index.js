const express = require('express');
const dbconnection = require('./config/db');
const inventorysroutes = require("./routes/inventorys");
const paymentsroutes = require("./routes/payments");
const notificationsroutes = require("./routes/notifications");

const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors({origin:true, credentials:true}));

//DB Connection
dbconnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', (req, res) => res.send('Hello World!')); 
app.use("/api/inventorys",inventorysroutes);
app.use("/api/payments",paymentsroutes);
app.use("/api/notifications",notificationsroutes);



    const PORT = 5000;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});