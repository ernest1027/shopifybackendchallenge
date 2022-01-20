const express = require("express");
const bodyParser = require('body-parser');
const logger = require("morgan")
const path = require('path');
const cors = require("cors")
const {responseHandler} = require("./middleware/responseHandler");
const {ItemRouter} = require("./routers/itemRouter")
const {LocationRouter} = require("./routers/locationRouter")
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.disable('etag');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use("/api/item", ItemRouter);
app.use("/api/location", LocationRouter);
app.use(responseHandler);
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', function(req,res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, './client/build/')
    });
});

const server = app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));

