const express = require("express");
const morgan = require("morgan"); // middleware for logging (console.log) // ignore it

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

const app = express();


// 1) MIDDLEWARES
app.use(express.json()) // a middleware to enable us to modify incoming requests (to access body when POST | PATCH (in general))

// if you tried to acces html (static) file in the project from the browser, it will tell you >> Cannot GET public/file.html
// so we use the following middleware
app.use(express.static(`${__dirname}/public`)) // then we access the html >> localhost: 300/file.html without /public

if(process.env.NODE_ENV === "development")
{
    app.use(morgan("dev")) // ignore it
}
// custom middleware >>> any request will pass through all middlewares
app.use((req, res, next) => {
    console.log("Hello from the middleware 🙌");
    next(); // don't forget to call next() cause the api will get stuck if not
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 2) ROUTE HANDLERS

// app.get("/api/v1/tours", getAllTours)
// app.post("/api/v1/tours", createTour)
// app.get("/api/v1/tours/:id", getTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)

// 3) ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// 4) START SERVER
module.exports = app;