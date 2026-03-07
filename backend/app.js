const express  = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/health', (req,res) => {
    res.send("OK")
})

app.listen(3000, ()=> {
    console.log("Server is running");
})