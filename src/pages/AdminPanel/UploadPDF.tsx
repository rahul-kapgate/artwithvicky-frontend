import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  link: string;
  createdAt: string;
}

function PDFUpload() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedType, setUpdatedType] = useState("");
  const [updatedLink, setUpdatedLink] = useState("");

  // Upload form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("pyq");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://artwithvicky-backend.onrender.com/api/resources/get-all`,
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

      setResources(result.resources);
    } catch (error: any) {
      toast.error(
        "Failed to load resources: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (resourceId: string) => {
    if (!updatedTitle || !updatedType || !updatedLink) {
      toast.error("Title, type, and link are required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://artwithvicky-backend.onrender.com/api/resources/update-by-id/${resourceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
            type: updatedType,
            link: updatedLink,
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
      setUpdatedType("");
      setUpdatedLink("");
      fetchResources();
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
        `https://artwithvicky-backend.onrender.com/api/resources/delete-by-id/${resourceId}`,
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
      fetchResources();
    } catch (error: any) {
      toast.error(error.message || "Deletion failed");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !type || !link) {
      toast.error("Title, type, and link are required");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/resources/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, type, link }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      toast.success("Resource created successfully");
      setTitle("");
      setDescription("");
      setType("pyq");
      setLink("");
      fetchResources();
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (resource: Resource) => {
    setEditingResource(resource);
    setUpdatedTitle(resource.title);
    setUpdatedDescription(resource.description || "");
    setUpdatedType(resource.type);
    setUpdatedLink(resource.link);
  };

  const cancelEditing = () => {
    setEditingResource(null);
    setUpdatedTitle("");
    setUpdatedDescription("");
    setUpdatedType("");
    setUpdatedLink("");
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📚 Manage Resources
      </h2>

      {/* Upload Form */}
      <div className="mb-10 border p-6 rounded">
        <h3 className="text-xl font-semibold mb-4">📄 Create Resource</h3>
        <div className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              type="text"
              placeholder="Enter Resource Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <select
              className="w-full border px-3 py-2 rounded text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="notes">Notes</option>
              <option value="ebook">eBook</option>
              <option value="pyq">PYQ</option>
              <option value="session">Session</option>
            </select>
          </div>

          <div>
            <Label>Link</Label>
            <Input
              type="text"
              placeholder="Enter Google Drive Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <Button
            onClick={handleUpload}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={uploading}
          >
            {uploading ? "Creating..." : "Create Resource"}
          </Button>
        </div>
      </div>

      {/* Resource List */}
      {loading ? (
        <div className="text-center">Loading resources...</div>
      ) : (
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
                  <div className="mb-2">
                    <Label>Type</Label>
                    <select
                      className="w-full border px-3 py-2 rounded text-sm"
                      value={updatedType}
                      onChange={(e) => setUpdatedType(e.target.value)}
                    >
                      <option value="notes">Notes</option>
                      <option value="ebook">eBook</option>
                      <option value="pyq">PYQ</option>
                      <option value="session">Session</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <Label>Link</Label>
                    <Input
                      type="text"
                      value={updatedLink}
                      onChange={(e) => setUpdatedLink(e.target.value)}
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
                      {resource.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: {resource.type} | Uploaded:{" "}
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resource
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
      )}
    </div>
  );
}

export default PDFUpload;
