const Student = require('../models/student');
const axios = require('axios');
const { fetchCodeforcesData } = require('../utils/fetchCodeforcesData')
// Helper function to check if student already exists
const checkStudentExists = async (email, codeforcesHandle, phone, excludeId = null) => {
    const query = {
        $or: [
            { email },
            { codeforcesHandle },
            { phone },
        ]
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return await Student.findOne(query);
};

// CREATE a new student
exports.createStudent = async (req, res) => {
    try {
        const studentData = req.body;

        // Check if student already exists
        const existingStudent = await checkStudentExists(studentData.email, studentData.codeforcesHandle, studentData.phone);
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                error: 'Student already exists',
                details: `Student with email '${studentData.email}' or student ID '${studentData.studentId}' already exists`
            });
        }

        // Fetch ratings using Codeforces handle
        const { currentRating, maxRating } = await fetchCodeforcesData(studentData.codeforcesHandle);
        studentData.currentRating = currentRating;
        studentData.maxRating = maxRating;

        const student = new Student(studentData);
        await student.save();

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Failed to create student',
            details: err.message
        });
    }
};

//Read all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ a single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE a student by ID
exports.updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const updates = req.body;

        // Check if the student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        // If handle is present, fetch updated ratings
        if (updates.codeforcesHandle) {
            const { currentRating, maxRating } = await fetchCodeforcesData(updates.codeforcesHandle);
            updates.currentRating = currentRating;
            updates.maxRating = maxRating;
        }

        // Now update student with new values
        const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, { new: true });

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            error: 'Failed to update student',
            details: err.message
        });
    }
};

// DELETE a student by ID
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
