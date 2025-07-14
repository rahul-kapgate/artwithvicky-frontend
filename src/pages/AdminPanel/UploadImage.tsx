import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface Course {
  _id: string;
  title: string;
  description: string;
}

function UploadImage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !imageFile) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setUploading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/admin/image-upload",
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
        throw new Error(result.message || "Image upload failed");
      }

      toast.success("Image uploaded successfully");
      setTitle("");
      setDescription("");
      setCourseId("");
      setImageFile(null);
      setPreviewUrl(null);

      // Reset input manually
      const input = document.getElementById("imageInput") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        🖼️ Upload Artwork
      </h2>
      <div className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter artwork title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Image File</Label>
          <Input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {previewUrl && (
          <div className="w-full mt-4 rounded border overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full object-cover"
            />
          </div>
        )}

        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>
    </div>
  );
}

export default UploadImage;
