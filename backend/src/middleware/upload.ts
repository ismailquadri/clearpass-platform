import multer from 'multer';
import { storageService } from '../services/storage';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for PDF documents
const fileFilter = (req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware to handle file upload and store in our mock storage
export const handleFileUpload = async (req: any, res: any, next: any) => {
  if (!req.file) {
    return next();
  }

  try {
    const result = await storageService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'documents'
    );

    // Add the file URL to the request body for use in route handlers
    req.body.document_url = result.url;
    req.body.document_key = result.key;

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware for multiple file uploads
export const handleMultipleFileUploads = async (req: any, res: any, next: any) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map((file: Express.Multer.File) =>
      storageService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        'documents'
      )
    );

    const results = await Promise.all(uploadPromises);

    // Add the file URLs to the request body
    req.body.document_urls = results.map(r => r.url);
    req.body.document_keys = results.map(r => r.key);

    next();
  } catch (error) {
    next(error);
  }
};