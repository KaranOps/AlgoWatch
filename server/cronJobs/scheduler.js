const cron = require('node-cron');
const Student = require('../models/Student');
const { fetchCodeforcesData } = require('../utils/fetchCodeforcesData');

const syncAllStudents = async () => {
    try {
        console.log("Cron job running at", new Date().toLocaleString());
        const students = await Student.find();
        for (const student of students) {
            await fetchCodeforcesData(student.codeforcesHandle);
            // console.log("ScheduleCheck for", student.name);
        }
    } catch (err) {
        console.error("Error in cron job:", err);
    }
};

cron.schedule('0 2 * * *', syncAllStudents);
