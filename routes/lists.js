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

// Add a place to a list
router.post('/lists/:list_id/places', (req, res) => {
    const listId = req.params.list_id;
    const placeId = req.body.place_id;

    if (!listExists(listId) || !placeExists(placeId)) {
        return res.status(404).json({ error: 'List or place not found' });
    }

    if (associationExists(listId, placeId)) {
        return res.status(409).json({ error: 'Place already in list' });
    }

    const newAssociation = createListPlaceAssociation(listId, placeId);
    res.status(201).json({ message: 'Place added to list', association: newAssociation });
});

// Get all places in a list
router.get('/lists/:list_id/places', (req, res) => {
    const listId = req.params.list_id;

    if (!listExists(listId)) {
        return res.status(404).json({ error: 'List not found' });
    }

    const placesInList = getPlacesByListId(listId);
    res.json(placesInList);
});

// Remove a place from a list
router.delete('/lists/:list_id/places/:place_id', (req, res) => {
    const listId = req.params.list_id;
    const placeId = req.params.place_id;

    if (!associationExists(listId, placeId)) {
        return res.status(404).json({ error: 'Association not found' });
    }

    deleteListPlaceAssociation(listId, placeId);
    res.status(204).send(); // 204 No Content
});

router.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});