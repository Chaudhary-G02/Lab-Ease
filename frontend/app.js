const SUPABASE_URL = 'https://efsudgfigaazqkvgzzry.supabase.co';
const SUPABASE_ANON_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmc3VkZ2ZpZ2FhenFrdmd6enJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODg4NjcsImV4cCI6MjA5ODQ2NDg2N30.WdTlbjeoG6z0axG3ANU7GkJ1WwObV66-DCruslI7fNU';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_URL);

let items = [];

async function fetchItems() {
    try {
        const {data, error} = await supabaseClient
        .from('inventory_items')
        .select('*')
        .order('id', {ascending: true});

        if (error) throw error;
        items = data || [];
        renderAll(); 
    } catch (err) {
        console.error('Error loading database items:', err.message);
    }
}

const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-content');
const pageTitle = document.getElementById('page-title');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        views.forEach(view => view.classList.remove('active'));

        const targetViewId = `${item.getAttribute('data-target')}-view`;
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            targetView.classList.add('active');
        }
        pageTitle.textContent = item.querySelector('span').textContent;
    });
});

const itemModal = document.getElementById('item-modal');
const openModalBtn = document.getElementById('open-add-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const itemForm = document.getElementById('item-form');
const modalTitle = document.getElementById('modal-title');

const itemIdInput = document.getElementById('item-id');
const itemNameInput = document.getElementById('item-name');
const itemTypeSelect = document.getElementById('item-type');
const itemQuantityInput = document.getElementById('item-quantity');
const itemCabinetSelect = document.getElementById('item-cabinet');
const itemShelfSelect = document.getElementById('item-shelf');
const itemStatusSelect = document.getElementById('item-status');

openModalBtn.addEventListener('click', () => {
    modalTitle.textContent = "Add New Item";
    itemForm.reset();
    itemIdInput.value = "";
    itemModal.classList.add('active');
});

function closeModal() {
    itemModal.classList.remove('active');
    itemForm.reset();
}
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

itemModal.addEventListener('click', (e) => {
    if (e.target === itemModal) {
        closeModal();
    }
});

itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = itemNameInput.value.trim();
    const type = itemTypeSelect.value;
    const quantity = parseInt(itemQuantityInput.value, 10);
    const cabinet = itemCabinetSelect.value;
    const shelf = itemShelfSelect.value;
    const status = itemStatusSelect.value;
    const id = itemIdInput.value;

    try {
        if (id) {
            const {error} = await supabaseClient
            .from('inventory_items')
            .update({name,type,quantity,cabinet,shelf,status})
            .eq('id', id);

            if (error) throw error;
        } else {
            const newItem = {
                id: Date.now().toString(),
                name,
                type,
                quantity,
                cabinet,
                shelf,
                status
            };
            const {error} = await supabaseClient
            .from('inventory_items')
            .insert([newItem]);
            if (error) throw error;
        }
        closeModal();
        await fetchItems();
    } catch (err) {
        alert('Database Error: ' + err.message);
    }
});

window.deleteItem = async function(id) {
    if (confirm("Are you sure you want to delete this item from the shared database?")) {
        try {
            const {error} = await supabaseClient
            .from('inventory_items')
            .delete()
            .eq('id', id);

            if (error) throw error;
            await fetchItems();
        } catch (err) {
            alert('Error deleting item: ' + err.message);
        }
    }
};

window.editItem = function(id) {
    const item = items.find(item => item.id === id);
    if (!item) return;

    modalTitle.textContent = "Edit Item";
    itemIdInput.value = item.id;
    itemNameInput.value = item.name;
    itemTypeSelect.value = item.type;
    itemQuantityInput.value = item.quantity;
    itemCabinetSelect.value = item.cabinet;
    itemShelfSelect.value = item.shelf;
    itemStatusSelect.value = item.status;
    itemModal.classList.add('active');
};

function renderAll() {
    renderDashboard();
    renderInventoryTable();
}

