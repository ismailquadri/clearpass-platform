import {
  QrCode,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  FlipHorizontal,
  Monitor,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from './ToastProvider';
import { verifyVendor } from '../api';
import type { VendorVerification } from '../api';
import '../../app/styles/mda-theme.css';

type ScanState =
  | 'idle'
  | 'requesting'
  | 'scanning'
  | 'detected'
  | 'verifying'
  | 'result'
  | 'error'
  | 'unsupported';

declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  detect(
    image: HTMLVideoElement | HTMLImageElement | ImageBitmap | HTMLCanvasElement
  ): Promise<Array<{ rawValue: string; format: string }>>;
  static getSupportedFormats(): Promise<string[]>;
}

function parseRcFromQR(raw: string): string | null {
  // Match bare RC number
  const direct = raw.match(/\bRC\d{7,}\b/i);
  if (direct) return direct[0].toUpperCase();
  // Match from URL path e.g. /verify/RC1234567
  const fromUrl = raw.match(/\/(?:verify|rc)\/(RC\d{7,})/i);
  if (fromUrl) return fromUrl[1].toUpperCase();
  return null;
}

function StatusBadge({ status }: { status: VendorVerification['status'] }) {
  const cfg = {
    'procurement-ready': {
      icon: CheckCircle2,
      label: 'Procurement Ready',
      color: 'var(--mda-success)',
      bg: 'var(--mda-success-light)',
    },
    'attention-required': {
      icon: AlertTriangle,
      label: 'Attention Required',
      color: 'var(--mda-warning)',
      bg: 'var(--mda-warning-light)',
    },
    ineligible: {
      icon: XCircle,
      label: 'Ineligible to Bid',
      color: 'var(--mda-error)',
      bg: 'var(--mda-error-light)',
    },
  }[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

export function QRScannerView() {
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ScanState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scannedRc, setScannedRc] = useState('');
  const [result, setResult] = useState<VendorVerification | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isBarcodeSupported, setIsBarcodeSupported] = useState<boolean | null>(null);

  // Detect mobile device — live camera only on mobile
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Check BarcodeDetector support once
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      BarcodeDetector.getSupportedFormats()
        .then((formats) => {
          if (formats.includes('qr_code')) {
            detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
            setIsBarcodeSupported(true);
          } else {
            setIsBarcodeSupported(false);
          }
        })
        .catch(() => setIsBarcodeSupported(false));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsBarcodeSupported(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  // Clean up on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  const runVerification = useCallback(
    async (rc: string) => {
      setScannedRc(rc);
      setState('verifying');
      try {
        const data = await verifyVendor(rc);
        setResult(data);
        setState('result');
        showToast(
          'success',
          'Verification Complete',
          `${data.companyName} — ${data.status.replace('-', ' ')}`
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Verification failed';
        setErrorMsg(msg);
        setState('error');
        showToast('error', 'Verification Failed', msg);
      }
    },
    [showToast]
  );

  const startScanning = useCallback(
    (stream: MediaStream) => {
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.play().catch(() => null);

      const tick = () => {
        if (!detectorRef.current || !video || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        detectorRef.current
          .detect(video)
          .then((codes) => {
            if (codes.length > 0) {
              const raw = codes[0].rawValue;
              const rc = parseRcFromQR(raw);
              stopCamera();
              if (rc) {
                setState('detected');
                void runVerification(rc);
              } else {
                setErrorMsg(`QR detected but no RC number found.\nRaw: ${raw.slice(0, 80)}`);
                setState('error');
              }
            } else {
              rafRef.current = requestAnimationFrame(tick);
            }
          })
          .catch(() => {
            rafRef.current = requestAnimationFrame(tick);
          });
      };

      setState('scanning');
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopCamera, runVerification]
  );

  const startCamera = useCallback(async () => {
    setState('requesting');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      startScanning(stream);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Unable to access camera. Try uploading a photo instead.';
      setErrorMsg(msg);
      setState('error');
    }
  }, [facingMode, startScanning]);

  const flipCamera = useCallback(async () => {
    stopCamera();
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    setState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next },
      });
      startScanning(stream);
    } catch {
      setState('error');
      setErrorMsg('Could not switch camera.');
    }
  }, [facingMode, stopCamera, startScanning]);

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      if (!detectorRef.current) {
        showToast('error', 'Not Supported', 'QR scanning is not supported on this browser.');
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')!.drawImage(img, 0, 0);

        createImageBitmap(canvas)
          .then((bmp) => detectorRef.current!.detect(bmp))
          .then((codes) => {
            URL.revokeObjectURL(img.src);
            if (codes.length === 0) {
              setErrorMsg('No QR code found in the image. Try a clearer photo.');
              setState('error');
              return;
            }
            const rc = parseRcFromQR(codes[0].rawValue);
            if (rc) {
              void runVerification(rc);
            } else {
              setErrorMsg(
                `QR detected but no RC number found.\nRaw: ${codes[0].rawValue.slice(0, 80)}`
              );
              setState('error');
            }
          })
          .catch(() => {
            URL.revokeObjectURL(img.src);
            setErrorMsg('Failed to process the image. Please try again.');
            setState('error');
          });
      };
      img.src = URL.createObjectURL(file);
    },
    [runVerification, showToast]
  );

  const reset = useCallback(() => {
    stopCamera();
    setResult(null);
    setScannedRc('');
    setErrorMsg('');
    setState('idle');
  }, [stopCamera]);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--mda-bg-light)' }}
            >
              <QrCode className="w-5 h-5" style={{ color: 'var(--mda-primary)' }} />
            </div>
            <div>
              <h1 className="cp-page-title">Scan QR Document</h1>
              <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Point camera at a compliance document QR code to verify instantly
              </p>
            </div>
          </div>
        </header>

        {/* Idle state */}
        {state === 'idle' && (
          <div className="space-y-4">
            {/* Live camera — mobile only */}
            {isMobile && isBarcodeSupported === true && (
              <button
                onClick={() => void startCamera()}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-xl border-2 transition-colors text-white"
                style={{ borderColor: 'var(--mda-primary)', backgroundColor: 'var(--mda-primary)' }}
              >
                <Camera className="w-6 h-6" aria-hidden="true" />
                <span style={{ fontSize: '16px', fontWeight: 500 }}>Open Camera Scanner</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-xl border-2 border-dashed transition-colors hover:bg-muted/50"
              style={{ borderColor: 'var(--mda-border-light)' }}
            >
              <Upload className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
              <span className="text-muted-foreground" style={{ fontSize: '16px', fontWeight: 500 }}>
                {isMobile ? 'Upload Document Photo' : 'Upload Photo of QR Document'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture={isMobile ? 'environment' : undefined}
              onChange={handlePhotoUpload}
              className="sr-only"
              aria-hidden="true"
            />

            {/* Desktop info banner */}
            {!isMobile && (
              <div
                className="rounded-lg p-4 border flex items-start gap-3"
                style={{
                  backgroundColor: 'var(--mda-bg-light)',
                  borderColor: 'var(--mda-border-light)',
                }}
              >
                <Monitor
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: 'var(--mda-primary)' }}
                />
                <p className="text-sm" style={{ color: 'var(--mda-primary)' }}>
                  <strong>Desktop mode:</strong> Take a photo of the document QR code on your phone,
                  then upload it here. Live camera scanning is available on the mobile app.
                </p>
              </div>
            )}

            {/* How it works */}
            <div className="bg-card border border-border rounded-lg p-5 mt-6">
              <p className="font-medium mb-3" style={{ fontSize: '14px' }}>
                How it works
              </p>
              <ol className="space-y-2 text-muted-foreground" style={{ fontSize: '13px' }}>
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{
                      backgroundColor: 'var(--mda-primary)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    1
                  </span>
                  Point your camera at the QR code on a physical compliance document
                </li>
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{
                      backgroundColor: 'var(--mda-primary)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    2
                  </span>
                  ClearPass automatically reads the QR and extracts the company RC number
                </li>
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{
                      backgroundColor: 'var(--mda-primary)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  Real-time compliance status is fetched and displayed instantly
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Requesting permission */}
        {state === 'requesting' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
            <Camera className="w-10 h-10 animate-pulse" style={{ color: 'var(--mda-primary)' }} />
            <p style={{ fontSize: '15px' }}>Requesting camera access…</p>
          </div>
        )}

        {/* Live camera viewfinder */}
        {state === 'scanning' && (
          <div className="space-y-4">
            <div
              className="relative rounded-xl overflow-hidden bg-black"
              style={{ aspectRatio: '4/3' }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                aria-label="Camera viewfinder"
              />
              {/* Aiming overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-56 h-56">
                  {/* Corner brackets */}
                  {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
                    <span
                      key={c}
                      className={`absolute w-8 h-8 border-[3px] ${
                        c === 'tl'
                          ? 'top-0 left-0 border-r-0 border-b-0 rounded-tl-md'
                          : c === 'tr'
                            ? 'top-0 right-0 border-l-0 border-b-0 rounded-tr-md'
                            : c === 'bl'
                              ? 'bottom-0 left-0 border-r-0 border-t-0 rounded-bl-md'
                              : 'bottom-0 right-0 border-l-0 border-t-0 rounded-br-md'
                      }`}
                      style={{ borderColor: 'var(--mda-primary)' }}
                    />
                  ))}
                  {/* Scan line animation */}
                  <div
                    className="absolute left-2 right-2 h-0.5 animate-bounce"
                    style={{ backgroundColor: 'var(--mda-primary)', top: '50%', opacity: 0.8 }}
                  />
                </div>
              </div>
              {/* Flip camera button */}
              <button
                onClick={() => void flipCamera()}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-black/50 text-white"
                aria-label="Flip camera"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-muted-foreground" style={{ fontSize: '13px' }}>
              Align the QR code within the frame — scanning automatically
            </p>
            <button
              onClick={reset}
              className="w-full py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              style={{ fontSize: '14px' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Detected / verifying */}
        {(state === 'detected' || state === 'verifying') && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--mda-bg-light)' }}
            >
              <QrCode className="w-7 h-7 animate-pulse" style={{ color: 'var(--mda-primary)' }} />
            </div>
            <div className="text-center">
              <p className="font-medium" style={{ fontSize: '16px' }}>
                QR Code Detected
              </p>
              {scannedRc && (
                <p className="text-muted-foreground mt-1" style={{ fontSize: '13px' }}>
                  RC: <strong>{scannedRc}</strong>
                </p>
              )}
              <p className="text-muted-foreground mt-2" style={{ fontSize: '13px' }}>
                Fetching compliance data…
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {state === 'result' && result && (
          <div className="space-y-4">
            {/* Success QR badge */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--mda-bg-light)' }}
            >
              <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: 'var(--mda-primary)' }} />
              <div>
                <p
                  className="font-medium"
                  style={{ fontSize: '14px', color: 'var(--mda-primary)' }}
                >
                  QR Code Verified
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                  RC {result.rcNumber} · Last verified {result.lastVerified}
                </p>
              </div>
            </div>

            {/* Company card */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{result.companyName}</h2>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: '13px' }}>
                    RC: {result.rcNumber}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '11px' }}>
                    Score
                  </p>
                  <p
                    style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color:
                        result.status === 'procurement-ready'
                          ? 'var(--mda-success)'
                          : result.status === 'attention-required'
                            ? 'var(--mda-warning)'
                            : 'var(--mda-error)',
                    }}
                  >
                    {result.score}
                    <span style={{ fontSize: '14px', fontWeight: 400 }}>/100</span>
                  </p>
                </div>
              </div>

              <StatusBadge status={result.status} />

              {result.certificates.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                  {result.certificates.map((cert, i) => {
                    const color =
                      cert.status === 'active'
                        ? 'var(--mda-success)'
                        : cert.status === 'expiring'
                          ? 'var(--mda-warning)'
                          : 'var(--mda-error)';
                    const bg =
                      cert.status === 'active'
                        ? 'var(--mda-success-light)'
                        : cert.status === 'expiring'
                          ? 'var(--mda-warning-light)'
                          : 'var(--mda-error-light)';
                    return (
                      <div key={i} className="px-3 py-2 rounded-lg" style={{ backgroundColor: bg }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, color }}>{cert.name}</p>
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: '10px' }}>
                          {cert.expiryDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={reset}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px', fontWeight: 500 }}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Scan Another Document
            </button>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="space-y-4">
            <div
              className="flex items-start gap-3 p-5 rounded-xl border"
              style={{ backgroundColor: 'var(--mda-error-light)', borderColor: 'var(--mda-error)' }}
            >
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--mda-error)' }} />
              <div>
                <p className="font-medium" style={{ fontSize: '14px', color: 'var(--mda-error)' }}>
                  Scan Failed
                </p>
                <p
                  className="text-muted-foreground mt-1 whitespace-pre-wrap"
                  style={{ fontSize: '13px' }}
                >
                  {errorMsg}
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: 'var(--mda-primary)', fontSize: '14px', fontWeight: 500 }}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
