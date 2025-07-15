import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CourseAssignment from "./CourseAssignment.tsx";
import UploadPDF from "./UploadPDF.tsx";
import UploadImage from "./UploadImage.tsx";

function AdminHome() {
  const [activeTab, setActiveTab] = useState<
    "assignment" | "upload" | "images"
  >("assignment");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800">
      {/* Header */}
      <header className="text-center py-6 sm:py-10 border-b border-gray-200">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Admin <span className="text-purple-600">Dashboard</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your platform operations</p>
      </header>

      {/* Tabs */}
      <section className="py-4 px-4 sm:px-6 max-w-full sm:max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 justify-center mb-6">
          <Button
            variant={activeTab === "assignment" ? "default" : "outline"}
            onClick={() => setActiveTab("assignment")}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            🎓 Assign Courses
          </Button>
          <Button
            variant={activeTab === "upload" ? "default" : "outline"}
            onClick={() => setActiveTab("upload")}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            📄 Upload PDFs
          </Button>
          <Button
            variant={activeTab === "images" ? "default" : "outline"}
            onClick={() => setActiveTab("images")}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            🖼️ Upload Images
          </Button>
        </div>

        {/* Content */}
        <Card className="p-4 sm:p-6 overflow-auto">
          {activeTab === "assignment" && <CourseAssignment />}
          {activeTab === "upload" && <UploadPDF />}
          {activeTab === "images" && <UploadImage />}
        </Card>
      </section>
    </div>
  );
}

export default AdminHome;
