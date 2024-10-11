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

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.message === "get_videos") {
    sendResponse({ videos: fetchVideos() });
  }
});
