import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Download, ExternalLink, Plus, QrCode as QrCodeIcon, Trash, Edit, Search, Wifi, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription'; // Import useSubscription

interface QRCodeData {
  id: string;
  title: string;
  google_business_url: string;
  short_code: string;
  scan_count: number;
  created_at: string;
  qr_color_dark: string | null;
  qr_color_light: string | null;
  qr_logo_url: string | null;
}

// Define template types and their properties
interface QRTemplates {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  prefill?: {
    title?: string;
    googleBusinessUrl?: string;
    qrColorDark?: string;
    qrColorLight?: string;
  };
  type: 'url' | 'wifi' | 'social';
}

const qrTemplates: QRTemplates[] = [
  {
    id: 'google-review',
    name: 'Google Review',
    description: 'Drive more Google reviews for your business.',
    icon: Search,
    prefill: {
      title: 'Scan for Google Review',
      qrColorDark: '#000000',
      qrColorLight: '#ffffff',
    },
    type: 'url',
  },
  {
    id: 'digital-menu',
    name: 'Digital Menu',
    description: 'Provide easy access to your online menu.',
    icon: ExternalLink,
    prefill: {
      title: 'Scan for Our Menu',
      qrColorDark: '#000000',
      qrColorLight: '#ffffff',
    },
    type: 'url',
  },
  {
    id: 'connect-wifi',
    name: 'Connect to Wi-Fi',
    description: 'Simplify Wi-Fi access for your customers.',
    icon: Wifi,
    type: 'wifi',
  },
  {
    id: 'social-media',
    name: 'Follow Us on Social Media',
    description: 'Increase followers on your social platforms.',
    icon: Share2,
    type: 'social',
  },
];

const TRIAL_QR_CODE_LIMIT = 2; // Define the limit for trial users

