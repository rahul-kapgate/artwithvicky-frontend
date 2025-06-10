import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, BookOpen, AlertCircle } from "lucide-react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  authorizedCourses: string[];
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

      {/* Users Section */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Registered Users
          </h2>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card
                  key={user._id}
                  className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {user.fullName}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600 mb-3">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">User ID:</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {user._id.slice(-8)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Authorized Courses:
                        </span>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <Badge
                            variant={
                              user.authorizedCourses.length > 0
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.authorizedCourses.length}
                          </Badge>
                        </div>
                      </div>

                      {user.authorizedCourses.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Courses:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.authorizedCourses.map((course, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
