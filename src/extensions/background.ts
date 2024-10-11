chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.message === 'download_video' && request.url) {
    fetch(request.url, {
      mode: 'cors', // To handle cross-origin requests
      credentials: 'include', // Include credentials like cookies
      headers: {
        'User-Agent': navigator.userAgent, // Set User-Agent to match browser
        'Referer': sender.url || '', // Set proper referer header to simulate request from website
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        chrome.downloads.download({
          url: objectURL,
          filename: 'downloaded_video.mp4',
        }, (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('Download error:', chrome.runtime.lastError.message);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log('Download started with ID:', downloadId);
            sendResponse({ success: true, downloadId });
          }
        });
      })
      .catch((error) => {
        console.error('Download failed:', error.message);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Indicates async response
  }
});
