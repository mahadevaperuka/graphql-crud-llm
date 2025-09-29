const Characters = require("../models/Characters");
const Species = require("../models/Species");

const resolvers={
    Query:{
        async getCharacter(_, {filter}){
            try {
                let mongoFilter = {};
                
                if (filter) {
                    try {
                        // console.log(filter)
                        mongoFilter = JSON.parse(filter);
                        // console.log(mongoFilter)
                    } catch (parseError) {
                        mongoFilter = { name: { $regex: filter, $options: 'i' } };
                    }
                }
                console.log('Filter received:', mongoFilter);
                
                const characters = await Characters.find(mongoFilter).sort();
                return characters;
            } catch (error) {
                console.error('Error fetching characters:', error);
                throw new Error('Failed to fetch characters');
            }
        },
        async getSpecies(_, {filter}){
            try {
                console.log('Filter received:', filter);
                
                let mongoFilter = {};
                
                if (filter) {
                    try {
                        mongoFilter = JSON.parse(filter);
                    } catch (parseError) {
                        mongoFilter = { name: { $regex: filter, $options: 'i' } };
                    }
                }
                
                const species = await Species.find(mongoFilter);
                return species;
            } catch (error) {
                console.error('Error fetching species:', error);
                throw new Error('Failed to fetch species');
            }
        }
    },
    Mutation:{
        async createCharacter(_, {characterInput}){
            try {
                // Check if character already exists
                const existingCharacter = await Characters.findOne({ name: characterInput.name });
                if (existingCharacter) {
                    throw new Error(`Character with name "${characterInput.name}" already exists`);
                }
                
                const createCharacter = new Characters(characterInput);
                const res = await createCharacter.save();
                return {id: res._id, ...res._doc};
            } catch (error) {
                console.error('Error creating character:', error);
                throw new Error(`Failed to create character: ${error.message}`);
            }
        },
        async createSpecies(_, {speciesInput}){
            try {
                // Check if species already exists
                const existingSpecies = await Species.findOne({ name: speciesInput.name });
                if (existingSpecies) {
                    throw new Error(`Species with name "${speciesInput.name}" already exists`);
                }
                
                const createSpecies = new Species(speciesInput);
                const res = await createSpecies.save();
                console.log(`Successfully created ${speciesInput.name} species`);
                return {id: res._id, ...res._doc};
            } catch (error) {
                console.error('Error creating species:', error);
                throw new Error(`Failed to create species: ${error.message}`);
            }
        },
        
        async updateCharacter(_, {name, characterUpdate}){
            try {
                const updateCharacter = await Characters.findOneAndUpdate(
                    {name: name},
                    {$set: characterUpdate},
                    {new: true, runValidators: true}
                );
                
                if (!updateCharacter) {
                    throw new Error(`Character with name "${name}" not found`);
                }
                
                return {id: updateCharacter._id, ...updateCharacter._doc};
            } catch (error) {
                console.error('Error updating character:', error);
                throw new Error(`Failed to update character: ${error.message}`);
            }
        },
        async updateSpecies(_, {name, speciesUpdate}){
            try {
                const updateSpecies = await Species.findOneAndUpdate(
                    {name: name},
                    {$set: speciesUpdate},
                    {new: true, runValidators: true}
                );
                
                if (!updateSpecies) {
                    throw new Error(`Species with name "${name}" not found`);
                }
                
                return {id: updateSpecies._id, ...updateSpecies._doc};
            } catch (error) {
                console.error('Error updating species:', error);
                throw new Error(`Failed to update species: ${error.message}`);
            }
        },
        
        async deleteCharacter(_, {name}){
            try {
                const deleteCharacter = await Characters.findOneAndDelete({name: name});
                
                if (!deleteCharacter) {
                    throw new Error(`Character with name "${name}" not found`);
                }
                
                console.log(`Successfully deleted the Character ${name}`);
                return {id: deleteCharacter._id, ...deleteCharacter._doc};
            } catch (error) {
                console.error('Error deleting character:', error);
                throw new Error(`Failed to delete character: ${error.message}`);
            }
        },
        async deleteSpecies(_, {name}){
            try {
                const deleteSpecies = await Species.findOneAndDelete({name: name});
                
                if (!deleteSpecies) {
                    throw new Error(`Species with name "${name}" not found`);
                }
                
                console.log(`Successfully deleted the Species ${name}`);
                return {id: deleteSpecies._id, ...deleteSpecies._doc};
            } catch (error) {
                console.error('Error deleting species:', error);
                throw new Error(`Failed to delete species: ${error.message}`);
            }
        }
    }
};

module.exports={resolvers};