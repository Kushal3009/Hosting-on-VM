const API_BASE = '/api/items';

// DOM elements
const itemsContainer = document.getElementById('itemsContainer');
const itemsCount = document.getElementById('itemsCount');
const createForm = document.getElementById('createForm');
const editForm = document.getElementById('editForm');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const refreshBtn = document.getElementById('refreshBtn');
const toastEl = document.getElementById('toast');

// State
let items = [];

// Helper: Show toast notification
function showToast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.className = `toast toast-${type}`;
  setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 3500);
}

// Fetch all items from API
async function fetchItems() {
  try {
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.append('search', searchInput.value.trim());
    if (statusFilter.value) params.append('status', statusFilter.value);

    const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      items = data.data;
      renderItems(items);
    } else {
      showToast(data.message || 'Failed to fetch items', 'error');
    }
  } catch (err) {
    console.error(err);
    itemsContainer.innerHTML = `<div class="empty-state">Unable to connect to API server</div>`;
  }
}

// Render items in UI
function renderItems(list) {
  itemsCount.textContent = list.length;

  if (list.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-state">
        <p>No items found. Create your first item on the left!</p>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = list.map(item => `
    <div class="item-card" data-id="${item.id}">
      <div class="item-header">
        <div class="item-title">
          <span class="item-id">#${item.id}</span>
          <span>${escapeHtml(item.title)}</span>
        </div>
        <div class="item-actions">
          <button class="action-btn edit-btn" onclick="openEditModal(${item.id})">✏️ Edit</button>
          <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">🗑️ Delete</button>
        </div>
      </div>

      ${item.description ? `<p class="item-description">${escapeHtml(item.description)}</p>` : ''}

      <div class="item-footer">
        <div class="item-meta">
          <span class="badge badge-category">${escapeHtml(item.category || 'General')}</span>
          <span class="badge badge-status-${item.status}">${item.status.replace('-', ' ')}</span>
          <span class="badge badge-priority-${item.priority}">${item.priority}</span>
        </div>
        <span class="item-date">${new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');
}

// Create new item
createForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: document.getElementById('createTitle').value.trim(),
    category: document.getElementById('createCategory').value.trim() || 'General',
    status: document.getElementById('createStatus').value,
    priority: document.getElementById('createPriority').value,
    description: document.getElementById('createDescription').value.trim(),
  };

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Item created successfully!');
      createForm.reset();
      document.getElementById('createCategory').value = 'General';
      fetchItems();
    } else {
      showToast(data.message || data.error || 'Failed to create item', 'error');
    }
  } catch (err) {
    showToast('Network error while creating item', 'error');
  }
});

// Open Edit Modal
window.openEditModal = (id) => {
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('editId').value = item.id;
  document.getElementById('editTitle').value = item.title;
  document.getElementById('editCategory').value = item.category || 'General';
  document.getElementById('editStatus').value = item.status;
  document.getElementById('editPriority').value = item.priority;
  document.getElementById('editDescription').value = item.description || '';

  editModal.classList.remove('hidden');
};

function closeEditModal() {
  editModal.classList.add('hidden');
  editForm.reset();
}

closeModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);

// Save Edit
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;

  const payload = {
    title: document.getElementById('editTitle').value.trim(),
    category: document.getElementById('editCategory').value.trim() || 'General',
    status: document.getElementById('editStatus').value,
    priority: document.getElementById('editPriority').value,
    description: document.getElementById('editDescription').value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Item updated successfully!');
      closeEditModal();
      fetchItems();
    } else {
      showToast(data.message || data.error || 'Failed to update item', 'error');
    }
  } catch (err) {
    showToast('Network error while updating item', 'error');
  }
});

// Delete Item
window.deleteItem = async (id) => {
  if (!confirm(`Are you sure you want to delete item #${id}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Item deleted successfully!');
      fetchItems();
    } else {
      showToast(data.message || data.error || 'Failed to delete item', 'error');
    }
  } catch (err) {
    showToast('Network error while deleting item', 'error');
  }
};

// Filter and search debounce
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(fetchItems, 300);
});

statusFilter.addEventListener('change', fetchItems);
refreshBtn.addEventListener('click', fetchItems);

// Utility: escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// Initial fetch
fetchItems();
