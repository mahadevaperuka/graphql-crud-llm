const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const schema = `type Character{
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
        getCharacter(filter: String): [Character!]! 
        getSpecies(filter: String): [Species!]! 
    }
    input CharacterInput{
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
        mass: Float
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
    }`
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {

    const templateQuery = {
      "model": "ai/llama3.2:latest",
      "messages": [
        {
            "role": "user",
            "content": `
                        You are a GraphQL query generator for a MongoDB-backed API.  
                        Your ONLY task is to translate user requests into valid GraphQL operations, following all rules strictly.  
                        You must output ONLY a JSON object with exactly two keys: "result" and "data".

                        CHEAT SHEET (understand functions, args, and data):
                        Here's the schema for reference:
                        ===================
                        ${schema}
                        ===================
                        Queries:
                        - getCharacter(filter: String): [Character!]!
                        • filter is a Mongo-style(mongoose) JSON string that can Retrieves characters with filters.
                        • Example filter: "{\\"height\\": {\\"$gt\\": 180}}" - with escape lines
                        - getSpecies(filter: String): [Species!]!
                        • filter is a Mongo-style(mongoose) JSON string that can Retrieves characters with filters.
                        • Example filter: "{\\"name\\": {\\"$eq\\": \\"Human\\"}}" - with escape lines

                        Mutations:
                        - createCharacter(characterInput: CharacterInput!): Character!
                        • Create a new character by taking characterInput via variables.
                        - createSpecies(speciesInput: SpeciesInput!): Species!
                        • Create a new species by taking SpeciesInput via Variables.
                        - updateCharacter(name: String!, characterUpdate: CharacterUpdate!): Character!
                        • Update fields of an existing character by name. (only name field can't be updated)
                        - updateSpecies(name: String!, speciesUpdate: SpeciesUpdate!): Species!
                        • Update fields of an existing species by name. (only name field can't be updated)
                        - deleteCharacter(name: String!): Character!
                        • Delete a character by name.
                        - deleteSpecies(name: String!): Species!
                        • Delete a species by name.

                        Types:
                        Character fields → [name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, homeworld, species] (only name is required, all other are optional)
                        Species fields → [name, classification, designation, average_height, average_lifespan, eye_colors, hair_colors, skin_colors, language, homeworld] (only name is required, all other are optional)

                        STRICT RULES:

                        1. ALWAYS pass inputs via GraphQL variables.  (when user mentions it specifically)
                        - Never inline objects into the query.  
                        - Correct: getCharacters(filter: $filter)  
                        - Incorrect: getCharacters(filter: { name: "Luke" })
                        - Declare the variable in the query before using them in the variables object.
                        - Be careful with operation name you are using as it's case sensitive. (follow the schema case)

                        2. If the schema argument is String (e.g., filter), declare the variable as ($filter: String) and set variables.filter to a **stringified JSON object** with escape lines must.

                        3. If the schema argument is an input type (e.g., CharacterInput), declare the variable with that type and set variables to a proper JSON object.

                        4. Every operation must select at least one return field from the schema type.

                        5. Your final output must be exactly:
                        {
                        "result": "Success" or "Error",
                        "data": {
                            "query": "valid GraphQL query string",
                            "variables": { ... }
                        }
                        }
                        If rules cannot be satisfied, return:
                        {
                        "result": "Error",
                        "data": {
                            "error": "short description",
                            "details": "specific reason"
                        }
                        }

                        6. NO explanations, comments, or escape characters.  
                        Just output the JSON object.

                        FEW-SHOT EXAMPLES:

                        User: "Get/show/retrieve all characters"
                        Output:
                        {
                        "result": "Success",
                        "data": {
                            "query": "query { getCharacter { name height species } }",
                            "variables": {}
                        }
                        }

                        User: "Show me all characters taller than 180"
                        Output:
                        {
                        "result": "Success",
                        "data": {
                            "query": "query GetCharacter($filter: String) { getCharacter(filter: $filter) { name height mass } }",
                            "variables": {
                            "filter": "{\\"height\\": {\\"$gt\\": 180}}"
                            }
                        }
                        }

                        User: "Add a new character \\"Luke\\" who is 172 cm tall"
                        Output:
                        {
                        "result": "Success",
                        "data": {
                            "query": "mutation CreateCharacter($characterInput: CharacterInput!) { createCharacter(characterInput: $characterInput) { name height } }",
                            "variables": {
                            "characterInput": {
                                \\"name\\": \\"Luke\\",
                                \\"height\\": 172
                            }
                            }
                        }
                        }

                        Now: Translate the following user request into GraphQL strictly following the above schema, rules, and format. Recheck the generated query and variables with the above rules after generating
                        User request: "${message}"
                        `
            }
        ]
    }

    const llmResponse = await axios.post("http://localhost:12434/engines/llama.cpp/v1/chat/completions", templateQuery);

    let responseData = llmResponse.data.choices[0].message.content
    responseData = responseData.replaceAll("`","")
    for(let i = 0; i < responseData.length;i++){
        if (responseData[i]!= "{"){
            continue
        }else{
            responseData = responseData.slice(i,responseData.length + 1);
            break
        }
    }
    console.log(responseData)
    let parsed = JSON.parse(responseData.trim())
    console.log("Reached")


    let gqlResponse = null; 
    if(parsed.result === "Success"){
        try {

            gqlResponse = await axios.post("http://localhost:4000/graphql", {
                query: parsed.data.query,
                variables: parsed.data.variables
            });
        } catch (gqlError) {
            console.error("GraphQL request failed:", gqlError.message);
            return res.status(500).json({ 
                error: "GraphQL request failed", 
                details: gqlError.message,
                graphql: parsed.data
            });
        }
    }
    else {
        console.log(parsed.data)
    } 
    
    res.json({
        graphql: parsed.data,
        result: gqlResponse ? gqlResponse.data : null,
        llmResult: parsed.result
    });

  } catch (err) {
    console.error("Error in /chat:", err.message);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

// Run server
app.listen(3001, () => {
  console.log("LLM server running at http://localhost:3001");
});
