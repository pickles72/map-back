const express = require('express');
var router = express.Router();

// Dummy database functions (replace with your actual database logic)
const lists = []; // In-memory "database" for lists (replace with a real database)
const places = []; // In-memory "database" for places
const listPlaces = []; // Junction table

let nextListId = 1;
let nextPlaceId = 1;
let nextListPlaceId = 1;

const listExists = (listId) => lists.some(list => list.id === parseInt(listId));
const placeExists = (placeId) => places.some(place => place.id === parseInt(placeId));
const associationExists = (listId, placeId) => listPlaces.some(lp => lp.listId === parseInt(listId) && lp.placeId === parseInt(placeId));
const createListPlaceAssociation = (listId, placeId) => {
    const newAssociation = { id: nextListPlaceId++, listId: parseInt(listId), placeId: parseInt(placeId) };
    listPlaces.push(newAssociation);
    return newAssociation;
};
const getPlacesByListId = (listId) => {
    const placeIds = listPlaces.filter(lp => lp.listId === parseInt(listId)).map(lp => lp.placeId);
    return places.filter(place => placeIds.includes(place.id));
};
const deleteListPlaceAssociation = (listId, placeId) => {
    const index = listPlaces.findIndex(lp => lp.listId === parseInt(listId) && lp.placeId === parseInt(placeId));
    if (index !== -1) {
        listPlaces.splice(index, 1);
    }
};

// Example data creation
lists.push({id: nextListId++, name: "My First List"})
places.push({id: nextPlaceId++, name: "My First Place"})
places.push({id: nextPlaceId++, name: "My Second Place"})


// Routes

// Get all places in a list
router.get('/', (req, res) => {
    const listId = req.params.list_id;

    if (lists.length === 0) {
        return res.status(404).json({ error: 'User has no lists' });
    }
    
    res.json(lists);
});

module.exports = router;
