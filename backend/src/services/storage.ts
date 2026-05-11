import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  key: string;
  etag?: string;
}

export class StorageService {
  private mockStorage: Map<string, { data: string; contentType: string; originalName: string }> = new Map();

  async uploadFile(
    file: Buffer,
    filename: string,
    contentType: string,
    folder: string = 'documents'
  ): Promise<UploadResult> {
    // Generate a unique key
    const key = `${folder}/${uuidv4()}-${filename}`;

    // Store in memory (in production, this would upload to S3/R2)
    this.mockStorage.set(key, {
      data: file.toString('base64'),
      contentType,
      originalName: filename,
    });

    // Return mock URL
    const url = `https://mock-storage.clearpass.com.ng/${key}`;

    return {
      url,
      key,
      etag: uuidv4(),
    };
  }

  async deleteFile(key: string): Promise<void> {
    this.mockStorage.delete(key);
  }

  async getFileUrl(key: string): Promise<string> {
    if (!this.mockStorage.has(key)) {
      throw new Error('File not found');
    }
    return `https://mock-storage.clearpass.com.ng/${key}`;
  }

  async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.mockStorage.has(key)) {
      throw new Error('File not found');
    }
    return `https://mock-storage.clearpass.com.ng/${key}?expires=${Date.now() + expiresIn * 1000}`;
  }

  // Mock method to simulate file download
  async downloadFile(key: string): Promise<{ data: Buffer; contentType: string; originalName: string }> {
    const file = this.mockStorage.get(key);
    if (!file) {
      throw new Error('File not found');
    }
    return {
      data: Buffer.from(file.data, 'base64'),
      contentType: file.contentType,
      originalName: file.originalName,
    };
  }
}

export const storageService = new StorageService();