export const QRCodes: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<QRTemplates['type'] | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    googleBusinessUrl: '',
    qrColorDark: '#000000',
    qrColorLight: '#ffffff',
    logoFile: null as File | null,
    logoPreviewUrl: '' as string,
    wifiSsid: '',
    wifiPassword: '',
    wifiEncryption: 'WPA' as 'WPA' | 'WEP' | 'nopass',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
  });

  const [editingQRCode, setEditingQRCode] = useState<QRCodeData | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    googleBusinessUrl: '',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription(); // Get hasActiveSubscription from useSubscription

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

    // Trial Limit Enforcement
    if (!hasActiveSubscription() && qrCodes.length >= TRIAL_QR_CODE_LIMIT) {
      toast.error(`You've reached your trial limit of ${TRIAL_QR_CODE_LIMIT} QR codes. Upgrade to create unlimited dynamic QR codes!`);
      return;
    }

    let logoUrl: string | null = null;
    if (formData.logoFile) {
      const fileExt = formData.logoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `qr-code-logos/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('qr-code-logos')
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

      let destinationUrlOrData = formData.googleBusinessUrl;
      if (selectedTemplateType === 'wifi') {
        destinationUrlOrData = `WIFI:S:${formData.wifiSsid};T:${formData.wifiEncryption};P:${formData.wifiPassword};;`;
        toast.error('Wi-Fi QR code generation is not fully implemented. This would require database schema changes and special handling in the redirect logic.');
        return;
      } else if (selectedTemplateType === 'social') {
        toast.error('Social Media QR code generation is not fully implemented. This would require database schema changes and a new landing page component.');
        return;
      }


      const { error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.id,
          title: formData.title,
          google_business_url: destinationUrlOrData,
          short_code: shortCode,
          qr_color_dark: formData.qrColorDark,
          qr_color_light: formData.qrColorLight,
          qr_logo_url: logoUrl,
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
        wifiSsid: '',
        wifiPassword: '',
        wifiEncryption: 'WPA',
        facebookUrl: '',
        instagramUrl: '',
        tiktokUrl: '',
      });
      setShowCreateForm(false);
      setSelectedTemplateType(null);
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
          logoImage.crossOrigin = 'Anonymous';

          logoImage.onload = () => {
            const qrSize = qrImage.width;
            const logoSize = qrSize * 0.25;
            const x = (qrSize - logoSize) / 2;
            const y = (qrSize - logoSize) / 2;

            ctx.fillStyle = qrCodeData.qr_color_light || '#ffffff';
            ctx.fillRect(x, y, logoSize, logoSize);
            
            ctx.drawImage(logoImage, x, y, logoSize, logoSize);

            const link = document.createElement('a');
            link.download = `${qrCodeData.title}-qr-code.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          };

          logoImage.onerror = (err) => {
            console.error('Error loading logo image:', err);
            toast.error('Failed to load logo image for QR code.');
            const link = document.createElement('a');
            link.download = `${qrCodeData.title}-qr-code.png`;
            link.href = qrCodeDataUrl;
            link.click();
          };
        } else {
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
      fetchQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const openEditForm = (qrCode: QRCodeData) => {
    // Feature Gating - Dynamic QR Code Editing
    if (!hasActiveSubscription()) {
      toast.error('Dynamic QR code editing is a Pro feature. Upgrade your plan to unlock this and more!');
      return;
    }

    setEditingQRCode(qrCode);
    setEditFormData({
      title: qrCode.title,
      googleBusinessUrl: qrCode.google_business_url,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
    setShowTemplateSelection(false);
  };

  const handleUpdateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQRCode) return;

    // Feature Gating - Dynamic QR Code Editing
    if (!hasActiveSubscription()) {
      toast.error('Dynamic QR code editing is a Pro feature. Upgrade your plan to unlock this and more!');
      return;
    }

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
      fetchQRCodes();
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
    }
  };

  const handleSelectTemplate = (template: QRTemplates) => {
    setSelectedTemplateType(template.type);
    setFormData(prev => ({
      ...prev,
      ...template.prefill,
      googleBusinessUrl: template.type === 'url' ? (template.prefill?.googleBusinessUrl || '') : '',
      wifiSsid: template.type === 'wifi' ? (template.prefill?.wifiSsid || '') : '',
      wifiPassword: template.type === 'wifi' ? (template.prefill?.wifiPassword || '') : '',
      wifiEncryption: template.type === 'wifi' ? (template.prefill?.wifiEncryption || 'WPA') : 'WPA',
      facebookUrl: template.type === 'social' ? (template.prefill?.facebookUrl || '') : '',
      instagramUrl: template.type === 'social' ? (template.prefill?.instagramUrl || '') : '',
      tiktokUrl: template.type === 'social' ? (template.prefill?.tiktokUrl || '') : '',
    }));
    setShowTemplateSelection(false);
    setShowCreateForm(true);
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
        <div className="mt-4 flex-shrink-0 w-full md:w-auto md:mt-0 md:ml-4">
          <button
            onClick={() => { setShowTemplateSelection(true); setShowCreateForm(false); setShowEditForm(false); }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 w-full justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </button>
        </div>
      </div>

      {/* Template Selection */}
      {showTemplateSelection && (
        <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-6 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Choose a QR Code Template</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {qrTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:border-cyan-500 transition"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <Icon className="h-8 w-8 text-cyan-400 mb-2" />
                  <h4 className="font-semibold text-white">{template.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowTemplateSelection(false)}
              className="px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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

            {selectedTemplateType === 'url' && (
              <div>
                <label htmlFor="googleBusinessUrl" className="block text-sm font-medium text-gray-300">
                  Destination URL
                </label>
                <input
                  type="url"
                  id="googleBusinessUrl"
                  required
                  value={formData.googleBusinessUrl}
                  onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="https://g.page/your-business/review or your menu link"
                />
              </div>
            )}

            {selectedTemplateType === 'wifi' && (
              <>
                <div className="text-yellow-400 text-sm">
                  Note: Full Wi-Fi QR code generation is not fully implemented. This would require database schema changes and special handling in the redirect logic.
                </div>
                <div>
                  <label htmlFor="wifiSsid" className="block text-sm font-medium text-gray-300">
                    Wi-Fi Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    id="wifiSsid"
                    required
                    value={formData.wifiSsid}
                    onChange={(e) => setFormData({ ...formData, wifiSsid: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="Your Wi-Fi Network Name"
                  />
                </div>
                <div>
                  <label htmlFor="wifiPassword" className="block text-sm font-medium text-gray-300">
                    Wi-Fi Password
                  </label>
                  <input
                    type="password"
                    id="wifiPassword"
                    value={formData.wifiPassword}
                    onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="Wi-Fi Password (leave blank for open networks)"
                  />
                </div>
                <div>
                  <label htmlFor="wifiEncryption" className="block text-sm font-medium text-gray-300">
                    Encryption Type
                  </label>
                  <select
                    id="wifiEncryption"
                    value={formData.wifiEncryption}
                    onChange={(e) => setFormData({ ...formData, wifiEncryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                    className="mt-1 block w-full rounded-xl border border-gray-700 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </>
            )}

            {selectedTemplateType === 'social' && (
              <>
                <div className="text-yellow-400 text-sm">
                  Note: Full Social Media QR code generation requires database schema changes (e.g., JSONB column for links) and a new landing page component.
                </div>
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-300">
                    Facebook Profile URL
                  </label>
                  <input
                    type="url"
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-300">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    id="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div>
                  <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-300">
                    TikTok Profile URL
                  </label>
                  <input
                    type="url"
                    id="tiktokUrl"
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="https://tiktok.com/@yourprofile"
                  />
                </div>
              </>
            )}

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
                onClick={() => { setShowCreateForm(false); setSelectedTemplateType(null); }}
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
              onClick={() => setShowTemplateSelection(true)}
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
                <div className="mt-6 grid grid-cols-2 gap-2 lg:flex lg:space-x-3">
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
                    onClick={() => openEditForm(qrCode)}
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
