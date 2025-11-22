const API_BASE = window.location.origin;

function getCodeFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/\/code\/([A-Za-z0-9]{6,8})/);
  return match ? match[1] : null;
}

function getShortUrl(code) {
  return `${window.location.origin}/${code}`;
}

async function fetchStats() {
  const code = getCodeFromUrl();
  if (!code) {
    showNotFound();
    return;
  }

  try {
    showLoading(true);
    const res = await fetch(`${API_BASE}/api/links/${code}`);
    
    if (res.status === 404) {
      showNotFound();
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch statistics");
    }

    const link = await res.json();
    displayStats(link);
  } catch (err) {
    console.error(err);
    showNotFound();
  } finally {
    showLoading(false);
  }
}

function displayStats(link) {
  const shortUrl = getShortUrl(link.code);
  
  document.getElementById("codeDisplay").textContent = link.code;
  document.getElementById("shortCode").textContent = link.code;
  document.getElementById("shortUrlLink").textContent = shortUrl;
  document.getElementById("shortUrlLink").href = shortUrl;
  document.getElementById("targetUrlLink").textContent = link.url;
  document.getElementById("targetUrlLink").href = link.url;
  document.getElementById("totalClicks").textContent = link.clicks || 0;
  document.getElementById("lastClicked").textContent = link.lastClicked
    ? new Date(link.lastClicked).toLocaleString()
    : "Never";
  document.getElementById("createdAt").textContent = new Date(link.createdAt).toLocaleString();
  document.getElementById("updatedAt").textContent = link.updatedAt
    ? new Date(link.updatedAt).toLocaleString()
    : "—";

  const copyButton = document.getElementById("copyButton");
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(shortUrl);
    copyButton.textContent = "Copied!";
    copyButton.classList.add("bg-green-600", "hover:bg-green-700");
    copyButton.classList.remove("bg-blue-600", "hover:bg-blue-700");
    setTimeout(() => {
      copyButton.textContent = "Copy";
      copyButton.classList.remove("bg-green-600", "hover:bg-green-700");
      copyButton.classList.add("bg-blue-600", "hover:bg-blue-700");
    }, 2000);
  });

  document.getElementById("statsContainer").classList.remove("hidden");
}

function showLoading(show) {
  const loadingDiv = document.getElementById("loadingMessage");
  if (show) {
    loadingDiv.classList.remove("hidden");
    document.getElementById("statsContainer").classList.add("hidden");
    document.getElementById("notFoundMessage").classList.add("hidden");
  } else {
    loadingDiv.classList.add("hidden");
  }
}

function showNotFound() {
  document.getElementById("notFoundMessage").classList.remove("hidden");
  document.getElementById("statsContainer").classList.add("hidden");
  document.getElementById("loadingMessage").classList.add("hidden");
}

fetchStats();
