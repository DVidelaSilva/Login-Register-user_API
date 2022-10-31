const mongoose = require("mongoose")

const Animals = mongoose.model("Animal", {
    name: { type: String, require: true, minLength: 3},
    type: { type: String, require: true, minLength: 3},
})

module.exports = Animals