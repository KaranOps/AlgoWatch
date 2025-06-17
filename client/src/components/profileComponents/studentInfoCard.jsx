export default function studentInfoCard({ student }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{student.email}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{student.phone}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Codeforces Handle</p>
                    <p className="text-gray-900 font-mono">{student.codeforcesHandle}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Current Rating</p>
                    <p className="text-gray-900 font-semibold">{student.currentRating}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Max Rating</p>
                    <p className="text-gray-900 font-semibold">{student.maxRating}</p>
                </div>
            </div>
        </div>
    );
}