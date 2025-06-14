import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const StudentForm = ({ selected, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
  });

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || '',
        email: selected.email || '',
        phone: selected.phone || '',
        codeforcesHandle: selected.codeforcesHandle || '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
      });
    }
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected && selected._id) {
        await axios.put(`${API_URL}/students/${selected._id}`, form);
      } else {
        await axios.post(`${API_URL}/students`, form);
      }
      onSuccess();
    } catch (err) {
      console.error('Error submitting form:', err);
      alert("Failed to save student. Please check if Codeforces handle is correct.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 max-w-xl"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {selected ? 'Update Student' : 'Add New Student'}
      </h2>

      {[
        { name: 'name', placeholder: 'Name', type: 'text' },
        { name: 'email', placeholder: 'Email', type: 'email' },
        { name: 'phone', placeholder: 'Phone', type: 'tel' },
        { name: 'codeforcesHandle', placeholder: 'Codeforces Handle', type: 'text' },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
            {field.placeholder}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      ))}
        
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
        >
            

          {selected ? 'Update' : 'Add'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition duration-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
