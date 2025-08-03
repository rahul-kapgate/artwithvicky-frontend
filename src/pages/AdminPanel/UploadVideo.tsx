import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}

function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);


  const token = localStorage.getItem("accessToken");

  const confirmDelete = (id: string) => {
    setSelectedVideoId(id);
    setShowConfirm(true);
  };


  // Fetch all videos
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(
        "https://artwithvicky-backend.onrender.com/api/videos/get-all-videos"
      );
      const data = await res.json();
      setVideos(data|| []);
    } catch (err) {
      toast.error("Failed to fetch videos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl) {
      toast.error("Title, description, and video URL are required");
      return;
    }

    try {
      const endpoint =
        "https://artwithvicky-backend.onrender.com/api/videos/save-video";
      const body = JSON.stringify({ title, description, videoUrl });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Upload failed");

      toast.success("Video uploaded successfully");

      // Reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      fetchVideos();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!selectedVideoId) return;

    try {
      const res = await fetch(
        `https://artwithvicky-backend.onrender.com/api/videos/delete-video/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Delete failed");

      toast.success("Video deleted successfully");
      fetchVideos(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setShowConfirm(false);
      setSelectedVideoId(null);
    }
  };

 
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        🎥 Upload Video
      </h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter video title"
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

        <div>
          <Label>Video URL</Label>
          <Input
            type="url"
            placeholder="Enter video URL (e.g., https://youtu.be/...)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
        </div>

        {videoUrl && (
          <div className="w-full mt-4 rounded border overflow-hidden">
            <iframe
              src={videoUrl.replace("youtu.be", "youtube.com/embed")}
              title="Video Preview"
              className="w-full h-64"
              allowFullScreen
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Upload Video
        </Button>
      </form>

      {/* Uploaded Videos */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">📂 Uploaded Videos</h3>
        {videos.length === 0 && (
          <p className="text-gray-600">No videos uploaded yet</p>
        )}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="border rounded-lg overflow-hidden shadow relative"
            >
              <iframe
                src={video.videoUrl.replace("youtu.be", "youtube.com/embed")}
                title={video.title}
                className="w-full h-48"
                allowFullScreen
              />
              <div className="p-4">
                <h4 className="font-semibold">{video.title}</h4>
                <p className="text-sm text-gray-600">{video.description}</p>
                <Button
                  variant="destructive"
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => confirmDelete(video._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this video?
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedVideoId!)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );



}

export default UploadVideo;
