import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QrCode } from 'lucide-react';

export const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    if (shortCode) {
      handleRedirect(shortCode);
    }
  }, [shortCode]);

  const handleRedirect = async (code: string) => {
    try {
      // Get QR code data
      const { data: qrCode, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('short_code', code)
        .single();

      if (qrError || !qrCode) {
        window.location.href = '/';
        return;
      }

      // Track the scan
      await supabase
        .from('analytics')
        .insert({
          qr_code_id: qrCode.id,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
        });

      // Increment scan count
      await supabase
        .from('qr_codes')
        .update({ scan_count: qrCode.scan_count + 1 })
        .eq('id', qrCode.id);

      // Redirect to Google Business review page
      window.location.href = qrCode.google_business_url;
    } catch (error) {
      console.error('Error handling redirect:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <QrCode className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Redirecting you to leave a review...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we redirect you to the review page.
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};