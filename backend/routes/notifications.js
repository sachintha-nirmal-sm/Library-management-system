const express = require('express');
const router = express.Router();
const notifications = require('../models/notification');

router.get("/test", (req, res) =>res.send("notification routes working"));

router.post("/",(req, res) => {
    notifications.create(req.body)
    .then(() =>res.json({msg:"Notification added successfully"}))
    .catch(()=>res.status(400).json({msg:"Notification adding failed."}));
   }); 

router.get("/", (req, res) => {
    notifications.find()
    .then((notification) => res.json(notification))
    .catch((err) => res.status(400).json({msg:"No notification found."}));
});

router.get("/:id", (req, res) => {
    notifications.findById(req.params.id)
    .then((notification) => res.json(notification))
    .catch((err) => res.status(400).json({msg:"Cannot find this notification."}));
});

router.put("/:id", (req, res) => {
    notifications.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({msg:"Notification updated successfully"}))
    .catch(() => res.status(400).json({msg:"Notification update failed."}));
}); 

router.delete("/:id", (req, res) => {
    notifications.findByIdAndDelete(req.params.id)
    .then(() => res.json({msg:"Notification deleted successfully"}))
    .catch(() => res.status(400).json({msg:"Notification deletion failed."}));
});

router.post("/payment/add", (req, res) => {
    notifications.create(req.body)
    .then(() => res.json({ msg: "Notification added successfully" }))
    .catch((err) => res.status(400).json({ msg: "Failed to add notification", error: err.message }));
});

module.exports = router;