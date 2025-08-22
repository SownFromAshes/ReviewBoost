import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Download, ExternalLink, Plus, QrCode as QrCodeIcon, Trash, UploadCloud, Edit } from 'lucide-react'; // Added UploadCloud and Edit icons
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface QRCodeData {
  id: string;
  title: string;
  google_business_url: string;
  short_code: string;
  scan_count: number;
  created_at: string;
  qr_color_dark: string | null;
  qr_color_light: string | null;
  qr_logo_url: string | null; // Added
}

export const QRCodes: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    googleBusinessUrl: '',
    qrColorDark: '#000000', // Default dark color
    qrColorLight: '#ffffff', // Default light color
    logoFile: null as File | null, // Added for logo file
    logoPreviewUrl: '' as string, // Added for logo preview
  });
  // State variables for editing
  const [editingQRCode, setEditingQRCode] = useState<QRCodeData | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    googleBusinessUrl: '',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQrCodes(data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error('Logo file size should not exceed 1MB.');
        setFormData({ ...formData, logoFile: null, logoPreviewUrl: '' });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, logoFile: file, logoPreviewUrl: previewUrl });
    } else {
      setFormData({ ...formData, logoFile: null, logoPreviewUrl: '' });
    }
  };

  const handleCreateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create QR codes.');
      return;
    }

    let logoUrl: string | null = null;
    if (formData.logoFile) {
      const fileExt = formData.logoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `qr-code-logos/${fileName}`; // Ensure this matches your Supabase Storage bucket name

      try {
        const { data, error: uploadError } = await supabase.storage
          .from('qr-code-logos') // Your bucket name
          .upload(filePath, formData.logoFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('qr-code-logos')
          .getPublicUrl(filePath);
        
        logoUrl = publicUrlData.publicUrl;

      } catch (error) {
        console.error('Error uploading logo:', error);
        toast.error('Failed to upload logo. Please try again.');
        return;
      }
    }

    try {
      const shortCode = generateShortCode();

      const { error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.id,
          title: formData.title,
          google_business_url: formData.googleBusinessUrl,
          short_code: shortCode,
          qr_color_dark: formData.qrColorDark,
          qr_color_light: formData.qrColorLight,
          qr_logo_url: logoUrl, // Save logo URL
        });

      if (error) throw error;

      toast.success('QR code created successfully!');
      setFormData({
        title: '',
        googleBusinessUrl: '',
        qrColorDark: '#000000',
        qrColorLight: '#ffffff',
        logoFile: null,
        logoPreviewUrl: '',
      }); // Reset form
      setShowCreateForm(false);
      fetchQRCodes();
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to create QR code');
    }
  };

  const downloadQRCode = async (qrCodeData: QRCodeData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const trackingUrl = `${window.location.origin}/r/${qrCodeData.short_code}`;
      console.log('Generating QR code for URL:', trackingUrl);

      // Generate QR code data URL
      const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: qrCodeData.qr_color_dark || '#000000',
          light: qrCodeData.qr_color_light || '#ffffff',
        },
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const qrImage = new Image();
      qrImage.src = qrCodeDataUrl;

      qrImage.onload = async () => {
        canvas.width = qrImage.width;
        canvas.height = qrImage.height;
        ctx.drawImage(qrImage, 0, 0);

        if (qrCodeData.qr_logo_url) {
          const logoImage = new Image();
          logoImage.src = qrCodeData.qr_logo_url;
          logoImage.crossOrigin = 'Anonymous'; // Required for cross-origin images

          logoImage.onload = () => {
            const qrSize = qrImage.width;
            const logoSize = qrSize * 0.25; // Logo size, e.g., 25% of QR code size
            const x = (qrSize - logoSize) / 2;
            const y = (qrSize - logoSize) / 2;

            // Draw a white background for the logo to ensure readability
            ctx.fillStyle = qrCodeData.qr_color_light || '#ffffff';
            ctx.fillRect(x, y, logoSize, logoSize);
            
            // Draw the logo
            ctx.drawImage(logoImage, x, y, logoSize, logoSize);

            const link = document.createElement('a');
            link.download = `${qrCodeData.title}-qr-code.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          };

          logoImage.onerror = (err) => {
            console.error('Error loading logo image:', err);
            toast.error('Failed to load logo image for QR code.');
            // Fallback to downloading QR code without logo
            const link = document.createElement('a');
            link.download = `${qrCodeData.title}-qr-code.png`;
            link.href = qrCodeDataUrl;
            link.click();
          };
        } else {
          // If no logo, just download the QR code
          const link = document.createElement('a');
          link.download = `${qrCodeData.title}-qr-code.png`;
          link.href = qrCodeDataUrl;
          link.click();
        }
      };

      qrImage.onerror = (err) => {
        console.error('Error loading QR code image:', err);
        toast.error('Failed to generate QR code image.');
      };

    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handleDeleteQRCode = async (qrCodeId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', qrCodeId);

      if (error) throw error;

      toast.success(`QR code "${title}" deleted successfully!`);
      fetchQRCodes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  // Function to open the edit form
  const openEditForm = (qrCode: QRCodeData) => {
    setEditingQRCode(qrCode);
    setEditFormData({
      title: qrCode.title,
      googleBusinessUrl: qrCode.google_business_url,
    });
    setShowEditForm(true);
    setShowCreateForm(false); // Hide create form if open
  };

  // Function to handle updating a QR code
  const handleUpdateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQRCode) return;

    try {
      const { error } = await supabase
        .from('qr_codes')
        .update({
          title: editFormData.title,
          google_business_url: editFormData.googleBusinessUrl,
        })
        .eq('id', editingQRCode.id);

      if (error) throw error;

      toast.success('QR code updated successfully!');
      setShowEditForm(false);
      setEditingQRCode(null);
      fetchQRCodes(); // Refresh the list
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            QR Codes
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            Manage your review QR codes and tracking links
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => { setShowCreateForm(true); setShowEditForm(false); }} // Ensure edit form is closed
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-6 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Create New QR Code</h3>
          <form onSubmit={handleCreateQRCode} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="e.g., Main Location Reviews"
              />
            </div>
            <div>
              <label htmlFor="googleBusinessUrl" className="block text-sm font-medium text-gray-300">
                Google Business Review URL
              </label>
              <input
                type="url"
                id="googleBusinessUrl"
                required
                value={formData.googleBusinessUrl}
                onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="https://g.page/your-business/review"
              />
            </div>
            {/* Color input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="qrColorDark" className="block text-sm font-medium text-gray-300">
                  QR Code Foreground Color
                </label>
                <input
                  type="color"
                  id="qrColorDark"
                  value={formData.qrColorDark}
                  onChange={(e) => setFormData({ ...formData, qrColorDark: e.target.value })}
                  className="mt-1 block w-full h-10 rounded-xl border border-gray-700 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  title="Choose foreground color"
                />
              </div>
              <div>
                <label htmlFor="qrColorLight" className="block text-sm font-medium text-gray-300">
                  QR Code Background Color
                </label>
                <input
                  type="color"
                  id="qrColorLight"
                  value={formData.qrColorLight}
                  onChange={(e) => setFormData({ ...formData, qrColorLight: e.target.value })}
                  className="mt-1 block w-full h-10 rounded-xl border border-gray-700 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  title="Choose background color"
                />
              </div>
            </div>
            {/* Logo Upload Field */}
            <div>
              <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-300">
                Upload Logo (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-500 file:text-white
                    hover:file:bg-cyan-600"
                />
                {formData.logoPreviewUrl && (
                  <img src={formData.logoPreviewUrl} alt="Logo Preview" className="h-16 w-16 object-contain rounded-md border border-gray-700 p-1" />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-400">Max 1MB. Recommended: square image with transparent background.</p>
            </div>
            {/* End Logo Upload Field */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create QR Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && editingQRCode && (
        <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-6 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Edit QR Code: {editingQRCode.title}</h3>
          <form onSubmit={handleUpdateQRCode} className="space-y-4">
            <div>
              <label htmlFor="editTitle" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="editTitle"
                required
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="e.g., Main Location Reviews"
              />
            </div>
            <div>
              <label htmlFor="editGoogleBusinessUrl" className="block text-sm font-medium text-gray-300">
                Google Business Review URL
              </label>
              <input
                type="url"
                id="editGoogleBusinessUrl"
                required
                value={editFormData.googleBusinessUrl}
                onChange={(e) => setEditFormData({ ...editFormData, googleBusinessUrl: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="https://g.page/your-business/review"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => { setShowEditForm(false); setEditingQRCode(null); }}
                className="px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Codes Grid */}
      {qrCodes.length === 0 ? (
        <div className="text-center py-12 mt-6">
          <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-white">No QR codes yet</h3>
          <p className="mt-1 text-sm text-gray-300">
            Get started by creating your first review QR code.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create QR Code
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl hover:border-cyan-500 transition">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white truncate">
                    {qrCode.title}
                  </h3>
                  <QrCodeIcon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-300">
                  <span className="truncate">
                    {window.location.origin}/r/{qrCode.short_code}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Total Scans</span>
                    <span className="font-medium text-white">{qrCode.scan_count}</span>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => downloadQRCode(qrCode)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <a
                    href={`/r/${qrCode.short_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Test
                  </a>
                  <button
                    onClick={() => openEditForm(qrCode)} // Added Edit button
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQRCode(qrCode.id, qrCode.title)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-700 rounded-md shadow-sm text-sm font-medium text-red-300 bg-gray-900/60 hover:bg-gray-800"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden canvas for QR code generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

