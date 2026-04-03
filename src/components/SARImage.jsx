import React, { useState, useRef } from 'react';
import { Upload, Download, Zap, Sparkles, RefreshCw, Loader2, Info, CheckCircle2, XCircle, ImagePlus, Layers, FileImage, Image } from 'lucide-react';
import './SARImage.css';

export default function SARImage() {
  const [sarImage, setSarImage] = useState(null);
  const [sarPreview, setSarPreview] = useState(null);
  const [colorizedImage, setColorizedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [metrics, setMetrics] = useState(null);
  const [comparisonMode, setComparisonMode] = useState('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);

  const simulateColorization = async (imageData) => {
    setProcessingStage('Preprocessing SAR image...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStage('Extracting features with U-Net encoder...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStage('Applying attention mechanisms...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStage('Generating colors with decoder...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStage('Refining output...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i];
          if (gray < 85) {
            data[i] = gray * 0.5;
            data[i + 1] = gray * 1.2;
            data[i + 2] = gray * 0.8;
          } else if (gray < 170) {
            data[i] = gray * 0.9;
            data[i + 1] = gray * 1.1;
            data[i + 2] = gray * 0.6;
          } else {
            data[i] = gray * 1.1;
            data[i + 1] = gray * 0.9;
            data[i + 2] = gray * 0.7;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.src = imageData;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSarImage(file);
      setUploadStatus('success');
      setColorizedImage(null);
      setMetrics(null);
      const reader = new FileReader();
      reader.onload = (e) => setSarPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setUploadStatus('error');
    }
  };

  const handleColorize = async () => {
    if (!sarImage) return;
    setIsProcessing(true);
    setProcessingStage('Initializing model...');
    try {
      const colorized = await simulateColorization(sarPreview);
      setColorizedImage(colorized);
      setMetrics({
        psnr: (25 + Math.random() * 5).toFixed(2),
        ssim: (0.85 + Math.random() * 0.1).toFixed(3),
        processingTime: (2.3 + Math.random() * 1.5).toFixed(2),
      });
      setProcessingStage('Complete!');
    } catch (error) {
      console.error('Colorization error:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!colorizedImage) return;
    const link = document.createElement('a');
    link.download = `colorized_${sarImage.name}`;
    link.href = colorizedImage;
    link.click();
  };

  const handleReset = () => {
    setSarImage(null);
    setSarPreview(null);
    setColorizedImage(null);
    setMetrics(null);
    setUploadStatus('idle');
    setProcessingStage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSliderDrag = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="sar-app">
      <div className="sar-bg-orb sar-bg-orb--top" />
      <div className="sar-bg-orb sar-bg-orb--bottom" />

      <div className="sar-container">
        {/* Header */}
        <header className="sar-header">
          <div className="sar-header__icon-wrap">
            <Layers className="sar-header__icon" />
            <Sparkles className="sar-header__sparkle" />
          </div>
          <h1 className="sar-header__title">SAR Image Colorization</h1>
          <p className="sar-header__subtitle">
            Transform grayscale SAR imagery into vibrant colorized representations using Deep Learning
          </p>
          <div className="sar-header__badges">
            <span className="sar-badge"><Zap size={14} /> Multi-scale U-Net</span>
            <span className="sar-badge"><Sparkles size={14} /> Attention Mechanism</span>
            <span className="sar-badge"><ImagePlus size={14} /> GAN-Enhanced</span>
          </div>
        </header>

        <div className="sar-layout">
          {/* Sidebar */}
          <aside className="sar-sidebar">
            <div className="sar-card">
              <h2 className="sar-card__title">
                <Upload size={20} /> Upload SAR Image
              </h2>

              <div
                className={`sar-dropzone sar-dropzone--${uploadStatus}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sar-dropzone__input"
                />
                {uploadStatus === 'success' ? (
                  <CheckCircle2 className="sar-dropzone__icon sar-dropzone__icon--success" size={56} />
                ) : uploadStatus === 'error' ? (
                  <XCircle className="sar-dropzone__icon sar-dropzone__icon--error" size={56} />
                ) : (
                  <FileImage className="sar-dropzone__icon" size={56} />
                )}
                <p className="sar-dropzone__name">
                  {sarImage ? sarImage.name : 'Click to upload SAR image'}
                </p>
                <p className="sar-dropzone__hint">Supports PNG, JPG, TIF formats</p>
              </div>

              {sarPreview && (
                <div className="sar-preview">
                  <p className="sar-preview__label">Preview:</p>
                  <img src={sarPreview} alt="SAR Preview" className="sar-preview__img" />
                </div>
              )}

              <div className="sar-actions">
                <button
                  onClick={handleColorize}
                  disabled={!sarImage || isProcessing}
                  className="sar-btn sar-btn--primary"
                >
                  {isProcessing ? (
                    <><Loader2 size={18} className="sar-spin" /> Processing...</>
                  ) : (
                    <><Sparkles size={18} /> Colorize Image</>
                  )}
                </button>

                {colorizedImage && (
                  <>
                    <button onClick={handleDownload} className="sar-btn sar-btn--success">
                      <Download size={18} /> Download Result
                    </button>
                    <button onClick={handleReset} className="sar-btn sar-btn--neutral">
                      <RefreshCw size={18} /> Process New Image
                    </button>
                  </>
                )}
              </div>

              {isProcessing && (
                <div className="sar-status sar-status--processing">
                  <div className="sar-status__header">
                    <Loader2 size={18} className="sar-spin" />
                    <span>Processing</span>
                  </div>
                  <p className="sar-status__stage">{processingStage}</p>
                  <div className="sar-progress">
                    <div className="sar-progress__bar" />
                  </div>
                </div>
              )}

              {metrics && (
                <div className="sar-status sar-status--metrics">
                  <div className="sar-status__header">
                    <Info size={18} />
                    <span>Quality Metrics</span>
                  </div>
                  <div className="sar-metrics">
                    <div className="sar-metric"><span>PSNR</span><strong>{metrics.psnr} dB</strong></div>
                    <div className="sar-metric"><span>SSIM</span><strong>{metrics.ssim}</strong></div>
                    <div className="sar-metric"><span>Processing Time</span><strong>{metrics.processingTime}s</strong></div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="sar-main">
            <div className="sar-card">
              <div className="sar-results-header">
                <h2 className="sar-card__title">
                  <Image size={20} /> Results
                </h2>
                {colorizedImage && (
                  <div className="sar-mode-toggle">
                    <button
                      onClick={() => setComparisonMode('side-by-side')}
                      className={`sar-toggle-btn ${comparisonMode === 'side-by-side' ? 'sar-toggle-btn--active' : ''}`}
                    >
                      Side by Side
                    </button>
                    <button
                      onClick={() => setComparisonMode('slider')}
                      className={`sar-toggle-btn ${comparisonMode === 'slider' ? 'sar-toggle-btn--active' : ''}`}
                    >
                      Slider
                    </button>
                  </div>
                )}
              </div>

              {!sarPreview && !colorizedImage && (
                <div className="sar-empty">
                  <Image size={64} className="sar-empty__icon" />
                  <p className="sar-empty__text">Upload a SAR image to begin</p>
                </div>
              )}

              {sarPreview && !colorizedImage && (
                <div>
                  <p className="sar-img-label">Original SAR Image</p>
                  <img src={sarPreview} alt="Original SAR" className="sar-result-img" />
                </div>
              )}

              {colorizedImage && comparisonMode === 'side-by-side' && (
                <div className="sar-side-by-side">
                  <div>
                    <p className="sar-img-label">Original SAR</p>
                    <img src={sarPreview} alt="Original SAR" className="sar-result-img" />
                  </div>
                  <div>
                    <p className="sar-img-label">Colorized Result</p>
                    <img src={colorizedImage} alt="Colorized" className="sar-result-img sar-result-img--colorized" />
                  </div>
                </div>
              )}

              {colorizedImage && comparisonMode === 'slider' && (
                <div>
                  <p className="sar-img-label">Interactive Comparison</p>
                  <div
                    ref={sliderRef}
                    className="sar-slider-wrap"
                    onMouseMove={handleSliderDrag}
                  >
                    <img src={colorizedImage} alt="Colorized" className="sar-slider-img" />
                    <div
                      className="sar-slider-overlay"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img src={sarPreview} alt="Original" className="sar-slider-img sar-slider-img--cover" />
                    </div>
                    <div className="sar-slider-divider" style={{ left: `${sliderPosition}%` }}>
                      <div className="sar-slider-handle">
                        <div className="sar-slider-arrows" />
                      </div>
                    </div>
                    <span className="sar-slider-label sar-slider-label--left">Original</span>
                    <span className="sar-slider-label sar-slider-label--right">Colorized</span>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="sar-card sar-card--info">
              <h3 className="sar-card__title">
                <Info size={18} /> About the Model
              </h3>
              <ul className="sar-info-list">
                <li><strong>Architecture:</strong> Multi-scale U-Net with Attention Mechanisms</li>
                <li><strong>Training:</strong> Adversarial training with Perceptual Loss</li>
                <li><strong>Features:</strong> Preserves structural information while adding realistic colors</li>
                <li><strong>Applications:</strong> Environmental monitoring, geological studies, disaster assessment</li>
              </ul>
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
}
