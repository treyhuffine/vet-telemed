'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText
} from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  files: ViewerFile[];
  initialIndex?: number;
}

interface ViewerFile {
  id: string;
  name: string;
  url: string;
  type: string;
  category: string;
  description?: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export default function FileViewer({ isOpen, onClose, files, initialIndex = 0 }: FileViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const currentFile = files[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
    setZoom(100);
    setRotation(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
    setZoom(100);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentFile.url;
    link.download = currentFile.name;
    link.click();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'xray': return 'bg-purple-100 text-purple-700';
      case 'ultrasound': return 'bg-blue-100 text-blue-700';
      case 'lab_results': return 'bg-green-100 text-green-700';
      case 'photo': return 'bg-yellow-100 text-yellow-700';
      case 'video': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderFileContent = () => {
    if (!currentFile) return null;

    if (currentFile.type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full bg-black">
          <img
            src={currentFile.url}
            alt={currentFile.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      );
    }

    if (currentFile.type === 'application/pdf') {
      return (
        <iframe
          src={currentFile.url}
          className="w-full h-full"
          title={currentFile.name}
        />
      );
    }

    if (currentFile.type.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center h-full bg-black">
          <video
            src={currentFile.url}
            controls
            className="max-w-full max-h-full"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600">Preview not available for this file type</p>
        <Button className="mt-4" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">{currentFile?.name}</h3>
            <Badge className={getCategoryColor(currentFile?.category || '')}>
              {currentFile?.category.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {currentFile?.type.startsWith('image/') && (
              <>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <Button variant="ghost" size="icon" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
              </>
            )}
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 h-[calc(95vh-180px)]">
          {renderFileContent()}

          {/* Navigation */}
          {files.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {currentFile?.description && (
              <p className="mb-1">{currentFile.description}</p>
            )}
            <p>
              Uploaded {currentFile?.uploadedAt.toLocaleDateString()} at{' '}
              {currentFile?.uploadedAt.toLocaleTimeString()}
              {currentFile?.uploadedBy && ` by ${currentFile.uploadedBy}`}
            </p>
          </div>
          {files.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} of {files.length}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}