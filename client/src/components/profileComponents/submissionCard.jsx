export default function submissionCard({ cfData }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submission Summary</h2>
            {cfData && cfData.submissions && cfData.submissions.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{cfData.submissions.length}</div>
                    <p className="text-gray-600">Total Submissions</p>
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No problem-solving data available.</p>
                </div>
            )}
        </div>
    );
}