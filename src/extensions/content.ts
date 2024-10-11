console.log("Content script loaded");

const fetchVideos = () => {
  const videos = document.querySelectorAll('video');
  const videoLinks: string[] = [];
  videos.forEach((video) => {
    if (video.src) {
      videoLinks.push(video.src);
    } else {
      const sources = video.getElementsByTagName('source');
      for (const source of sources) {
        if (source.src) {
          videoLinks.push(source.src);
        }
      }
    }
  });
  return videoLinks;
};

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.message === "get_videos") {
    sendResponse({ videos: fetchVideos() });
  } else if (request.message === "download_video" && request.url) {
    try {
      // Fetching the video from the user's context using content script
      const response = await fetch(request.url, {
        credentials: 'include', // Use credentials like cookies
        headers: {
          'Referer': document.referrer,
          'User-Agent': navigator.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      // Create a download link programmatically
      const a = document.createElement('a');
      a.href = objectURL;
      a.download = 'downloaded_video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      sendResponse({ success: true });
    } catch (error) {
      console.error('Failed to fetch the video:', error);
      sendResponse({ success: false, error: (error as Error).message });
    }

    return true; // Indicates async response
  }
});
