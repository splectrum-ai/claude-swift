// Test SPL integration in JS scripts
const spl = require("spl_lib");
console.log("Testing SPL context access from JS script");
console.log("AppRoot from script:", spl.context(input, "appRoot"));