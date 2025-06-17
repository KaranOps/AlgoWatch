import { Link } from "react-router-dom";

export default function PageHeader({ student, handleReminderToggle }) {
    return (
        <div className="mb-8">
            <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 mb-6"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>
            <div className="md:flex justify-between">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        {student.name}'s Profile
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
                </div>
                <div className="bg-white rounded p-4 shadow mt-6">
                    <p>
                        <strong>Reminders Sent:</strong> {student.reminderCount ?? 0}
                    </p>
                    <div className="flex items-center mt-2">
                        <label htmlFor="autoEmailToggle" className="mr-2 font-medium">
                            Automatic Reminder Emails:
                        </label>
                        <input
                            id="autoEmailToggle" type="checkbox" checked={student.autoEmailEnabled ?? true}
                            onChange={handleReminderToggle}
                        />
                        <span className="ml-2 text-sm">
                            {student.autoEmailEnabled ? "Enabled" : "Disabled"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}