const Student = require('../models/student');

// CREATE a new student
exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({error: error.message});
    }
};

//Read all students
exports.getAllStudents = async (req,res) =>{
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// READ a single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) res.status(404).json({error: 'Student not found'});
        res.json(student);
    } catch (err) {
        res.status(400).json({error : err.message});
    }
};

// UPDATE a student by ID
exports.updateStudent = async (req,res) =>{
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!student) res.status(404).json({error: 'Student not founf'});
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE a student by ID
exports.deleteStudent = async (req,res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if(!student) res.status(404).json({error: 'Student not found'});
        res.json({message : 'Student Deleted'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};
