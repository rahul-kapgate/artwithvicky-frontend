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

  const token = localStorage.getItem("accessToken");

  // Fetch all videos
//   useEffect(() => {
//     fetchVideos();
//   }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(
        "https://artwithvicky-backend.onrender.com/api/videos/get-videos"
      );
      const data = await res.json();
      setVideos(data.data || []);
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

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        🎥 Upload Video
      </h2>
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

      {/* Display Uploaded Videos */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">📂 Uploaded Videos</h3>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="border rounded-lg overflow-hidden shadow"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;
