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

    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    if (!editingId && !imageFile) {
      toast.error("Image file is required for upload");
      return;
    }

    try {
      setUploading(true);

      const endpoint = editingId
        ? `https://artwithvicky-backend.onrender.com/api/admin/images/${editingId}`
        : `https://artwithvicky-backend.onrender.com/api/admin/image-upload`;

      let body: FormData | string;
      let headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      if (editingId) {
        // Edit mode: Use JSON payload
        body = JSON.stringify({ title, description });
        headers["Content-Type"] = "application/json";
      } else {
        // Upload mode: Use FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (imageFile) formData.append("file", imageFile);
        body = formData;
      }

      const res = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers,
        body,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Operation failed");

      toast.success(
        editingId
          ? "Artwork updated successfully"
          : "Artwork uploaded successfully"
      );

      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      fetchImages();

      const input = document.getElementById("imageInput") as HTMLInputElement;
      if (input) input.value = "";
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
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
    setImageFile(null); // Ensure no image file is set
    setEditingId(art._id);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {editingId ? "✏️ Edit Artwork" : "🖼️ Upload Artwork"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter artwork title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Show image input only in upload mode */}
        {!editingId && (
          <div>
            <Label>Image File</Label>
            <Input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        {/* In edit mode, show preview with a note that image is not editable */}
        {editingId && previewUrl && (
          <div>
            <Label>Current Image (Not Editable)</Label>
            <div className="w-full mt-4 rounded border overflow-hidden">
              <img
                src={previewUrl}
                alt="Current artwork"
                className="w-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              The image cannot be changed in edit mode.
            </p>
          </div>
        )}

        {/* Show preview for new uploads */}
        {!editingId && previewUrl && (
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
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={uploading}
        >
          {uploading
            ? "Processing..."
            : editingId
            ? "Update Artwork"
            : "Upload Artwork"}
        </Button>
      </form>

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
