import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Download, ArrowLeft } from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  link: string;
  createdAt: string;
}

function ResourcePage() {
  const navigate = useNavigate(); // <-- hook to navigate
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/resources/get-all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data?.resources) throw new Error("Unexpected response format");
      setResources(data.resources);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    try {
      let downloadUrl = url;
      const fileIdMatch = url.match(/\/d\/(.+?)\/view/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.target = "_blank"; // prevent redirect
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please try again.");
    }
  };

  // Group resources
  const groupedResources = {
    notes: resources.filter((r) => r.type.toLowerCase() === "notes"),
    pyq: resources.filter((r) => r.type.toLowerCase() === "pyq"),
    ebook: resources.filter((r) => r.type.toLowerCase() === "ebook"),
    session: resources.filter((r) => r.type.toLowerCase() === "session"),
    others: resources.filter(
      (r) => !["notes", "pyq", "ebook", "session"].includes(r.type.toLowerCase())
    ),
  };

  const renderResourceSection = (title: string, resources: Resource[]) => {
    if (resources.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 capitalize">{title}</h2>
        <ul className="space-y-4">
          {resources.map((resource) => (
            <li
              key={resource._id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <button
                  onClick={() => handleDownload(resource.link, `${resource.title}.pdf`)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {resource.title}
                </button>
                <p className="text-sm text-gray-600">{resource.description}</p>
                <p className="text-sm text-gray-600">
                  Type: {resource.type} | Uploaded:{" "}
                  {new Date(resource.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDownload(resource.link, `${resource.title}.pdf`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-600">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-lg text-red-600 font-medium">Error:</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 p-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800 font-medium"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Course Resources</h1>

      {resources.length > 0 ? (
        <>
          {renderResourceSection("Notes", groupedResources.notes)}
          {renderResourceSection("Previous Year Questions", groupedResources.pyq)}
          {renderResourceSection("E-Books", groupedResources.ebook)}
          {renderResourceSection("Sessions", groupedResources.session)}
          {renderResourceSection("Other Resources", groupedResources.others)}
        </>
      ) : (
        <p className="text-gray-600 italic">No resources available</p>
      )}
    </div>
  );
}

export default ResourcePage;
