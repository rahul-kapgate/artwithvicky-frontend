
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-purple-700">Profile</h1>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 text-white flex items-center justify-center font-bold text-xl">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900">{user.fullName}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
