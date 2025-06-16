const express = require('express');
const router = express.Router();
const {updateCronSchedule} = require('../cronJobs/scheduler')

router.post('/update-cron', (req,res)=>{
    const { schedule } = req.body;
    // console.log("Check1");
    if(!schedule) res.status(400).json({error: "No schedule provided"});
    // console.log("Check2");
    try {
        updateCronSchedule(schedule);
        res.json({ message: `Cron schedule updated to ${schedule}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;