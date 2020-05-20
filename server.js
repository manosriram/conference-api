const express = require("express");
const app = express();
const PORT = 6060;

app.use(express.json());
app.use("/api", require("./api.js"));

app.listen(PORT, () => console.log(`Server at ${PORT}`));

module.exports = app;
