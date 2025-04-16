'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {processFaceRecognition} from '@/ai/flows/process-face-recognition';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Icons} from '@/components/icons';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";


interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, placeholder, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          type={type}
          placeholder={placeholder}
          className={cn(
            "pl-9",
            className,
            Icon && "pl-9"
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

export default function Home() {
  const [videoFileId, setVideoFileId] = useState('');
  const [referenceImageFileId, setReferenceImageFileId] = useState('');
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanVideo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure file IDs are passed, not URLs
      const result = await processFaceRecognition({
        videoUrl: videoFileId, // Now using file ID as videoUrl
        referenceImageUrl: referenceImageFileId, // Now using file ID as referenceImageUrl
      });
      setTimestamps(result.timestamps);
    } catch (e: any) {
      setError(e.message || 'An error occurred during video processing.');
      setTimestamps([]); // Clear previous results
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">FaceFinder</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Video Analysis</CardTitle>
          <CardDescription>Upload a video and an image to find the person in the video.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="videoFileId">Video File ID (Google Drive)</label>
            <InputWithIcon
              id="videoFileId"
              type="text"
              placeholder="Enter Google Drive File ID for the video"
              value={videoFileId}
              onChange={(e) => setVideoFileId(e.target.value)}
              icon={Icons.file}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="referenceImageFileId">Reference Image File ID (Google Drive)</label>
            <InputWithIcon
              id="referenceImageFileId"
              type="text"
              placeholder="Enter Google Drive File ID for the reference image"
              value={referenceImageFileId}
              onChange={(e) => setReferenceImageFileId(e.target.value)}
              icon={Icons.image}
            />
          </div>

          <Button onClick={handleScanVideo} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              'Scan Video'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <Icons.close className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {timestamps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
            <CardDescription>Person found at these timestamps (seconds):</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {timestamps.map((timestamp) => (
                <li key={timestamp}>
                  {timestamp}
                  {/* Implement Clip Download Functionality here */}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
