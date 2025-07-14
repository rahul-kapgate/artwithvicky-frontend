import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

function UploadImage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const token = localStorage.getItem("accessToken");

  // Fetch all images
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(
        "https://artwithvicky-backend.onrender.com/api/images/get-images"
      );
      const data = await res.json();
      setArtworks(data.data);
    } catch (err) {
      toast.error("Failed to fetch artworks");
    }
  };

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

    if (!title || !description || (!imageFile && !editingId)) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    if (imageFile) formData.append("file", imageFile);
    formData.append("title", title);
    formData.append("description", description);

    const endpoint = editingId
      ? `https://artwithvicky-backend.onrender.com/api/admin/images/${editingId}`
      : `https://artwithvicky-backend.onrender.com/api/admin/image-upload`;

    try {
      setUploading(true);

      const res = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Upload failed");

      toast.success(
        editingId ? "Image updated successfully" : "Image uploaded successfully"
      );

      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      fetchImages();

      const input = document.getElementById("imageInput") as HTMLInputElement;
      if (input) input.value = "";
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(
        `https://artwithvicky-backend.onrender.com/api/admin/images/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Delete failed");

      toast.success("Image deleted successfully");
      fetchImages();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleEdit = (art: Artwork) => {
    setTitle(art.title);
    setDescription(art.description);
    setPreviewUrl(art.imageUrl);
    setEditingId(art._id);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {editingId ? "✏️ Edit Artwork" : "🖼️ Upload Artwork"}
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
          <Label>Image File {editingId ? "(optional)" : ""}</Label>
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
          {uploading
            ? "Uploading..."
            : editingId
            ? "Update Image"
            : "Upload Image"}
        </Button>
      </div>

      {/* Display Uploaded Artworks */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">📂 Uploaded Images</h3>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {artworks.map((art) => (
            <div
              key={art._id}
              className="border rounded-lg overflow-hidden shadow"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold">{art.title}</h4>
                <p className="text-sm text-gray-600">{art.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(art)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(art._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
