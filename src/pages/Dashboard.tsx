import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, 
  QrCode, 
  Users, 
  TrendingUp, 
  Plus, 
  Download, 
  ExternalLink, 
  Trash, 
  Edit, 
  Search,
  Wifi,
  Share2,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

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

const TRIAL_QR_CODE_LIMIT = 2;
const STARTER_QR_CODE_LIMIT = 2;

export const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const { subscription, loading: subLoading, getCurrentPeriodEnd } = useSubscription();
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

  useEffect(() => {
    fetchQRCodes();
  }, [profile]);

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
      if (file.size > 1024 * 1024) {
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

    if (!user || !profile) {
      toast.error('You must be logged in to create QR codes.');
      return;
    }

    const currentQrCount = qrCodes.length;
    if (profile.subscription_tier === 'trial' && currentQrCount >= TRIAL_QR_CODE_LIMIT) {
      toast.error(`You've reached your trial limit of ${TRIAL_QR_CODE_LIMIT} QR codes. Upgrade to create unlimited dynamic QR codes!`);
      return;
    }
    if (profile.subscription_tier === 'starter' && currentQrCount >= STARTER_QR_CODE_LIMIT) {
      toast.error(`Your Starter plan limits you to ${STARTER_QR_CODE_LIMIT} QR codes. Upgrade to Growth or Pro for unlimited QR codes!`);
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
        toast.error('Wi-Fi QR code generation is not fully implemented.');
        return;
      } else if (selectedTemplateType === 'social') {
        toast.error('Social Media QR code generation is not fully implemented.');
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

            if (profile?.subscription_tier === 'starter' || profile?.subscription_tier === 'trial') {
              drawWatermark(ctx, qrSize);
            }

            const link = document.createElement('a');
            link.download = `${qrCodeData.title}-qr-code.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          };

          logoImage.onerror = () => {
            if (profile?.subscription_tier === 'starter' || profile?.subscription_tier === 'trial') {
              drawWatermark(ctx, qrImage.width);
            }
            const link = document.createElement('a');
            link.download = `${qrCodeData.title}-qr-code.png`;
            link.href = qrCodeDataUrl;
            link.click();
          };
        } else {
          if (profile?.subscription_tier === 'starter' || profile?.subscription_tier === 'trial') {
            drawWatermark(ctx, qrImage.width);
          }
          const link = document.createElement('a');
          link.download = `${qrCodeData.title}-qr-code.png`;
          link.href = qrCodeDataUrl;
          link.click();
        }
      };

    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D, qrSize: number) => {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const text = 'Powered by ReviewBoost';
    const padding = 10;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, qrSize - 20 - padding, qrSize, 20 + padding);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(text, qrSize / 2, qrSize - padding);
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
    if (profile?.subscription_tier === 'starter' || profile?.subscription_tier === 'trial' || profile?.subscription_tier === 'free') {
      toast.error('Dynamic QR code editing is a Growth or Pro feature. Upgrade your plan to unlock this!');
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

    if (profile?.subscription_tier === 'starter' || profile?.subscription_tier === 'trial' || profile?.subscription_tier === 'free') {
      toast.error('Dynamic QR code editing is a Growth or Pro feature. Upgrade your plan to unlock this!');
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const canCreateMoreQRCodes = () => {
    if (!profile) return false;
    if (profile.subscription_tier === 'trial' && qrCodes.length >= TRIAL_QR_CODE_LIMIT) {
      return false;
    }
    if (profile.subscription_tier === 'starter' && qrCodes.length >= STARTER_QR_CODE_LIMIT) {
      return false;
    }
    return true;
  };

  const totalScans = qrCodes.reduce((sum, code) => sum + code.scan_count, 0);
  const totalCodes = qrCodes.length;
  const avgScans = totalCodes > 0 ? Math.round(totalScans / totalCodes) : 0;

  const trialDaysRemaining = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const nextBillingDate = getCurrentPeriodEnd();

  if (loading || subLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-blue-100 text-sm opacity-90 mb-1">Welcome back!</p>
            <h1 className="text-3xl font-bold text-white mb-2">Your QR Campaigns</h1>
            <p className="text-blue-100 opacity-90">
              {qrCodes.length} active campaign{qrCodes.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p
