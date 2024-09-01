const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // if we wanted to use environment variables, we need to setup this line before require app(next line)
const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => { // the callback function will be called as soon as the server starts listening
    console.log("Server listening to port #" + port);
})