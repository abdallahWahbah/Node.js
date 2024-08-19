const fs = require("fs");
const superagent = require("superagent"); // a library to make http request


const readFilePro = filePath =>
{
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if(err) reject("File Not Exist")
            resolve(data)
        })
    })
}

const writeFilePro = (file, data) =>
{   
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if(err) reject("Can't write the file")
            resolve("Success")
        })
    })
}

// old way using "then" and "catch"
// readFilePro(`${__dirname}/dog.txt`)
// .then(data => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`) // superagent returns a promise which we can consume
// })
// .then(res => {
//     return writeFilePro("dog-img.txt", res.body.message)
// })
// .then(res => {
//     console.log("Random dog image is saved to dog-img.txt file")
// })
// .catch(err => {
//     console.log(err)
// })

// using async/await
const getDogPicture = async () =>
{
    try {
        const readData = await readFilePro(`${__dirname}/dog.txt`);
        // const dogUrl = await superagent.get(`https://dog.ceo/api/breed/${readData}/images/random`)
        // await writeFilePro("dog-img.txt", dogUrl.body.message)

        // if we have multiple http requests that we need to justify all at the same time
        const dogPro1 = superagent.get(`https://dog.ceo/api/breed/${readData}/images/random`)
        const dogPro2 = superagent.get(`https://dog.ceo/api/breed/${readData}/images/random`)
        const dogPro3 = superagent.get(`https://dog.ceo/api/breed/${readData}/images/random`)
        const dogProAll = await Promise.all([dogPro1, dogPro2, dogPro3]);

        const images = dogProAll.map(dog => dog.body.message).join("\n"); 
        await writeFilePro("dog-img.txt", images)
        console.log("Random dog image is saved to dog-img.txt file")
    } catch(error) {
        console.log(error)
        throw(error)
    }
    return "2: Ready to get dog picture"
}

// console.log("1: I will get dog data");

// getDogPicture() // we will consume the function with "then" and "catch" cause we are returning a value from getDogPicture function
// .then(x => {
//     console.log(x)
//     console.log("3: Done getting dog picture")
// })
// .catch(err => {
//     console.log("Error😒")
// })

////// another way ro consume getDogPicture function and retrieve the return value using IIFE instead of "then" and "catch"
(async () => {
    try
    {
        console.log("1: I will get dog data");
        const data = await getDogPicture();
        console.log(data);
        console.log("3: Done getting dog picture")
    }
    catch(error)
    {
        console.log("Error😒")
    }
})()