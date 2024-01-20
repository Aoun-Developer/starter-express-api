// connet with swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load("./api.yaml");



// connect batabase
const connectToMyMongo = require("./db");
connectToMyMongo();




const express = require('express');
const app = express();
const port = 1000


app.use(express.json());

app.get('/', (req, res) => res.send('Hello Bachoooo!'))

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs))


// Available Routes
app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/notes"));





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})