import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

interface MockTest {
  mockTestNumber: number;
  dateOfTest: string;
  totalMarks: number;
  obtainedMarks: number;
}

interface UserMockTests {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  mockTests: MockTest[];
}

const MockTestMarks = () => {
  const [data, setData] = useState<UserMockTests[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await fetchWithAuth(
        "https://artwithvicky-backend.onrender.com/api/admin/users-mock-tests"
      );
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = data.find((user) => user._id === selectedUserId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" />
        <p className="text-gray-600">Loading mock test data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-lg text-red-600 font-medium">Error:</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropdown */}
      <div className="max-w-md mx-auto">
        <label
          htmlFor="user-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select User
        </label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">-- Select a user --</option>
          {data.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Display user data */}
      {selectedUser && (
        <div className="overflow-x-auto">
          <div className="text-sm space-y-1 mb-4 text-gray-700">
            <p>
              <strong>Name:</strong> {selectedUser.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Mobile:</strong> {selectedUser.mobile}
            </p>
          </div>

          {selectedUser.mockTests.length === 0 ? (
            <p className="text-gray-400 italic">
              No mock tests available for this user.
            </p>
          ) : (
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="bg-purple-100 text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-2">Test #</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Total Marks</th>
                  <th className="px-4 py-2">Obtained</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.mockTests.map((test) => (
                  <tr
                    key={test.mockTestNumber}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{test.mockTestNumber}</td>
                    <td className="px-4 py-2">
                      {new Date(test.dateOfTest).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{test.totalMarks}</td>
                    <td className="px-4 py-2">{test.obtainedMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default MockTestMarks;
