const express = require("express");

const tourController = require("../controllers/tourController");

const tourRouter = express.Router(); // tourRouter is a middleware

// Param middleware
tourRouter.param("id", tourController.checkId) // middleware for routes that have certain params

tourRouter.route("/")
// .route("/api/v1/tours") // commented this cause I will use tourRouter middleware
.get(tourController.getAllTours)
.post(tourController.checkBody, tourController.createTour) // checkBody is a middleware

tourRouter.route("/:id")
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour)

module.exports = tourRouter