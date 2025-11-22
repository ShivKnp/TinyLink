const API_BASE = window.location.origin;

let allLinks = [];
let filteredLinks = [];

function getShortUrl(code) {
  return `${window.location.origin}/${code}`;
}

async function fetchLinks() {
  try {
    showLoading(true);
    const res = await fetch(`${API_BASE}/api/links`);
    if (!res.ok) throw new Error("Failed to fetch links");
    allLinks = await res.json();
    filteredLinks = [...allLinks];
    renderLinks();
  } catch (err) {
    showError("Failed to load links. Please refresh the page.");
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function renderLinks() {
  const tbody = document.getElementById("linksTableBody");
  const tableContainer = document.getElementById("tableContainer");
  const emptyMessage = document.getElementById("emptyMessage");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  if (searchTerm) {
    filteredLinks = allLinks.filter(
      (link) =>
        link.code.toLowerCase().includes(searchTerm) ||
        link.url.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredLinks = [...allLinks];
  }

  if (filteredLinks.length === 0) {
    tableContainer.classList.add("hidden");
    emptyMessage.classList.remove("hidden");
    emptyMessage.textContent = searchTerm
      ? "No links match your search."
      : "No links yet. Create your first short link above!";
    return;
  }

  tableContainer.classList.remove("hidden");
  emptyMessage.classList.add("hidden");

  tbody.innerHTML = filteredLinks
    .map((link) => {
      const shortUrl = getShortUrl(link.code);
      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4">
            <a 
              href="${shortUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              ${link.code}
            </a>
          </td>
          <td class="px-6 py-4">
            <a 
              href="${link.url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-sm text-gray-700 hover:text-gray-900 hover:underline truncate block max-w-md"
              title="${link.url}"
            >
              ${link.url}
            </a>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">${link.clicks || 0}</td>
          <td class="px-6 py-4 text-sm text-gray-500">
            ${link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "—"}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <a href="/code/${link.code}" class="text-sm text-blue-600 hover:text-blue-800">
                Stats
              </a>
              <button
                onclick="deleteLink('${link.code}')"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

async function deleteLink(code) {
  if (!confirm(`Delete link "${code}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/links/${code}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete link");
    showSuccess(`Link "${code}" deleted.`);
    await fetchLinks();
  } catch (err) {
    showError("Failed to delete link. Please try again.");
  }
}

document.getElementById("linkForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;
  const code = document.getElementById("code").value;
  const submitBtn = document.getElementById("submitBtn");

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";
  hideMessages();

  try {
    const res = await fetch(`${API_BASE}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined }),
    });

    const data = await res.json();

    if (res.status === 409) {
      showError("Code already exists. Please choose a different one.");
      return;
    }

    if (res.status === 400) {
      showError(data.error || "Invalid input. Please check your URL and code.");
      return;
    }

    if (!res.ok) {
      throw new Error(data.error || "Failed to create link");
    }

    showSuccess(`Link created: ${data.code}`);
    document.getElementById("linkForm").reset();
    await fetchLinks();
  } catch (err) {
    showError(err.message || "Failed to create link. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Create";
  }
});

document.getElementById("searchInput").addEventListener("input", () => {
  renderLinks();
});

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  document.getElementById("successMessage").classList.add("hidden");
}

function showSuccess(message) {
  const successDiv = document.getElementById("successMessage");
  successDiv.textContent = message;
  successDiv.classList.remove("hidden");
  document.getElementById("errorMessage").classList.add("hidden");
  setTimeout(() => {
    successDiv.classList.add("hidden");
  }, 3000);
}

function hideMessages() {
  document.getElementById("errorMessage").classList.add("hidden");
  document.getElementById("successMessage").classList.add("hidden");
}

function showLoading(show) {
  const loadingDiv = document.getElementById("loadingMessage");
  if (show) {
    loadingDiv.classList.remove("hidden");
    document.getElementById("tableContainer").classList.add("hidden");
    document.getElementById("emptyMessage").classList.add("hidden");
  } else {
    loadingDiv.classList.add("hidden");
  }
}

fetchLinks();
