import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the Chrome API is available
    if (!chrome?.tabs) {
      setError('Chrome API is not available');
      setLoading(false);
      return;
    }
    
    // Query the current active tab
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          fetchVideos();
        } else {
          setError('No active tab found');
        }
        setLoading(false);
      });
    }
  }, []);

  const fetchVideos = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'get_videos' }, (response) => {
          if (response?.videos) {
            setVideoUrls(response.videos);
          } else {
            setError('Failed to fetch videos');
          }
        });
      } else {
        setError('Failed to access the active tab');
      }
    });
  };

  const handleDownload = () => {
    if (selectedUrl) {
      chrome.runtime.sendMessage(
        { message: 'download_video', url: selectedUrl },
        (response) => {
          if (response?.success) {
            alert('Download started!');
          } else {
            alert('Failed to download video: ' + response?.error);
          }
        }
      );
    }
  };

  return (
    <div className="p-4 min-w-[300px]">
      <h1 className="text-lg font-bold mb-4">Stockfish Downloader</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {videoUrls.length > 0 ? (
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
          ) : (
            <p>No videos found</p>
          )}
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={!selectedUrl}
          >
            Download Video
          </button>
        </>
      )}
      <div className='flex items-center gap-5 mt-4 font-semibold'>
        <img className='rounded-full h-12 w-12' src="/Mostapha.webp" alt="#" />
        <p>The Owner <a href="https://mostapha-taha.vercel.app/" className='text-blue-500 hover:underline underline-offset-2'>Mostapha Taha </a> </p>
      </div>
    </div>
  );
};

export default Popup;