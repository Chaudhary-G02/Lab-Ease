let items = JSON.parse(localStorage.getItem('labease_inventory')) || [];

function saveToStorage() {
    localStorage.setItem('labease_inventory', JSON.stringify(items));
    renderAll();
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

itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = itemNameInput.value.trim();
    const type = itemTypeSelect.value;
    const quantity = parseInt(itemQuantityInput.value, 10);
    const cabinet = itemCabinetSelect.value;
    const shelf = itemShelfSelect.value;
    const status = itemStatusSelect.value;
    const id = itemIdInput.value;

    if (id) {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = {id,name,type,quantity,cabinet,shelf,status};
        }
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
        items.push(newItem);
    }
    saveToStorage();
    closeModal();
});

window.deleteItem = function(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        items = items.filter(item => item.id !== id);
        saveToStorage();
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

function renderInventoryTable() {
    const tableBody = document.getElementById('inventory-table-body');
    tableBody.innerHTML = '';

    if (items.length === 0) {
        tableBody.innerHTML = `
        <tr>
        <td colspan="6" class ="table-no-data">
        No items registered yet. Click "Add Item" to start!
        </td>
        </tr>
        `;
        return;
    }

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><span class="badge-type>${item.type}</span></td>
        <td>${item.quantity}</td>
        <td>${item.cabinet} (${item.shelf})</td>
        <td><span class="badge ${item.status}">${item.status}</span></td>
        <td>
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
renderAll();