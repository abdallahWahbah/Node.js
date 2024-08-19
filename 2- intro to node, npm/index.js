const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////////////
// FILES

// // sync code: blocking code execution, each statement is executed one after onther (line by line)
// const fileRead = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(fileRead)

// const newFileText = `This is all I know about Avocado:\n${fileRead}`;
// fs.writeFileSync("./txt/Output.txt", newFileText);
// console.log('New file is written called: Output.txt');


// // Non-blocking, Async way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     if(err) return console.log("Erroooooooor😒")
    
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log("data2: ", data2);
//         fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//             console.log("data3: ", data3)

//             fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//                 console.log("A new File is written😊")
//             })
//         })
//     })
// })
// console.log("Reading file...")


////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8"); // "__dirname" to get the current directory ('./')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); 
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true})); // to replace spaces with "-"
console.log(slugs) // ex: Fresh Avocados >>> fresh-avocados

const server = http.createServer((req, res) => { // the callback function will be triggered automatically on each http request

    const {query, pathname} = url.parse(req.url, true)// true >>> to parse the query into object

    // Overview page
    if(pathname === "/" || pathname === "/overview")
    {
        res.writeHead(200, {"Content-type": "text/html"})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.end(output)
    }
    // Product page
    else if(pathname === "/product")
    {
        res.writeHead(200, {"Content-type": "text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output)
    }
    // API page
    else if(pathname === "/api")
    {
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(data);
    }
    // Not found
    else
    {
        res.writeHead(404, {
            "Content-type": "text/html", // the return type will be html, if you want to return a simple string, remove this header (line)
            "my-custom-header": "Hello world"
        })
        res.end("<h1>Page not found</h1>")
    }
})

server.listen("8000", "127.0.0.1", () => {
    // 1st param is the port (usually 8000), 2nd is the local host, 3rd (optional) a callback triggered when the server starts listening
    console.log("Listening to requests on Port 8000")
})