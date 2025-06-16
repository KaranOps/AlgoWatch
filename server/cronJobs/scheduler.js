const cron = require('node-cron');
const Student = require('../models/Student');
const { fetchCodeforcesData } = require('../utils/fetchCodeforcesData');
const sendReminderEmail = require('../utils/sendReminderEmail');
require('dotenv').config();

const syncAllStudents = async () => {
    try {
        // Sync Codeforces data
        console.log("Cron job running at", new Date().toLocaleString());
        const students = await Student.find();
        for (const student of students) {
            await fetchCodeforcesData(student.codeforcesHandle);
            console.log("ScheduleCheck for", student.name);
        }

        // Inactivity detection and reminders
        const now = Date.now() / 1000;
        const DAYS = 7 * 24 * 60 * 60;
        // const DAYS = 60 * 60;
        // console.log("Before")
        for (const student of students) {
            // console.log("After")
            if (!student.autoEmailEnabled) continue;
            const recentSubmission = (student.cfSubmissions || []).some(
                sub => sub.verdict === "OK" && (now - sub.creationTimeSeconds < DAYS)
            );
            if (!recentSubmission) {
                await sendReminderEmail(student.email, student.name);
                student.reminderCount = (student.reminderCount || 0) + 1;
                await student.save();
                console.log(`Reminder sent to ${student.name} (${student.email})`);
            }
        }
    } catch (err) {
        console.error("Error in cron job:", err);
    }
};

// ---- Dynamic scheduling
let cronSchedule = process.env.CRON_SCHEDULE || '0 2 * * *';
let cronTask = null;

const startCronJob = (schedule) => {
    if (cronTask) {
        cronTask.stop();
        console.log(`Stopped previous cron job.`);
    }
    cronTask = cron.schedule(schedule, syncAllStudents);
    console.log(`Started cron job with schedule: ${schedule}`);
}
// Start the job initially
startCronJob(cronSchedule);

// Export a function to update the schedule dynamically
module.exports.updateCronSchedule = (newSchedule) => {
    cronSchedule = newSchedule;
    startCronJob(cronSchedule);
};