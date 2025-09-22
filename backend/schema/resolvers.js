const Characters = require("../models/Characters");
const Species = require("../models/Species");

const resolvers={
    Query:{
        async getCharacters(){
            return await Characters.find();
        },
        async getSpecies(){
            return await Species.find();
        }
    },
    Mutation:{
        async createCharacter(_ , {characterInput}){
            const createCharacter = new Characters(characterInput);
            const res=await createCharacter.save();
            return {id: res.id, ...res._doc};
        },
        async createSpecies(_ , {speciesInput}){
            const createSpecies = new Species(speciesInput);
            const res=await createSpecies.save();
            console.log(`Successfully created ${name} character`)
            return {id: res.id, ...res._doc};
        },
        
        async updateCharacter(_ ,{name,characterUpdate}){
            try{
            const updateCharacter = await Characters.findOneAndUpdate(
                {name: name}, // Matching with filter 
                {$set: characterUpdate }, // Updating
                {new: true});
            return {id: updateCharacter.id, ...updateCharacter._doc}; 
            }
            catch(err){
                console.log(err);
            }
            
        },
        async updateSpecies(_ , {name, speciesUpdate}){
            const updateSpecies = await Species.findOneAndUpdate(
                {name: name}, // Matching with filter
                {$set: speciesUpdate }, // Updating
                {new: true}); //return the updated one
            return {id: updateSpecies.id, ...updateSpecies._doc};
        },
        
        async deleteCharacter(_ , {name}){
            const deleteCharacter = await Characters.findOneAndDelete({name: name});
            console.log(`Sucessfully deleted the Character ${name}`)
            return {id: deleteCharacter.id, ...deleteCharacter._doc};
        },
        async deleteSpecies(_ , {name}){
            const deleteSpecies = await Species.findOneAndDelete({name: name});
            console.log(`Sucessfully deleted the Species ${name}`)

            return {id: deleteSpecies.name, ...deleteSpecies._doc};
        }
    }
};

module.exports={resolvers};