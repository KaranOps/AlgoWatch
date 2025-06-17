export default function errorMessage({ message }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <p className="text-red-600 text-lg font-medium">{message}</p>
            </div>
        </div>
    );
}