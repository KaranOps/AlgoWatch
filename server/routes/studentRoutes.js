const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

//CRUD routes
router.post('/', studentController.createStudent); //Create
router.get('/', studentController.getAllStudents); //Read all
router.get('/:id', studentController.getStudentById); //Read one student
router.put('/:id', studentController.updateStudent); //Update student 
router.delete('/:id', studentController.deleteStudent); //Delete student
router.patch('/:id/email-toggle', studentController.updateReminder); //update the email reminder

module.exports = router;