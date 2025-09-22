const {model, Schema}= require("mongoose");

const charactersSchema = new Schema(
    {
        name: String,
        height: Number,
        mass: Number,
        hair_color: [String],
        skin_color: [String],
        eye_color: [String],
        birth_year: String,
        gender: String,
        homeworld: String,
        species: String,
    }
);

module.exports = model("characters", charactersSchema);