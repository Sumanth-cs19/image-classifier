import React from 'react';
import ImageUpload from './ImageUpload';
import WebcamDetection from './WebcamDetection';

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <ImageUpload />
      <WebcamDetection />
    </div>
  );
}
