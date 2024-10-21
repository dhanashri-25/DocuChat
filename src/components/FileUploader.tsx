"use client"; // Add this at the top of your file

import useUpload, { StatusText } from "@/app/hooks/useUpload";
import {
  CircleArrowDown,
  RocketIcon,
  CheckCircleIcon,
  HammerIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
  const {
    progress,//no shows current upload progress from 0-100
    status = StatusText.UPLOADING,
    fileId,//id of uploaded file
    handleUpload,//funciton to trigger upload process
  } = useUpload();//we are using useupload hook
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleUpload(file);
    }
  }, []);

  const statusIcons: { [key in StatusText]: JSX.Element } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isFocused } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: { "application/pdf": [".pdf"] },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto rounded-lg h-96">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={
              {
                "--value": progress,
                "--size": "12rem",
                "--thickness": "1.3rem",
              } as React.CSSProperties
            } // Cast to CSSProperties here
          >
            {progress} %
          </div>

          {statusIcons[status]}
          <p className="text-indigo-600 animate-pulse">{String(status)}</p>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-indigo-600 text-indigo-600 border-dashed mt-10 w-[90%] justify-center ${
          isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col justify-center items-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping"></RocketIcon>
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-20 w-20 animate-bounce"></CircleArrowDown>
              <p>Drag 'n' drop some files here, or click to select files</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
