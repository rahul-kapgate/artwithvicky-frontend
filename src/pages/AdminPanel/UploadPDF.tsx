import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface Course {
  _id: string;
  title: string;
  description: string;
}

function PDFUpload() {
  const [title, setTitle] = useState("");
  const [fileType, setFileType] = useState("pyq");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
        console.log(response);
        throw new Error(result.message || "Upload failed");
      }

      toast.success("PDF uploaded successfully");
      setTitle("");
      setCourseId("");
      setFile(null);
      setFileType("pyq");

      // Reset file input manually
      const input = document.getElementById("fileInput") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">📄 Upload PDF</h2>
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
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={uploading || loadingCourses}
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </Button>
      </div>
    </div>
  );
}

export default PDFUpload;
