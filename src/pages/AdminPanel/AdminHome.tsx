import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, BookOpen, AlertCircle } from "lucide-react";

interface Course {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  authorizedCourses: Course[];
}

function AdminHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async (userId: string, courseId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found");
        return;
      }

      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/admin/assign-courses",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            courseIds: [courseId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to assign course: ${response.status}`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                authorizedCourses: [
                  ...user.authorizedCourses,
                  { _id: courseId, title: `Course ${courseId}` },
                ],
              }
            : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign course");
    }
  };

  const removeCourse = async (userId: string, courseId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found");
        return;
      }

      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/admin/remove-courses",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            courseIds: [courseId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove course: ${response.status}`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                authorizedCourses: user.authorizedCourses.filter(
                  (course) => course._id !== courseId
                ),
              }
            : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove course");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Users
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white text-gray-800">
      {/* Header Section */}
      <section className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="text-pink-600">Admin Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage users and oversee the Artistic Vicky platform
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{users.length} Total Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Users Table Section */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Registered Users & Courses
          </h2>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm text-left rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Authorized Courses</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {user._id.slice(-8)}
                      </td>
                      <td className="px-4 py-3">
                        {user.authorizedCourses.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {user.authorizedCourses.map((course) => (
                              <li
                                key={course._id}
                                className="flex justify-between"
                              >
                                <span>{course.title}</span>
                                <button
                                  onClick={() =>
                                    removeCourse(user._id, course._id)
                                  }
                                  className="ml-4 text-red-500 text-xs hover:underline"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">
                            No courses
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          onClick={() =>
                            assignCourse(user._id, "6848338d4ef958e38643f3c3")
                          }
                          className="bg-pink-600 hover:bg-pink-700 text-white text-xs"
                        >
                          Assign Default Course
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-pink-50 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <Users className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                {users.length}
              </h3>
              <p className="text-gray-600">Total Users</p>
            </Card>

            <Card className="text-center p-6">
              <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                {users.reduce(
                  (total, user) => total + user.authorizedCourses.length,
                  0
                )}
              </h3>
              <p className="text-gray-600">Course Enrollments</p>
            </Card>

            <Card className="text-center p-6">
              <Mail className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                {
                  users.filter((user) => user.authorizedCourses.length > 0)
                    .length
                }
              </h3>
              <p className="text-gray-600">Active Students</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminHome;
