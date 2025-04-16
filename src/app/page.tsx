'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {processFaceRecognition} from '@/ai/flows/process-face-recognition';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Icons} from '@/components/icons';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanVideo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await processFaceRecognition({
        videoUrl,
        referenceImageUrl,
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
            <label htmlFor="videoUrl">Video URL</label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="Enter video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="referenceImageUrl">Reference Image URL</label>
            <Input
              id="referenceImageUrl"
              type="url"
              placeholder="Enter reference image URL"
              value={referenceImageUrl}
              onChange={(e) => setReferenceImageUrl(e.target.value)}
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
