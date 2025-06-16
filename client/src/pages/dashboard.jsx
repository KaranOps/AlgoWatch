import { useState } from 'react';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import Modal from '../components/Modal';
import CronSchedulePanel from '../components/CronSchedulePanel';

export default function Dashboard() {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (student) => {
    setSelected(student);
    setShowForm(true);
  };
  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };
  const handleSuccess = () => {
    setShowForm(false);
    setRefresh((r) => !r);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className=" mx-auto bg-white p-8 rounded-xl shadow-lg">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            🎓 Student Progress Manager
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-5 py-2 rounded-lg shadow"
            onClick={handleAdd}
          >
            ➕ Add Student
          </button>
        </div>
        <StudentTable onEdit={handleEdit} refresh={refresh} />
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <StudentForm
            selected={selected}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
        <div className="flex items-center lg:justify-end md:justify-between sm:justify-center mr-6 sm:mr-2 md:mr-8 lg:mr-22">
          <CronSchedulePanel />
        </div>
      </div>
    </div>
  );
}