function renderInventoryTable(filterQuery = '') {
      const tableBody = document.getElementById('inventory-table-body');
      tableBody.innerHTML = '';

      const filteredItems = items.filter(item => {
        const query = filterQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query) || 
            item.cabinet.toLowerCase().includes(query) ||
            item.shelf.toLowerCase().includes(query)
        );
      });

      if (filteredItems.length === 0) {
        tableBody.innerHTML = `
        <tr>
        <td colspan="6" class="table-no-data">
        ${filterQuery ? 'No matching items found.' : 'No items registered yet. Click "Add Item" to start!'}
        </td>
        </tr>
        `;
        return;
      }

      filteredItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><span class="badge-type">${item.type}</span></td>
        <td>${item.quantity}</td>
        <td>${item.cabinet} (${item.shelf})</td>
        <td><span class="badge ${item.status}">${item.status}</span></td>
        <td>
          <button class="btn-icon locate" onclick="locateItem('${item.id}')" title="Locate in Map" style="margin-right: 4px;">
                    <i class="fa-solid fa-map-location-dot"></i>
                </button>
                <button class="btn-icon edit" onclick="editItem('${item.id}')" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteItem('${item.id}')" title="Delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
      });
}

function renderDashboard() {
    const totalCount = items.length;
    const instrumentCount = items.filter(item => item.type === 'instrument').length;
    const chemicalCount = items.filter(item => item.type === 'chemical').length;
    const lowStockCount = items.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-instruments').textContent = instrumentCount;
    document.getElementById('stat-chemicals').textContent = chemicalCount;
    document.getElementById('stat-low').textContent = lowStockCount;

    const recentList = document.getElementById('recent-items-list');
    recentList.innerHTML = '';

    if (items.length === 0) {
        recentList.innerHTML = `<li class="no-data">No items logged yet. Head to "Inventory" to add items!</li>`;
        return;
    }

    const recentItems = [...items].slice(-5).reverse();
    recentItems.forEach(item => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.padding = '10px 0';
        li.style.borderBottom = '1px solid hsl(210, 14%, 96%)';
        li.innerHTML = `
        <span><strong>${item.name}</strong> (${item.type})</span>
        <span style="color: var(--text-secondary); font-size: 0.9rem;">
        Stored in ${item.cabinet}
        </span>
        `;
        recentList.appendChild(li);
    });
}

const searchInput = document.getElementById('inventory-search');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    renderInventoryTable(query);
});

window.locateItem = function(id) {
    const item = items.find(item => item.id === id);
    if (!item) return;

    const locaterTab = document.querySelector('.nav-item[data-target="locater"]');
    if (locaterTab) {
        navItems.forEach(nav => nav.classList.remove('active'));
        locaterTab.classList.add('active');

        views.forEach(view => view.classList.remove('active'));
        const locaterView = document.getElementById('locater-view');
        if (locaterView) {
            locaterView.classList.add('active');
        }
        pageTitle.textContent = "Lab Locater";
    }
    document.querySelectorAll('.cabinet-box').forEach(box => {
        box.classList.remove('highlight');
    });
    document.querySelectorAll('.shelf-row').forEach(shelf => {
        shelf.classList.remove('highlight-shelf');
    });

    const targetCabinet = document.querySelector(`.cabinet-box[data-cabinet="${item.cabinet}"]`);
    if (targetCabinet) {
        targetCabinet.classList.add('highlight');

    const targetShelf = targetCabinet.querySelector(`.shelf-row[data-shelf="${item.shelf}"]`);
    if (targetShelf) {
        targetShelf.classList.add('highlight-shelf');
    }
    targetCabinet.scrollIntoView({behavior: 'smooth', block: 'center'});

    setTimeout(() => {
        targetCabinet.classList.remove('highlight');
        if (targetShelf) {
            targetShelf.classList.remove('highlight-shelf');
        }
    }, 5000);
    }
};

fetchItems();