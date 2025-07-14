'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload,
  X,
  FileText,
  Image,
  Film,
  File,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Trash2,
  Edit2
} from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onFilesUploaded?: (files: UploadedFile[]) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  description: string;
  url: string;
  uploadedAt: Date;
  status: 'uploading' | 'complete' | 'error';
  progress?: number;
}

const fileCategories = [
  { value: 'xray', label: 'X-Ray' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'other', label: 'Other' }
];

export default function FileUploadModal({ isOpen, onClose, caseId, onFilesUploaded }: FileUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingFile, setEditingFile] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    
    // Start upload process for each file
    acceptedFiles.forEach(file => {
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        category: guessFileCategory(file),
        description: '',
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        status: 'uploading',
        progress: 0
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      simulateUpload(newFile.id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/dicom': ['.dcm', '.dicom']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const guessFileCategory = (file: File): string => {
    const name = file.name.toLowerCase();
    if (name.includes('xray') || name.includes('x-ray')) return 'xray';
    if (name.includes('ultrasound') || name.includes('us')) return 'ultrasound';
    if (name.includes('lab') || name.includes('blood') || name.includes('cbc')) return 'lab_results';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'photo';
    if (file.type === 'application/pdf') return 'document';
    return 'other';
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'complete', progress: 100 } : f)
        );
      } else {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, progress } : f)
        );
      }
    }, 500);
  };

  const updateFileDetails = (fileId: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, ...updates } : f)
    );
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Film className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSave = () => {
    const completeFiles = uploadedFiles.filter(f => f.status === 'complete');
    onFilesUploaded?.(completeFiles);
    onClose();
  };

  const allUploadsComplete = uploadedFiles.every(f => f.status !== 'uploading');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          {/* Dropzone */}
          {uploadedFiles.length === 0 && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
              </p>
              <p className="text-sm text-gray-500">
                Supports images, PDFs, videos, and DICOM files up to 50MB
              </p>
            </div>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add More
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      onDrop(Array.from(e.target.files));
                    }
                  }}
                />
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === 'complete' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {file.status === 'uploading' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Uploading...</span>
                            <span className="text-gray-600">{Math.round(file.progress || 0)}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>
                      )}

                      {/* File Details (when upload complete) */}
                      {file.status === 'complete' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`category-${file.id}`}>Category</Label>
                              <Select 
                                value={file.category} 
                                onValueChange={(value) => updateFileDetails(file.id, { category: value })}
                              >
                                <SelectTrigger id={`category-${file.id}`} className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fileCategories.map(cat => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`desc-${file.id}`}>Description (optional)</Label>
                            <Textarea
                              id={`desc-${file.id}`}
                              value={file.description}
                              onChange={(e) => updateFileDetails(file.id, { description: e.target.value })}
                              placeholder="Add notes about this file..."
                              className="mt-1 min-h-[60px]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Status Indicator */}
                      {file.status === 'complete' && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          Upload complete
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          Upload failed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            {uploadedFiles.filter(f => f.status === 'complete').length} of {uploadedFiles.length} files ready
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!allUploadsComplete || uploadedFiles.length === 0}
            >
              {allUploadsComplete ? (
                <>Save Files</>
              ) : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}