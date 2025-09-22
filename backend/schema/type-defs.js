const {gql} = require("apollo-server");

const typeDefs = gql `
    type Character{
        name: String!
        height: Float 
        mass: Float 
        hair_color: [String]
        skin_color: [String]
        eye_color: [String]
        birth_year: String
        gender: String
        homeworld: String
        species: String
    }
    type Species{
        name: String!
        classification: String
        designation: String
        average_height: Float 
        average_lifespan: Int 
        eye_colors: [String]
        hair_colors: [String]
        skin_colors: [String]
        language: String
        homeworld: String
     }
    type Query{
        getCharacters: [Character!]!
        getSpecies: [Species!]!
    }
    input CharacterInput{
        name: String!
        height: Float 
        mass: Int 
        hair_color: [String]
        skin_color: [String]
        eye_color: [String]
        birth_year: String
        gender: String
        homeworld: String
        species: String
    }
    input SpeciesInput{
        name: String!
        classification: String
        designation: String
        average_height: Float 
        average_lifespan: Int 
        eye_colors: [String]
        hair_colors: [String]
        skin_colors: [String]
        language: String
        homeworld: String
    }
    input CharacterUpdate{
        height: Float
        mass: Int
        hair_color: [String]
        skin_color: [String]
        eye_color: [String]
        birth_year: String
        gender: String
        homeworld: String
        species: String
    }
    input SpeciesUpdate{
        classification: String
        designation: String
        average_height: Float
        average_lifespan: Int
        eye_colors: [String]
        hair_colors: [String]
        skin_colors: [String]
        language: String
        homeworld: String
    }
    type Mutation{
        createCharacter(characterInput: CharacterInput!): Character!
        createSpecies(speciesInput: SpeciesInput!): Species!
        updateCharacter(name: String!, characterUpdate: CharacterUpdate!): Character!
        updateSpecies(name:String!, speciesUpdate: SpeciesUpdate!): Species!
        deleteCharacter(name: String!): Character!
        deleteSpecies(name: String!): Species!
    }
`;

module.exports={typeDefs};