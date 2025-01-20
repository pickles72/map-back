const express = require('express');
var router = express.Router({mergeParams: true});

// Add a place to a list
router.post('/:list_id/places', (req, res) => {
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
router.get('/:list_id/places', (req, res) => {
    const listId = req.params.list_id;

    if (!listExists(listId)) {
        return res.status(404).json({ error: 'List not found' });
    }

    const placesInList = getPlacesByListId(listId);
    res.json(placesInList);
});

// Remove a place from a list
router.delete('/:list_id/places/:place_id', (req, res) => {
    const listId = req.params.list_id;
    const placeId = req.params.place_id;

    if (!associationExists(listId, placeId)) {
        return res.status(404).json({ error: 'Association not found' });
    }

    deleteListPlaceAssociation(listId, placeId);
    res.status(204).send(); // 204 No Content
});

module.exports = router;
