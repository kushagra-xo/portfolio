(async function() {
  // Load current projects from now.html
  const nowResp = await fetch('now.html');
  const nowText = await nowResp.text();
  const nowDoc = new DOMParser().parseFromString(nowText, 'text/html');
  const projects = Array.from(nowDoc.querySelectorAll('#now-projects li')).slice(0, 3);
  const nowList = document.querySelector('.now-list');
  projects.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.textContent;
    nowList.appendChild(li);
  });

  // Load latest blog posts from RSS feed
  const rssUrl = 'https://blog.kushagraj.xyz/index.xml';
  try {
    const rssResp = await fetch(rssUrl);
    const rssText = await rssResp.text();
    const rssDoc = new DOMParser().parseFromString(rssText, 'application/xml');
    const items = Array.from(rssDoc.querySelectorAll('item')).slice(0, 3);
    const postsList = document.querySelector('.posts-list');
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '#';
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link;
      a.textContent = title;
      li.appendChild(a);
      postsList.appendChild(li);
    });
  } catch(e) {
    console.error('Failed to load RSS feed:', e);
  }
})();