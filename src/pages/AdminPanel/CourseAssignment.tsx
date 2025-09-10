import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { fetchWithAuth } from "../../utils/fetchWithAuth.ts";

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

const COURSE_LIST = [
  { _id: "6848338d4ef958e38643f3c3", title: "Full Course" },
  { _id: "68c1990bb8e0f3986be6abfb", title: "Mock Test" },
];

const CourseAssignment: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth(
        "https://artwithvicky-backend.onrender.com/api/admin/users"
      );
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async (userId: string, course: Course) => {
    try {
      await fetchWithAuth(
        "https://artwithvicky-backend.onrender.com/api/admin/assign-courses",
        {
          method: "POST",
          body: JSON.stringify({
            userId,
            courseIds: [course._id],
          }),
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                authorizedCourses: [...user.authorizedCourses, course],
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
      await fetchWithAuth(
        "https://artwithvicky-backend.onrender.com/api/admin/remove-courses",
        {
          method: "POST",
          body: JSON.stringify({
            userId,
            courseIds: [courseId],
          }),
        }
      );

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
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" />
        <p className="text-gray-600">Loading users...</p>
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
                      <li key={course._id}>{course.title}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 italic">No courses</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex flex-col space-y-2">
                  {COURSE_LIST.map((course) => {
                    const isAssigned = user.authorizedCourses.some(
                      (c) => c._id === course._id
                    );

                    return isAssigned ? (
                      <Button
                        key={course._id}
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCourse(user._id, course._id)}
                        className="w-36"
                      >
                        Remove {course.title}
                      </Button>
                    ) : (
                      <Button
                        key={course._id}
                        size="sm"
                        onClick={() => assignCourse(user._id, course)}
                        className="w-36 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Assign {course.title}
                      </Button>
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseAssignment;
