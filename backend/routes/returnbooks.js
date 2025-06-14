const express = require('express');

const router = express.Router();

const ReturnBook = require("../models/ReturnBook");

//test
router.get("/test",(req,res)=>res.send("Return routes working"));

router.post("/", (req, res) => {
    console.log("Received request body:", req.body); // Log the request body for debugging

    ReturnBook.create(req.body)
        .then(() => res.json({ msg: "Book return Successfully" }))
        .catch((err) => {
            console.error("Error creating return book:", err); // Log the error for debugging
            res.status(400).json({ msg: "Return book failed", error: err.message });
        });
});


router.get("/",(req,res)=>{
    ReturnBook.find()
    .then((returnbooks)=>res.json(returnbooks))
    .catch(()=>res.status(400).json({msg:" No returns found" }));
});

router.get("/:id",(req,res)=>{
    ReturnBook.findById(req.params.id)
    .then((returnbooks)=>res.json(returnbooks))
    .catch(()=>res.status(400).json({msg:" Can't find return book" }));
});

router.delete("/:id",(req,res)=>{
    ReturnBook.findByIdAndDelete(req.params.id)
    .then(()=>res.json({msg:"Return book deleted successfully" }))
    .catch(()=>res.status(400).json({msg:"Return book delete failed" }));
});

module.exports = router;