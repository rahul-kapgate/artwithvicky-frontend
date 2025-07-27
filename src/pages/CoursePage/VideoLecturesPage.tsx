import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Play,
  ArrowLeft,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

const VideoLecturesPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/videos/get-all-videos"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleBackToList = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    setMuted(false);
    if (playerRef.current) {
      playerRef.current.stopVideo();
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  // Initialize YouTube player when video is selected
  useEffect(() => {
    if (!selectedVideo) return;

    const videoId = getYouTubeVideoId(selectedVideo.videoUrl);

    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("yt-player", {
        videoId,
        events: {
          onReady: () => {
            setMuted(playerRef.current.isMuted());
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === 1); // 1 = playing
          },
        },
      });
    };

    if (!(window as any).YT || !(window as any).YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }
  }, [selectedVideo]);

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" />
        <p className="ml-4 text-gray-600">Loading video lectures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-center py-20">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-lg text-red-600 font-medium">Error:</p>
        <p className="text-gray-600">{error}</p>
        <Button
          onClick={fetchVideos}
          className="mt-4 bg-purple-600 hover:bg-purple-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Button
            onClick={handleBackToList}
            className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Video List
          </Button>

          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video w-full relative">
                <div
                  id="yt-player"
                  className="w-full h-full pointer-events-none"
                />

                <div className="absolute inset-0 z-10 pointer-events-none bg-transparent" />
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold mb-3 text-gray-800">
                  {selectedVideo.title}
                </h1>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {selectedVideo.description}
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded:{" "}
                  {new Date(selectedVideo.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-center items-center gap-4 py-4 border-t px-6 bg-gray-100">
                <Button onClick={() => skipTime(-10)} variant="outline">
                  <RotateCcw className="w-5 h-5" /> -10s
                </Button>
                <Button onClick={togglePlayPause}>
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
                <Button onClick={toggleMute}>
                  {muted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <Button onClick={() => skipTime(10)} variant="outline">
                  +10s <RotateCw className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800">
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Video Lectures
            </h1>
            <p className="text-lg text-gray-600">
              Explore our collection of educational video content
            </p>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card
                  key={video._id}
                  className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleVideoClick(video)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Play className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                        {video.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick(video);
                        }}
                      >
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl shadow-md max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Videos Available
                </h3>
                <p className="text-gray-600 mb-6">
                  There are currently no video lectures available. Check back
                  later for new content!
                </p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => window.history.back()}
                >
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default VideoLecturesPage;
