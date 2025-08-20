import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Download, ExternalLink, Plus, QrCode as QrCodeIcon } from 'lucide-react';
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
}

export const QRCodes: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    googleBusinessUrl: '',
  });
  // The canvasRef is no longer strictly needed for downloadQRCode with toDataURL,
  // but keeping it for potential future use or if you have other canvas needs.
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

  const handleCreateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create QR codes.');
      return;
    }

    try {
      const shortCode = generateShortCode();
      const trackingUrl = `${window.location.origin}/r/${shortCode}`;

      const { error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.id,
          title: formData.title,
          google_business_url: formData.googleBusinessUrl,
          short_code: shortCode,
        });

      if (error) throw error;

      toast.success('QR code created successfully!');
      setFormData({ title: '', googleBusinessUrl: '' });
      setShowCreateForm(false);
      fetchQRCodes();
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to create QR code');
    }
  };

  const downloadQRCode = async (qrCodeData: QRCodeData) => {
    try {
      const trackingUrl = `${window.location.origin}/r/${qrCodeData.short_code}`;
      console.log('Generating QR code for URL:', trackingUrl); // Debugging log
      
      // Use QRCode.toDataURL directly to generate the image data
      const dataUrl = await QRCode.toDataURL(trackingUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Convert data URL to download link
      const link = document.createElement('a');
      link.download = `${qrCodeData.title}-qr-code.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            QR Codes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your review QR codes and tracking links
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New QR Code</h3>
          <form onSubmit={handleCreateQRCode} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Main Location Reviews"
              />
            </div>
            <div>
              <label htmlFor="googleBusinessUrl" className="block text-sm font-medium text-gray-700">
                Google Business Review URL
              </label>
              <input
                type="url"
                id="googleBusinessUrl"
                required
                value={formData.googleBusinessUrl}
                onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://g.page/your-business/review"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create QR Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Codes Grid */}
      {qrCodes.length === 0 ? (
        <div className="text-center py-12">
          <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first review QR code.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create QR Code
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {qrCode.title}
                  </h3>
                  <QrCodeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="truncate">
                    {window.location.origin}/r/{qrCode.short_code}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Scans</span>
                    <span className="font-medium text-gray-900">{qrCode.scan_count}</span>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => downloadQRCode(qrCode)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <a
                    href={`/r/${qrCode.short_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Test
                  </a>
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
