import React, { useState, useEffect } from "react";
import { Download, ExternalLink, Edit, Trash } from "lucide-react";

const Dashboard = () => {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch from API
    setTimeout(() => {
      setQrCodes([
        {
          id: 1,
          title: "Campaign 1",
          short_code: "abc123",
        },
        {
          id: 2,
          title: "Campaign 2",
          short_code: "xyz789",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const downloadQRCode = (qrCode: any) => {
    console.log("Downloading", qrCode);
  };

  const openEditForm = (qrCode: any) => {
    console.log("Editing", qrCode);
  };

  const handleDeleteQRCode = (id: number, title: string) => {
    console.log("Deleting", id, title);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p className="text-lg">No campaigns yet</p>
        <p className="text-sm">Create your first QR code campaign to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid gap-6">
        {qrCodes.map((qrCode) => (
          <div
            key={qrCode.id}
            className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800"
          >
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">
              {qrCode.title}
            </h2>

            {/* Campaign Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => downloadQRCode(qrCode)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg text-cyan-400 hover:bg-gray-800 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm">Download QR</span>
              </button>

              <a
                href={`/r/${qrCode.short_code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg text-cyan-400 hover:bg-gray-800 transition-colors"
              >
                <ExternalLink size={16} />
                <span className="text-sm">Preview</span>
              </a>

              <button
                onClick={() => openEditForm(qrCode)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-700 rounded-lg text-cyan-400 hover:bg-gray-800 transition-colors"
              >
                <Edit size={16} />
                <span className="text-sm">Edit</span>
              </button>

              <button
                onClick={() => handleDeleteQRCode(qrCode.id, qrCode.title)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-red-700 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
              >
                <Trash size={16} />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
