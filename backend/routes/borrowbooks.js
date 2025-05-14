const express = require('express');

const router = express.Router();

const BorrowBook = require("../models/BorrowBook");

//test
router.get("/test",(req,res)=>res.send("Borrow routes working"));

router.post("/",(req,res)=>{
    BorrowBook.create(req.body)
    .then(()=>res.json({msg:"Book Borrowed Successfully" }))
    .catch(()=>res.status(400).json({msg:"Borrow book failed" }));
});

router.get("/",(req,res)=>{
    BorrowBook.find()
    .then((borrowbooks)=>res.json(borrowbooks))
    .catch(()=>res.status(400).json({msg:" No borrowers found" }));
});

router.get("/:id",(req,res)=>{
    BorrowBook.findById(req.params.id)
    .then((borrowbooks)=>res.json(borrowbooks))
    .catch(()=>res.status(400).json({msg:" Can't find borrow book" }));
});

router.put("/:id",(req,res)=>{
    BorrowBook.findByIdAndUpdate(req.params.id,req.body)
    .then(()=>res.json({msg:"Borrow book updated successfully" }))
    .catch(()=>res.status(400).json({msg:"Borrow book update failed" }));
});

router.delete("/:id",(req,res)=>{
    BorrowBook.findByIdAndDelete(req.params.id)
    .then(()=>res.json({msg:"Borrow book deleted successfully" }))
    .catch(()=>res.status(400).json({msg:"Borrow book delete failed" }));
});

module.exports = router;