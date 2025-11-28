import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentData,
  orderBy,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
  UploadMetadata,
} from 'firebase/storage';
import { NotFoundError, ValidationError } from './errors';

const MEDIA_COLLECTION = 'media';

/**
 * Media file type
 */
export interface Media {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  mimeType: string;
  size: number;
  url: string;
  path: string;
  bucket: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  duration?: number; // For video/audio in seconds
  width?: number; // For images/videos
  height?: number; // For images/videos
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Converts Firestore document data to Media type
 */
const documentToMedia = (id: string, data: DocumentData): Media => {
  return {
    id,
    name: data.name,
    type: data.type,
    mimeType: data.mimeType,
    size: data.size,
    url: data.url,
    path: data.path,
    bucket: data.bucket,
    thumbnailUrl: data.thumbnailUrl,
    thumbnailPath: data.thumbnailPath,
    duration: data.duration,
    width: data.width,
    height: data.height,
    uploadedBy: data.uploadedBy,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    metadata: data.metadata,
  };
};

/**
 * Converts Media type to Firestore document data
 */
const mediaToDocument = (media: Omit<Media, 'id'>): DocumentData => {
  const doc: DocumentData = {
    name: media.name,
    type: media.type,
    mimeType: media.mimeType,
    size: media.size,
    url: media.url,
    path: media.path,
    bucket: media.bucket,
    uploadedBy: media.uploadedBy,
    createdAt: Timestamp.fromDate(media.createdAt),
    updatedAt: Timestamp.fromDate(media.updatedAt),
  };
  
  if (media.thumbnailUrl) doc.thumbnailUrl = media.thumbnailUrl;
  if (media.thumbnailPath) doc.thumbnailPath = media.thumbnailPath;
  if (media.duration !== undefined) doc.duration = media.duration;
  if (media.width !== undefined) doc.width = media.width;
  if (media.height !== undefined) doc.height = media.height;
  if (media.metadata) doc.metadata = media.metadata;
  
  return doc;
};

/**
 * Determine media type from MIME type
 */
const getMediaType = (mimeType: string): 'video' | 'image' | 'audio' => {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'video'; // Default to video
};

/**
 * Get all media files
 */
export const getAllMedia = async (db: Firestore): Promise<Media[]> => {
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const q = query(mediaRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToMedia(doc.id, doc.data()));
};

/**
 * Get media by ID
 */
export const getMediaById = async (db: Firestore, mediaId: string): Promise<Media> => {
  const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
  const mediaDoc = await getDoc(mediaRef);
  
  if (!mediaDoc.exists()) {
    throw new NotFoundError('Media', mediaId);
  }
  
  return documentToMedia(mediaDoc.id, mediaDoc.data());
};

/**
 * Get media by type
 */
export const getMediaByType = async (
  db: Firestore,
  type: 'video' | 'image' | 'audio'
): Promise<Media[]> => {
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const q = query(mediaRef, where('type', '==', type), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToMedia(doc.id, doc.data()));
};

/**
 * Get media by uploader
 */
export const getMediaByUploader = async (
  db: Firestore,
  uploaderId: string
): Promise<Media[]> => {
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const q = query(
    mediaRef,
    where('uploadedBy', '==', uploaderId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToMedia(doc.id, doc.data()));
};

/**
 * Upload a file to Cloud Storage and create Firestore reference
 */
export const uploadMedia = async (
  db: Firestore,
  storage: FirebaseStorage,
  file: File,
  uploaderId: string,
  folder: string = 'media',
  onProgress?: UploadProgressCallback
): Promise<Media> => {
  if (!file) {
    throw new ValidationError('File is required');
  }
  
  if (!uploaderId) {
    throw new ValidationError('Uploader ID is required');
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}_${sanitizedName}`;
  const storagePath = `${folder}/${filename}`;
  
  // Create storage reference
  const storageRef = ref(storage, storagePath);
  
  // Upload file
  let uploadTask: UploadTask;
  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: uploaderId,
      originalName: file.name,
    },
  };
  
  if (onProgress) {
    uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    // Monitor upload progress
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    });
    
    await uploadTask;
  } else {
    await uploadBytes(storageRef, file, metadata);
  }
  
  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  // Create Firestore document
  const now = new Date();
  const mediaData: Omit<Media, 'id'> = {
    name: file.name,
    type: getMediaType(file.type),
    mimeType: file.type,
    size: file.size,
    url: downloadURL,
    path: storagePath,
    bucket: storage.app.options.storageBucket || '',
    uploadedBy: uploaderId,
    createdAt: now,
    updatedAt: now,
  };
  
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const docRef = await addDoc(mediaRef, mediaToDocument(mediaData));
  
  return {
    id: docRef.id,
    ...mediaData,
  };
};

/**
 * Update media metadata
 */
export const updateMedia = async (
  db: Firestore,
  mediaId: string,
  updates: Partial<
    Omit<Media, 'id' | 'createdAt' | 'uploadedBy' | 'url' | 'path' | 'bucket'>
  >
): Promise<Media> => {
  const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
  const mediaDoc = await getDoc(mediaRef);
  
  if (!mediaDoc.exists()) {
    throw new NotFoundError('Media', mediaId);
  }
  
  const updateData: DocumentData = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  await updateDoc(mediaRef, updateData);
  
  return getMediaById(db, mediaId);
};

/**
 * Delete media file from Storage and Firestore
 */
export const deleteMedia = async (
  db: Firestore,
  storage: FirebaseStorage,
  mediaId: string,
  deleteFromStorage: boolean = true
): Promise<void> => {
  const media = await getMediaById(db, mediaId);
  
  // Delete from Storage if requested
  if (deleteFromStorage && media.path) {
    try {
      const storageRef = ref(storage, media.path);
      await deleteObject(storageRef);
      
      // Also delete thumbnail if exists
      if (media.thumbnailPath) {
        const thumbnailRef = ref(storage, media.thumbnailPath);
        await deleteObject(thumbnailRef);
      }
    } catch (error) {
      console.error('Error deleting from storage:', error);
      // Continue with Firestore deletion even if storage deletion fails
    }
  }
  
  // Delete from Firestore
  const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
  await deleteDoc(mediaRef);
};

/**
 * Get download URL for a storage path
 */
export const getMediaDownloadURL = async (
  storage: FirebaseStorage,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

/**
 * Search media by name
 */
export const searchMediaByName = async (
  db: Firestore,
  searchTerm: string
): Promise<Media[]> => {
  // Firestore doesn't support full-text search natively
  // Get all media and filter client-side
  const allMedia = await getAllMedia(db);
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return allMedia.filter((media) => media.name.toLowerCase().includes(lowerSearchTerm));
};

/**
 * Filter media by multiple criteria
 */
export const filterMedia = async (
  db: Firestore,
  filters: {
    type?: 'video' | 'image' | 'audio';
    uploadedBy?: string;
    minSize?: number;
    maxSize?: number;
  }
): Promise<Media[]> => {
  let media = await getAllMedia(db);
  
  if (filters.type) {
    media = media.filter((m) => m.type === filters.type);
  }
  
  if (filters.uploadedBy) {
    media = media.filter((m) => m.uploadedBy === filters.uploadedBy);
  }
  
  if (filters.minSize !== undefined) {
    media = media.filter((m) => m.size >= filters.minSize!);
  }
  
  if (filters.maxSize !== undefined) {
    media = media.filter((m) => m.size <= filters.maxSize!);
  }
  
  return media;
};
