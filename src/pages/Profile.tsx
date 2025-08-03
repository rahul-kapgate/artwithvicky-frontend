import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface MockTest {
  _id: string;
  dateOfTest: string;
  obtainedMarks: number;
  totalMarks: number;
}

interface ProfileData {
  user: {
    fullName: string;
    email: string;
    mobile: string;
  };
  mockTests: MockTest[];
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `https://artwithvicky-backend.onrender.com/api/users/profile/${user.userId}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center animate-pulse">Loading profile...</div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load profile.
      </div>
    );
  }

  const { fullName, email, mobile } = profile.user;
  const mockTests = profile.mockTests;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 p-6 rounded-xl text-white shadow-md">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full bg-white text-purple-700 font-bold text-2xl flex items-center justify-center shadow">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{fullName}</h1>
            <p className="text-sm">{email}</p>
            <p className="text-sm">📞 {mobile}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📚 Mock Test History
        </h2>

        {mockTests.length === 0 ? (
          <p className="text-gray-500">No mock tests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {mockTests.map((test, index) => {
                  const percentage = (
                    (test.obtainedMarks / test.totalMarks) *
                    100
                  ).toFixed(1);
                  return (
                    <tr
                      key={test._id}
                      className="bg-gray-50 hover:bg-purple-50 transition duration-200 shadow-sm rounded"
                    >
                      <td className="p-3 font-semibold text-gray-700">
                        {index + 1}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(test.dateOfTest).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-purple-700 font-bold">
                        {test.obtainedMarks}
                      </td>
                      <td className="p-3">{test.totalMarks}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            Number(percentage) >= 75
                              ? "bg-green-100 text-green-700"
                              : Number(percentage) >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
