import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Download, FileText, Image, File } from 'lucide-react';

interface Document {
  id: string;
  originalName: string;
  category: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface PatientDocumentsProps {
  patientId: string;
}

export const PatientDocuments: React.FC<PatientDocumentsProps> = ({ patientId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [patientId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, image, or Word document');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', patientId);
      formData.append('category', 'lab_result');

      const response = await fetch(`/api/patients/${patientId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newDocument = await response.json();
        setDocuments(prev => [...prev, newDocument]);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = (doc: Document) => {
    setCurrentDocument(doc);
    setViewerOpen(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = doc.filePath;
    link.download = doc.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDocumentTypeVariant = (category: string) => {
    switch (category) {
      case 'lab_result': return 'default';
      case 'imaging': return 'secondary';
      case 'report': return 'outline';
      default: return 'outline';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (mimeType.includes('image')) return <Image className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Patient Documents</span>
            <div className="flex gap-2 items-center">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                className="w-64"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Button 
                onClick={handleFileUpload}
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    {getFileIcon(doc.mimeType)}
                    <Badge variant={getDocumentTypeVariant(doc.category)}>
                      {doc.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-medium">{doc.originalName}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatFileSize(doc.fileSize)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(currentDocument?.mimeType || '')}
                {currentDocument?.originalName}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => currentDocument && handleDownloadDocument(currentDocument)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewerOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto border rounded-lg bg-muted/20">
            {currentDocument?.mimeType === 'application/pdf' && (
              <iframe 
                src={currentDocument.filePath}
                className="w-full h-full border-0"
                title={currentDocument.originalName}
              />
            )}
            {currentDocument?.mimeType.startsWith('image/') && (
              <div className="flex items-center justify-center h-full p-4">
                <img 
                  src={currentDocument.filePath}
                  alt={currentDocument.originalName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            {currentDocument && 
             !currentDocument.mimeType.includes('pdf') && 
             !currentDocument.mimeType.startsWith('image/') && (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <File className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
                <p className="text-muted-foreground mb-4">
                  This file type cannot be previewed in the browser.
                </p>
                <Button onClick={() => handleDownloadDocument(currentDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>

          {/* Document Info Footer */}
          {currentDocument && (
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
              <div>
                <span className="font-medium">Type:</span> {currentDocument.mimeType}
              </div>
              <div>
                <span className="font-medium">Size:</span> {formatFileSize(currentDocument.fileSize)}
              </div>
              <div>
                <span className="font-medium">Uploaded:</span> {new Date(currentDocument.uploadedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};