"use client";

import { db, storage } from "@/firebase";  // Ensure correct Firebase config
import { useUser } from "@clerk/nextjs";   // Clerk authentication
import { doc, setDoc } from "firebase/firestore"; // Firestore for saving file info
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; // Firebase Storage
import { useRouter } from "next/navigation";  // Next.js router
import { useState } from "react";  // React state
import { v4 as uuidv4 } from "uuid";  // Generate unique ID
 

// StatusText enumeration for different upload stages
export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, This will only take a few seconds...",
}

// Status type from StatusText enum
export type Status = StatusText[keyof StatusText];

// useUpload hook
function useUpload() {
  const [progress, setProgress] = useState<number | null>(null); // Track upload progress
  const [fileId, setFileId] = useState<string | null>(null); // Track file ID
  const [status, setStatus] = useState<Status | null>(null); // Track current status
  const { user } = useUser();  // Get current user using Clerk
  const router=useRouter();
 

  // File upload handler
  const handleUpload = async (file: File) => {
    if (!file || !user) return;  // Ensure file and user are available
    const fileIdToUploadTo = uuidv4();  // Generate unique file ID
    const storageRef = ref(storage, `users/${user.id}/files/${fileIdToUploadTo}`);  // Firebase Storage ref

    const uploadTask = uploadBytesResumable(storageRef, file);  // Start upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);  // Calculate upload progress
        setStatus(StatusText.UPLOADING);  // Set uploading status
        setProgress(percent);  // Set progress
      },
      (error) => {
        console.error("Error uploading file", error);  // Handle upload errors
      },
      async () => {
        try {
          // On successful upload, get download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setStatus(StatusText.UPLOADED);  // Update status to uploaded

          setStatus(StatusText.SAVING);  // Set saving status
          // Save file details in Firestore
          await setDoc(doc(db, "users", user.id, 'files', fileIdToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl: downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date(),
          });

          setStatus(StatusText.GENERATING);  // Set status to generating
          setFileId(fileIdToUploadTo);  // Set the file ID for future reference
          
        } catch (error) {
          console.error("Error saving file to Firestore", error);  // Handle Firestore save error
        }
      }
    );
  };

  return { progress, status, fileId, handleUpload };  // Return hook values
}

export default useUpload;
