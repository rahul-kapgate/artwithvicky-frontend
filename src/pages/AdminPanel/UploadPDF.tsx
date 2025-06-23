import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

function PDFUpload() {
  const [title, setTitle] = useState("");
  const [fileType, setFileType] = useState("pyq");
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
            Authorization: `Bearer ${token}`, // ✅ Only this header
            // ❌ Do NOT manually set "Content-Type"
          },
          body: formData, // ✅ FormData automatically sets the correct headers
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.log(response)
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Week 3 PYQs"
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
          <Label>Course ID</Label>
          <Input
            type="text"
            placeholder="6848338d4ef958e38643f3c3"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
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
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </Button>
      </form>
    </div>
  );
}

export default PDFUpload;
