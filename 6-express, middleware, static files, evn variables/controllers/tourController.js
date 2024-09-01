const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// Param middleware
exports.checkId = (req, res, next, valueOfId) => { // these params coming from param middleware in tourRouter.js
    console.log(`Tour id: ${valueOfId}`);

    const tour = tours.find(item => item.id === +req.params.id);
    if(!tour)
    {
        return res.status(404).json({ // return: so as not to continue going throw the other middlewares
            status: "fail", 
            message: "Tour Not Found"
        })
    }

    next(); // if there is a tour, call the next middleware in the stack
}

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price)
    {
        return res.status(400).json({
            status: "fail",
            message: "Missing name or price"
        })
    }
    next();
}
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime, // coming from custom middleware above
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.getTour = (req, res) => {
    const tour = tours.find(item => item.id === +req.params.id);
    // if(!tour) // will be execute in the checkId middleware
    // {
    //     return res.status(404).json({
    //         status: "fail", 
    //         message: "Tour Not Found"
    //     })
    // }

    res.status(200).json({
        status: "success", 
        data: {
            tour
        }
    })
}

exports.createTour = (req, res) => { // once we POST new tour, it will restart the server
    
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body)
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), error => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
}

exports.updateTour = (req, res) => {
    let tour = tours.find(item => item.id === +req.params.id);
    // if(!tour)
    // {
    //     return res.status(404).json({
    //         status: "fail", 
    //         message: "Tour Not Found"
    //     })
    // }

    tour = {...tour, ...req.body}
    tours[+req.params.id] = tour

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), error => {
        res.status(201).json({
            status: "success",
            data: {
                updatedTour: tour
            }
        })
    })
}

exports.deleteTour = (req, res) => {
    const tour = tours.find(item => item.id === +req.params.id);
    // if(!tour)
    // {
    //     res.status(404).json({
    //         status: "fail", 
    //         message: "Tour Not Found"
    //     })
    // }

    let x = tours.filter(item => item.id !== +req.params.id);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(x), error => {
        res.status(204).json({
            status: "success",
            data: null
        })
    })
}
