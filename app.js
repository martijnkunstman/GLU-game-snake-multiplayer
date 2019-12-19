const express = require('express')
const app = express()
app.listen(3000, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))