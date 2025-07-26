import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface Resource {
  _id: string;
  title: string;
  fileType: string;
  courseId: { _id: string };
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  uploadedAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalResources: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function PDFUpload() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Upload form states
  const [title, setTitle] = useState("");
  const [fileType, setFileType] = useState("pyq");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch resources and courses on component mount
  useEffect(() => {
    fetchResources(currentPage);
    fetchCourses();
  }, [currentPage]);

  const fetchResources = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://artwithvicky-backend.onrender.com/api/admin/resources?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch resources");
      }

      setResources(result.data.resources);
      setPagination(result.data.pagination);
    } catch (error: any) {
      toast.error(
        "Failed to load resources: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);

      // For demo purposes, using sample data. Replace with actual API call:
      // const token = localStorage.getItem("accessToken");
      // const response = await fetch("https://artwithvicky-backend.onrender.com/api/courses", {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });

      // Simulating API call with sample data
      setTimeout(() => {
        setCourses([
          {
            _id: "6848338d4ef958e38643f3c3",
            title: "MAH AAC CET Entrance Exam Preparation",
            description:
              "Comprehensive preparation course for the Maharashtra Applied Arts and Crafts Common Entrance Test (AAC CET).",
          },
        ]);
        setLoadingCourses(false);
      }, 1000);
    } catch (error: any) {
      toast.error(
        "Failed to load courses: " + (error.message || "Unknown error")
      );
      setLoadingCourses(false);
    }
  };

  const handleUpdate = async (resourceId: string) => {
    if (!updatedTitle) {
      toast.error("Title is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://artwithvicky-backend.onrender.com/api/admin/resources/${resourceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Update failed");
      }

      toast.success("Resource updated successfully");
      setEditingResource(null);
      setUpdatedTitle("");
      setUpdatedDescription("");
      fetchResources(currentPage);
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://artwithvicky-backend.onrender.com/api/admin/resources/${resourceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Deletion failed");
      }

      toast.success("Resource deleted successfully");
      fetchResources(currentPage);
    } catch (error: any) {
      toast.error(error.message || "Deletion failed");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !fileType || !courseId) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("fileType", fileType);
    formData.append("courseId", courseId);

    try {
      setUploading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/admin/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      toast.success("PDF uploaded successfully");
      setTitle("");
      setCourseId("");
      setFile(null);
      setFileType("pyq");
      const input = document.getElementById("fileInput") as HTMLInputElement;
      if (input) input.value = "";
      fetchResources(currentPage);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (resource: Resource) => {
    setEditingResource(resource);
    setUpdatedTitle(resource.title);
    setUpdatedDescription("");
  };

  const cancelEditing = () => {
    setEditingResource(null);
    setUpdatedTitle("");
    setUpdatedDescription("");
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📚 Manage Resources
      </h2>

      {/* Upload Form */}
      <div className="mb-10 border p-6 rounded">
        <h3 className="text-xl font-semibold mb-4">📄 Upload PDF</h3>
        <div className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter PDF Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>File Type</Label>
            <select
              className="w-full border px-3 py-2 rounded text-sm"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="notes">Notes</option>
              <option value="ebook">eBook</option>
              <option value="pyq">PYQ</option>
              <option value="session">Session</option>
            </select>
          </div>

          <div>
            <Label>Course</Label>
            {loadingCourses ? (
              <div className="w-full border px-3 py-2 rounded text-sm text-gray-500">
                Loading courses...
              </div>
            ) : (
              <select
                className="w-full border px-3 py-2 rounded text-sm"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <Label>PDF File</Label>
            <Input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            onClick={handleUpload}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={uploading || loadingCourses}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </Button>
        </div>
      </div>

      {/* Resource List */}
      {loading ? (
        <div className="text-center">Loading resources...</div>
      ) : (
        <>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div
                key={resource._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                {editingResource?._id === resource._id ? (
                  <div className="w-full">
                    <div className="mb-2">
                      <Label>Title</Label>
                      <Input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <Label>Description</Label>
                      <Input
                        type="text"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdate(resource._id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-gray-600">
                        Type: {resource.fileType} | Uploaded:{" "}
                        {new Date(resource.uploadedAt).toLocaleDateString()}
                      </p>
                      <a
                        href={resource.cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View PDF
                      </a>
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={() => startEditing(resource)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(resource._id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {pagination && (
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Previous
              </Button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PDFUpload;
