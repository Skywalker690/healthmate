import React, { useEffect, useRef } from 'react';

const BackgroundVideo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.75; // reduce speed
        try {
          await videoRef.current.play();
        } catch {
          setTimeout(() => videoRef.current?.play(), 800);
        }
      }
    };
    playVideo();
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-none">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source
          src={window.innerWidth < 900 ? '/demo_low.mp4' : '/demo.mp4'}
          type="video/mp4"
        />
      </video>

      {/* readability overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};

export default BackgroundVideo;
