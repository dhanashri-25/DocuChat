import Documents from "@/components/Documents";
import React from "react";
export const dynamic = "force-dynamic";
const DashboardLayout = () => {
  return (
    <div className="h-full max-w-7xl mx-auto">
      <h1 className="text-3xl p-5 bg-gray-100 font text-indigo-600 font-extralight">
        My documents
      </h1>
      <Documents></Documents>
    </div>
  );
};

export default DashboardLayout;
