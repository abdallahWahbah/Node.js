console.log("Hello from the module"); // will be printed one time if you required this modules multiple times because of caching

module.exports = () => console.log("Log this beautiful text 😍");
