const {model, Schema}= require("mongoose");

const speciesSchema = new Schema(
    {
        name: String,
        classification: String,
        designation: String,
        average_height: Number,
        skin_colors: [String],
        hair_colors: [String],
        eye_colors: [String],
        average_lifespan: Number,
        language: String,
        homeworld: String,
    }
);

module.exports = model("species", speciesSchema);