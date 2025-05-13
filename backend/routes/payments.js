const express = require('express');
const router = express.Router();
const payments = require('../models/payment');

router.get("/test", (req, res) =>res.send("payment routes working"));

router.post("/",(req, res) => {
    payments.create(req.body)
    .then(() =>res.json({msg:"Payment added successfully"}))
    .catch(()=>res.status(400).json({msg:"Payment adding failed."}));
   }); 

router.get("/", (req, res) => {
    payments.find()
    .then((payments) => res.json(payments))
    .catch((err) => res.status(400).json({msg:"No payment found."}));
});

router.get("/:id", (req, res) => {
    payments.findById(req.params.id)
    .then((payment) => res.json(payment))
    .catch((err) => res.status(400).json({msg:"Cannot find this payment."}));
});

router.put("/:id", (req, res) => {
    payments.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({msg:"Payment updated successfully"}))
    .catch(() => res.status(400).json({msg:"Payment update failed."}));
}); 

router.delete("/:id", (req, res) => {
    payments.findByIdAndDelete(req.params.id)
    .then(() => res.json({msg:"Payment deleted successfully"}))
    .catch(() => res.status(400).json({msg:"Payment deletion failed."}));
});

router.post("/payment/add", (req, res) => {
    Payments.create(req.body)
    .then(() => res.json({ msg: "Payment added successfully" }))
    .catch((err) => res.status(400).json({ msg: "Failed to add payment", error: err.message }));
});

module.exports = router;