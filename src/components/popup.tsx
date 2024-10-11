import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url ?? '';
      if (!(url.includes('youtube.com') || url.includes('youtu.be'))) {
        fetchVideos();
      }
    });
  }, []);

  const fetchVideos = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "get_videos" }, (response) => {
        if (response?.videos) {
          setVideoUrls(response.videos);
        }
      });
    });
  };

  const handleDownload = () => {
    if (selectedUrl) {
      chrome.runtime.sendMessage(
        { message: 'download_video', url: selectedUrl },
        (response) => {
          if (!response.success) {
            alert('Failed to download video: ' + response.error);
          } else {
            alert('Download started!');
          }
        }
      );
    }
  };

  return (
    <div className="p-4 min-w-[300px]">
      <h1 className="text-lg font-bold mb-4">Video Downloader</h1>
      {videoUrls.length > 0 && (
        <select
          onChange={(e) => setSelectedUrl(e.target.value)}
          value={selectedUrl}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="">Select a video</option>
          {videoUrls.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download Video
      </button>
    </div>
  );
};

export default Popup;
