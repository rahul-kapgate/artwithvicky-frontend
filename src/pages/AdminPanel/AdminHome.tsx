import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CourseAssignment from "./CourseAssignment.tsx";
import UploadPDF from "./UploadPDF.tsx";

function AdminHome() {
  const [activeTab, setActiveTab] = useState<"assignment" | "upload">(
    "assignment"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800">
      {/* Header */}
      <header className="text-center py-10 border-b border-gray-200">
        <h1 className="text-4xl font-bold">
          Admin <span className="text-purple-600">Dashboard</span>
        </h1>
        <p className="text-gray-600 mt-2">Manage your platform operations</p>
      </header>

      {/* Tabs */}
      <section className="py-4 px-6 max-w-6xl mx-auto">
        <div className="flex space-x-4 justify-center mb-6">
          <Button
            variant={activeTab === "assignment" ? "default" : "outline"}
            onClick={() => setActiveTab("assignment")}
          >
            🎓 Assign Courses
          </Button>
          <Button
            variant={activeTab === "upload" ? "default" : "outline"}
            onClick={() => setActiveTab("upload")}
          >
            📄 Upload PDFs
          </Button>
        </div>

        {/* Content */}
        <Card className="p-6">
          {activeTab === "assignment" ? <CourseAssignment /> : <UploadPDF />}
        </Card>
      </section>
    </div>
  );
}

export default AdminHome;
