const express = require('express');
const router = express.Router();
const inventorys = require('../models/inventory');

router.get("/test", (req, res) =>res.send("inventory routes working"));

router.post("/",(req, res) => {
    inventorys.create(req.body)
    .then(() =>res.json({msg:"Inventory added successfully"}))
    .catch(()=>res.status(400).json({msg:"Inventory adding failed."}));
   }); 

router.get("/", (req, res) => {
    inventorys.find()
    .then((inventorys) => res.json(inventorys))
    .catch((err) => res.status(400).json({msg:"No inventory found."}));
});

router.get("/:id", (req, res) => {
    inventorys.findById(req.params.id)
    .then((inventory) => res.json(inventory))
    .catch((err) => res.status(400).json({msg:"Cannot find this inventory."}));
});

router.put("/:id", (req, res) => {
    inventorys.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({msg:"Inventory updated successfully"}))
    .catch(() => res.status(400).json({msg:"Inventory update failed."}));
}); 

router.delete("/:id", (req, res) => {
    inventorys.findByIdAndDelete(req.params.id)
    .then(() => res.json({msg:"Inventory deleted successfully"}))
    .catch(() => res.status(400).json({msg:"Inventory deletion failed."}));
});

router.post("/books/add", (req, res) => {
    inventorys.create(req.body)
    .then(() => res.json({ msg: "Book added successfully" }))
    .catch((err) => res.status(400).json({ msg: "Failed to add book", error: err.message }));
});

module.exports = router;