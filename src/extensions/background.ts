chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.message === 'download_video' && request.url) {
      chrome.downloads.download(
        {
          url: request.url,
          filename: 'downloaded_video.mp4'
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('Download error:', chrome.runtime.lastError.message);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log('Download started with ID:', downloadId);
            sendResponse({ success: true, downloadId });
          }
        }
      );
      return true; // Indicates async response
    }
  });
  