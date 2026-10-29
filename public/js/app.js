/**
 * ============================================================================
 * MessMate — Frontend Application Logic (Vanilla JavaScript)
 * File: public/js/app.js
 * Description: Interactive UI controller for hostel mess inventory, stock inward,
 *              daily meals, low-stock alerts, and replenishment calculations.
 * ============================================================================
 */

// Initial Seed Data (Mirrors database/sample_data.sql)
const state = {
  activeHostelId: 'all', // 'all' or 1, 2, 3, 4

  hostels: [
    { id: 1, name: 'Nek Chand 1', type: 'Boys Hostel', capacity: 450, manager: 'Rajesh Sharma', phone: '+91-9811100001', email: 'rajesh.nc1@messmate.edu' },
    { id: 2, name: 'Nek Chand 2', type: 'Boys Hostel', capacity: 500, manager: 'Anita Verma',   phone: '+91-9811100002', email: 'anita.nc2@messmate.edu' },
    { id: 3, name: 'Zakir 1',       type: 'Girls Hostel', capacity: 400, manager: 'Sunil Kumar',   phone: '+91-9811100003', email: 'sunil.z1@messmate.edu' },
    { id: 4, name: 'Zakir 2',       type: 'Girls Hostel', capacity: 350, manager: 'Preeti Singh',  phone: '+91-9811100004', email: 'preeti.z2@messmate.edu' }
  ],

  rawMaterials: [
    { id: 1,  name: 'Basmati Rice',             category: 'Grains & Cereals',    unit: 'kg',     reorderLevel: 50.0 },
    { id: 2,  name: 'Sharbati Wheat Flour',     category: 'Grains & Cereals',    unit: 'kg',     reorderLevel: 75.0 },
    { id: 3,  name: 'Poha (Flattened Rice)',    category: 'Grains & Cereals',    unit: 'kg',     reorderLevel: 20.0 },
    { id: 4,  name: 'Arhar / Toor Dal',         category: 'Pulses & Lentils',    unit: 'kg',     reorderLevel: 30.0 },
    { id: 5,  name: 'Chana Dal',                category: 'Pulses & Lentils',    unit: 'kg',     reorderLevel: 25.0 },
    { id: 6,  name: 'Rajma (Red Kidney Beans)', category: 'Pulses & Lentils',    unit: 'kg',     reorderLevel: 20.0 },
    { id: 7,  name: 'Moong Dal (Washed)',       category: 'Pulses & Lentils',    unit: 'kg',     reorderLevel: 25.0 },
    { id: 8,  name: 'Mustard Oil',              category: 'Oils & Ghee',         unit: 'litres', reorderLevel: 25.0 },
    { id: 9,  name: 'Refined Sunflower Oil',    category: 'Oils & Ghee',         unit: 'litres', reorderLevel: 30.0 },
    { id: 10, name: 'Desi Ghee',                category: 'Oils & Ghee',         unit: 'litres', reorderLevel: 10.0 },
    { id: 11, name: 'Fresh Cow Milk',           category: 'Dairy',               unit: 'litres', reorderLevel: 50.0 },
    { id: 12, name: 'Fresh Paneer',             category: 'Dairy',               unit: 'kg',     reorderLevel: 15.0 },
    { id: 13, name: 'Plain Curd (Dahi)',        category: 'Dairy',               unit: 'kg',     reorderLevel: 20.0 },
    { id: 14, name: 'Potatoes (Aloo)',          category: 'Vegetables',          unit: 'kg',     reorderLevel: 60.0 },
    { id: 15, name: 'Onions (Pyaz)',            category: 'Vegetables',          unit: 'kg',     reorderLevel: 50.0 },
    { id: 16, name: 'Tomatoes (Tamatar)',       category: 'Vegetables',          unit: 'kg',     reorderLevel: 30.0 },
    { id: 17, name: 'Green Chillies',           category: 'Vegetables',          unit: 'kg',      reorderLevel: 5.0 },
    { id: 18, name: 'Turmeric Powder (Haldi)',  category: 'Spices & Condiments', unit: 'kg',      reorderLevel: 5.0 },
    { id: 19, name: 'Red Chilli Powder',        category: 'Spices & Condiments', unit: 'kg',      reorderLevel: 5.0 },
    { id: 20, name: 'Garam Masala',             category: 'Spices & Condiments', unit: 'kg',      reorderLevel: 3.0 },
    { id: 21, name: 'Iodized Table Salt',       category: 'Spices & Condiments', unit: 'kg',     reorderLevel: 25.0 },
    { id: 22, name: 'Tea Leaves',               category: 'Bakery & Others',     unit: 'kg',     reorderLevel: 10.0 },
    { id: 23, name: 'Refined Sugar',            category: 'Bakery & Others',     unit: 'kg',     reorderLevel: 35.0 }
  ],

  // Stock inventory: hostelId, itemId, currentQuantity
  inventory: [
    // Nek Chand 1
    { hostelId: 1, itemId: 1,  quantity: 180.0 },
    { hostelId: 1, itemId: 2,  quantity: 240.0 },
    { hostelId: 1, itemId: 3,  quantity: 45.0 },
    { hostelId: 1, itemId: 4,  quantity: 85.0 },
    { hostelId: 1, itemId: 5,  quantity: 60.0 },
    { hostelId: 1, itemId: 6,  quantity: 55.0 },
    { hostelId: 1, itemId: 7,  quantity: 70.0 },
    { hostelId: 1, itemId: 8,  quantity: 40.0 },
    { hostelId: 1, itemId: 9,  quantity: 50.0 },
    { hostelId: 1, itemId: 10, quantity: 18.0 },
    { hostelId: 1, itemId: 11, quantity: 65.0 },
    { hostelId: 1, itemId: 12, quantity: 22.0 },
    { hostelId: 1, itemId: 13, quantity: 35.0 },
    { hostelId: 1, itemId: 14, quantity: 150.0 },
    { hostelId: 1, itemId: 15, quantity: 120.0 },
    { hostelId: 1, itemId: 16, quantity: 80.0 },
    { hostelId: 1, itemId: 17, quantity: 12.0 },
    { hostelId: 1, itemId: 18, quantity: 14.0 },
    { hostelId: 1, itemId: 19, quantity: 11.0 },
    { hostelId: 1, itemId: 20, quantity: 6.5 },
    { hostelId: 1, itemId: 21, quantity: 60.0 },
    { hostelId: 1, itemId: 22, quantity: 25.0 },
    { hostelId: 1, itemId: 23, quantity: 90.0 },

    // Nek Chand 2 (Low stock: Mustard Oil 18 <= 25, Milk 42 <= 50)
    { hostelId: 2, itemId: 1,  quantity: 210.0 },
    { hostelId: 2, itemId: 2,  quantity: 280.0 },
    { hostelId: 2, itemId: 3,  quantity: 50.0 },
    { hostelId: 2, itemId: 4,  quantity: 95.0 },
    { hostelId: 2, itemId: 5,  quantity: 70.0 },
    { hostelId: 2, itemId: 6,  quantity: 65.0 },
    { hostelId: 2, itemId: 7,  quantity: 80.0 },
    { hostelId: 2, itemId: 8,  quantity: 18.0 }, // LOW
    { hostelId: 2, itemId: 9,  quantity: 60.0 },
    { hostelId: 2, itemId: 10, quantity: 15.0 },
    { hostelId: 2, itemId: 11, quantity: 42.0 }, // LOW
    { hostelId: 2, itemId: 12, quantity: 28.0 },
    { hostelId: 2, itemId: 13, quantity: 40.0 },
    { hostelId: 2, itemId: 14, quantity: 175.0 },
    { hostelId: 2, itemId: 15, quantity: 140.0 },
    { hostelId: 2, itemId: 16, quantity: 95.0 },
    { hostelId: 2, itemId: 17, quantity: 15.0 },
    { hostelId: 2, itemId: 18, quantity: 16.0 },
    { hostelId: 2, itemId: 19, quantity: 14.0 },
    { hostelId: 2, itemId: 20, quantity: 8.0 },
    { hostelId: 2, itemId: 21, quantity: 70.0 },
    { hostelId: 2, itemId: 22, quantity: 28.0 },
    { hostelId: 2, itemId: 23, quantity: 105.0 },

    // Zakir 1 (Low stock: Toor Dal 22 <= 30, Tomatoes 24 <= 30)
    { hostelId: 3, itemId: 1,  quantity: 160.0 },
    { hostelId: 3, itemId: 2,  quantity: 210.0 },
    { hostelId: 3, itemId: 3,  quantity: 40.0 },
    { hostelId: 3, itemId: 4,  quantity: 22.0 }, // LOW
    { hostelId: 3, itemId: 5,  quantity: 50.0 },
    { hostelId: 3, itemId: 6,  quantity: 48.0 },
    { hostelId: 3, itemId: 7,  quantity: 60.0 },
    { hostelId: 3, itemId: 8,  quantity: 35.0 },
    { hostelId: 3, itemId: 9,  quantity: 45.0 },
    { hostelId: 3, itemId: 10, quantity: 12.0 },
    { hostelId: 3, itemId: 11, quantity: 55.0 },
    { hostelId: 3, itemId: 12, quantity: 18.0 },
    { hostelId: 3, itemId: 13, quantity: 30.0 },
    { hostelId: 3, itemId: 14, quantity: 130.0 },
    { hostelId: 3, itemId: 15, quantity: 110.0 },
    { hostelId: 3, itemId: 16, quantity: 24.0 }, // LOW
    { hostelId: 3, itemId: 17, quantity: 10.0 },
    { hostelId: 3, itemId: 18, quantity: 12.0 },
    { hostelId: 3, itemId: 19, quantity: 10.0 },
    { hostelId: 3, itemId: 20, quantity: 5.0 },
    { hostelId: 3, itemId: 21, quantity: 50.0 },
    { hostelId: 3, itemId: 22, quantity: 20.0 },
    { hostelId: 3, itemId: 23, quantity: 75.0 },

    // Zakir 2 (Low stock: Desi Ghee 6 <= 10, Milk 48 <= 50)
    { hostelId: 4, itemId: 1,  quantity: 140.0 },
    { hostelId: 4, itemId: 2,  quantity: 190.0 },
    { hostelId: 4, itemId: 3,  quantity: 35.0 },
    { hostelId: 4, itemId: 4,  quantity: 70.0 },
    { hostelId: 4, itemId: 5,  quantity: 45.0 },
    { hostelId: 4, itemId: 6,  quantity: 40.0 },
    { hostelId: 4, itemId: 7,  quantity: 55.0 },
    { hostelId: 4, itemId: 8,  quantity: 30.0 },
    { hostelId: 4, itemId: 9,  quantity: 40.0 },
    { hostelId: 4, itemId: 10, quantity: 6.0 },  // LOW
    { hostelId: 4, itemId: 11, quantity: 48.0 }, // LOW
    { hostelId: 4, itemId: 12, quantity: 16.0 },
    { hostelId: 4, itemId: 13, quantity: 25.0 },
    { hostelId: 4, itemId: 14, quantity: 115.0 },
    { hostelId: 4, itemId: 15, quantity: 95.0 },
    { hostelId: 4, itemId: 16, quantity: 70.0 },
    { hostelId: 4, itemId: 17, quantity: 8.0 },
    { hostelId: 4, itemId: 18, quantity: 10.0 },
    { hostelId: 4, itemId: 19, quantity: 9.0 },
    { hostelId: 4, itemId: 20, quantity: 4.5 },
    { hostelId: 4, itemId: 21, quantity: 45.0 },
    { hostelId: 4, itemId: 22, quantity: 18.0 },
    { hostelId: 4, itemId: 23, quantity: 65.0 }
  ],

  // Stock Inward transactions log
  transactions: [
    { id: 1,  hostelId: 1, itemId: 1,  qty: 200, unitPrice: 48.0,  supplier: 'Kisan Agro Foods',        invoice: 'INV-2026-101', date: '2026-10-20' },
    { id: 2,  hostelId: 1, itemId: 2,  qty: 250, unitPrice: 34.5,  supplier: 'Shree Ganesh Flour Mill', invoice: 'INV-2026-102', date: '2026-10-20' },
    { id: 3,  hostelId: 1, itemId: 4,  qty: 100, unitPrice: 135.0, supplier: 'Kisan Agro Foods',        invoice: 'INV-2026-103', date: '2026-10-21' },
    { id: 4,  hostelId: 1, itemId: 8,  qty: 50,  unitPrice: 145.0, supplier: 'Dhara Oil Depot',         invoice: 'INV-2026-104', date: '2026-10-21' },
    { id: 5,  hostelId: 1, itemId: 11, qty: 80,  unitPrice: 58.0,  supplier: 'Verka Milk Cooperative',  invoice: 'INV-2026-105', date: '2026-10-24' },
    { id: 6,  hostelId: 1, itemId: 14, qty: 180, unitPrice: 22.0,  supplier: 'City Sabzi Mandi',        invoice: 'INV-2026-106', date: '2026-10-24' },
    { id: 7,  hostelId: 2, itemId: 1,  qty: 250, unitPrice: 48.0,  supplier: 'Kisan Agro Foods',        invoice: 'INV-2026-201', date: '2026-10-19' },
    { id: 8,  hostelId: 2, itemId: 2,  qty: 300, unitPrice: 34.5,  supplier: 'Shree Ganesh Flour Mill', invoice: 'INV-2026-202', date: '2026-10-19' },
    { id: 9,  hostelId: 2, itemId: 6,  qty: 80,  unitPrice: 120.0, supplier: 'Kisan Agro Foods',        invoice: 'INV-2026-203', date: '2026-10-21' },
    { id: 10, hostelId: 2, itemId: 12, qty: 35,  unitPrice: 320.0, supplier: 'Verka Milk Cooperative',  invoice: 'INV-2026-204', date: '2026-10-23' },
    { id: 11, hostelId: 3, itemId: 1,  qty: 180, unitPrice: 48.0,  supplier: 'Punjab Grains Agency',    invoice: 'INV-2026-301', date: '2026-10-20' },
    { id: 12, hostelId: 3, itemId: 2,  qty: 220, unitPrice: 34.0,  supplier: 'Shree Ganesh Flour Mill', invoice: 'INV-2026-302', date: '2026-10-20' },
    { id: 13, hostelId: 3, itemId: 11, qty: 70,  unitPrice: 58.0,  supplier: 'Verka Milk Cooperative',  invoice: 'INV-2026-303', date: '2026-10-23' },
    { id: 14, hostelId: 4, itemId: 1,  qty: 150, unitPrice: 48.0,  supplier: 'Punjab Grains Agency',    invoice: 'INV-2026-401', date: '2026-10-21' },
    { id: 15, hostelId: 4, itemId: 2,  qty: 200, unitPrice: 34.0,  supplier: 'Shree Ganesh Flour Mill', invoice: 'INV-2026-402', date: '2026-10-21' },
    { id: 16, hostelId: 4, itemId: 9,  qty: 50,  unitPrice: 125.0, supplier: 'Dhara Oil Depot',         invoice: 'INV-2026-403', date: '2026-10-22' }
  ],

  // Daily Meal logs
  meals: [
    {
      id: 1,
      hostelId: 1,
      date: '2026-10-25',
      type: 'Breakfast',
      food: 'Aloo Paratha, Curd & Pickle',
      portions: 410,
      consumptions: [
        { itemId: 2,  qty: 45.0 }, // Atta
        { itemId: 14, qty: 35.0 }, // Potatoes
        { itemId: 8,  qty: 8.0 },  // Mustard Oil
        { itemId: 13, qty: 30.0 }  // Curd
      ]
    },
    {
      id: 2,
      hostelId: 1,
      date: '2026-10-25',
      type: 'Lunch',
      food: 'Rajma, Basmati Rice, Roti & Salad',
      portions: 430,
      consumptions: [
        { itemId: 1,  qty: 38.0 }, // Rice
        { itemId: 2,  qty: 40.0 }, // Atta
        { itemId: 6,  qty: 25.0 }, // Rajma
        { itemId: 15, qty: 12.0 }  // Onions
      ]
    },
    {
      id: 3,
      hostelId: 1,
      date: '2026-10-25',
      type: 'Snacks',
      food: 'Veg Samosa & Masala Tea',
      portions: 390,
      consumptions: [
        { itemId: 2,  qty: 20.0 },
        { itemId: 14, qty: 25.0 },
        { itemId: 11, qty: 15.0 }, // Milk
        { itemId: 22, qty: 3.0 }   // Tea
      ]
    },
    {
      id: 4,
      hostelId: 2,
      date: '2026-10-25',
      type: 'Dinner',
      food: 'Kadai Paneer, Arhar Dal, Roti',
      portions: 470,
      consumptions: [
        { itemId: 2,  qty: 45.0 }, // Atta
        { itemId: 12, qty: 18.0 }, // Paneer
        { itemId: 4,  qty: 15.0 }, // Toor Dal
        { itemId: 16, qty: 16.0 }  // Tomatoes
      ]
    },
    {
      id: 5,
      hostelId: 3,
      date: '2026-10-25',
      type: 'Lunch',
      food: 'Moong Dal Khichdi, Curd & Papad',
      portions: 360,
      consumptions: [
        { itemId: 1,  qty: 30.0 }, // Rice
        { itemId: 7,  qty: 20.0 }, // Moong Dal
        { itemId: 13, qty: 25.0 }  // Curd
      ]
    },
    {
      id: 6,
      hostelId: 4,
      date: '2026-10-25',
      type: 'Lunch',
      food: 'Kadhi Pakoda, Rice, Roti, Salad',
      portions: 320,
      consumptions: [
        { itemId: 1,  qty: 28.0 },
        { itemId: 2,  qty: 30.0 },
        { itemId: 5,  qty: 15.0 }  // Chana dal / besan
      ]
    }
  ]
};

// ============================================================================
// Helper Utilities
// ============================================================================

function getHostel(id) {
  return state.hostels.find(h => h.id === Number(id));
}

function getItem(id) {
  return state.rawMaterials.find(m => m.id === Number(id));
}

function formatCurrency(amount) {
  return '₹ ' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ============================================================================
// Render Functions
// ============================================================================

/**
 * 1. Render Dashboard Tab
 */
function renderDashboard() {
  const activeHostelId = state.activeHostelId;

  // Filter inventory and transactions according to active hostel
  const filteredInv = activeHostelId === 'all'
    ? state.inventory
    : state.inventory.filter(i => i.hostelId === Number(activeHostelId));

  const filteredTx = activeHostelId === 'all'
    ? state.transactions
    : state.transactions.filter(t => t.hostelId === Number(activeHostelId));

  // Calculate low-stock items (quantity <= reorderLevel)
  const lowStockItems = [];
  filteredInv.forEach(inv => {
    const item = getItem(inv.itemId);
    if (!item) return;
    if (inv.quantity <= item.reorderLevel) {
      lowStockItems.push({
        hostel: getHostel(inv.hostelId),
        item: item,
        current: inv.quantity,
        reorder: item.reorderLevel,
        deficit: (item.reorderLevel - inv.quantity).toFixed(1)
      });
    }
  });

  // Calculate total inward expense
  const totalSpend = filteredTx.reduce((sum, tx) => sum + (tx.qty * tx.unitPrice), 0);

  // Update KPI counters
  document.getElementById('kpiTotalHostels').textContent = activeHostelId === 'all' ? state.hostels.length : '1';
  
  const totalCapacity = activeHostelId === 'all'
    ? state.hostels.reduce((sum, h) => sum + h.capacity, 0)
    : (getHostel(activeHostelId)?.capacity || 0);
  document.getElementById('kpiTotalCapacity').textContent = totalCapacity.toLocaleString();

  document.getElementById('kpiTotalItems').textContent = state.rawMaterials.length;
  
  const kpiLowStock = document.getElementById('kpiLowStock');
  kpiLowStock.textContent = lowStockItems.length;

  document.getElementById('kpiTotalSpend').textContent = formatCurrency(totalSpend);

  // Render Low Stock Table
  const tbody = document.getElementById('lowStockTableBody');
  if (lowStockItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 1.5rem; color:#15803d; font-weight:600;">
      ✅ All raw materials are comfortably above safety reorder thresholds!
    </td></tr>`;
  } else {
    tbody.innerHTML = lowStockItems.map(ls => `
      <tr class="row-danger">
        <td><strong>${ls.hostel.name}</strong></td>
        <td><strong>${ls.item.name}</strong></td>
        <td>${ls.item.category}</td>
        <td><strong class="text-danger">${ls.current.toFixed(1)} ${ls.item.unit}</strong></td>
        <td>${ls.reorder.toFixed(1)} ${ls.item.unit}</td>
        <td><span class="badge badge-danger">-${ls.deficit} ${ls.item.unit}</span></td>
        <td><button class="btn btn-primary btn-sm" onclick="quickRestock(${ls.hostel.id}, ${ls.item.id})">+ Restock</button></td>
      </tr>
    `).join('');
  }

  // Render 4 Hostel Facility Cards
  const hostelGrid = document.getElementById('hostelCardsGrid');
  hostelGrid.innerHTML = state.hostels.map(h => {
    // Count alerts specifically for this hostel
    const hostelAlerts = state.inventory.filter(i => {
      const it = getItem(i.itemId);
      return i.hostelId === h.id && it && i.quantity <= it.reorderLevel;
    }).length;

    const hostelSpend = state.transactions
      .filter(t => t.hostelId === h.id)
      .reduce((sum, t) => sum + (t.qty * t.unitPrice), 0);

    return `
      <div class="hostel-card">
        <div>
          <div class="hostel-card-top">
            <h4 class="hostel-card-title">${h.name}</h4>
            <span class="hostel-card-type">${h.type}</span>
          </div>
          <div class="hostel-meta-row">
            <span class="hostel-meta-label">Student Capacity:</span>
            <span class="hostel-meta-value">${h.capacity} students</span>
          </div>
          <div class="hostel-meta-row">
            <span class="hostel-meta-label">Mess Manager:</span>
            <span class="hostel-meta-value">${h.manager}</span>
          </div>
          <div class="hostel-meta-row">
            <span class="hostel-meta-label">Manager Phone:</span>
            <span class="hostel-meta-value">${h.phone}</span>
          </div>
          <div class="hostel-meta-row">
            <span class="hostel-meta-label">Inward Expenses:</span>
            <span class="hostel-meta-value">${formatCurrency(hostelSpend)}</span>
          </div>
        </div>
        <div class="hostel-card-foot">
          <span>Alerts: 
            <span class="badge ${hostelAlerts > 0 ? 'badge-danger' : 'badge-success'}">
              ${hostelAlerts > 0 ? `⚠️ ${hostelAlerts} Low Stock` : '✅ Stock Safe'}
            </span>
          </span>
          <button class="btn btn-secondary btn-sm" onclick="selectHostel(${h.id})">View Stock</button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 2. Render Inventory Tab
 */
function renderInventory() {
  const hostelFilter = document.getElementById('invHostelFilter').value;
  const catFilter = document.getElementById('invCategoryFilter').value;
  const stockFilter = document.getElementById('invStockFilter').value;
  const searchQuery = document.getElementById('invSearch').value.toLowerCase().trim();

  const tbody = document.getElementById('inventoryTableBody');

  const rows = state.inventory.filter(inv => {
    // Hostel filter
    if (hostelFilter !== 'all' && inv.hostelId !== Number(hostelFilter)) return false;

    const item = getItem(inv.itemId);
    if (!item) return false;

    // Category filter
    if (catFilter !== 'all' && item.category !== catFilter) return false;

    // Stock level filter
    const isLow = inv.quantity <= item.reorderLevel;
    if (stockFilter === 'low' && !isLow) return false;
    if (stockFilter === 'sufficient' && isLow) return false;

    // Search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) return false;

    return true;
  });

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: #64748b;">
      No materials found matching current filters.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(inv => {
    const item = getItem(inv.itemId);
    const hostel = getHostel(inv.hostelId);
    const isLow = inv.quantity <= item.reorderLevel;

    // Ratio for progress bar (capped at 100% of 2.5x reorder level)
    const ratio = Math.min(100, Math.round((inv.quantity / (item.reorderLevel * 2.5)) * 100));
    const fillClass = isLow ? 'fill-danger' : (inv.quantity < item.reorderLevel * 1.5 ? 'fill-warn' : 'fill-safe');

    return `
      <tr class="${isLow ? 'row-danger' : ''}">
        <td><span class="badge badge-hostel">${hostel.name}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td><strong>${inv.quantity.toFixed(1)} ${item.unit}</strong></td>
        <td>${item.reorderLevel.toFixed(1)} ${item.unit}</td>
        <td>
          <div class="stock-bar-wrapper">
            <div class="stock-bar-fill ${fillClass}" style="width: ${ratio}%;"></div>
          </div>
          <small>${ratio}%</small>
        </td>
        <td>
          <span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">
            ${isLow ? '⚠️ Low Stock' : '✅ Sufficient'}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="quickRestock(${hostel.id}, ${item.id})">+ Stock</button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * 3. Render Stock Inward Tab (Form Dropdown & Transactions Table)
 */
function renderStockInward() {
  // Populate Raw Materials dropdown in inward form
  const itemSelect = document.getElementById('inwardItem');
  if (itemSelect && itemSelect.options.length <= 1) {
    itemSelect.innerHTML = '<option value="">-- Select Raw Material --</option>' +
      state.rawMaterials.map(m => `
        <option value="${m.id}" data-unit="${m.unit}">${m.name} (${m.category})</option>
      `).join('');
  }

  // Populate secondary transaction table
  const tbody = document.getElementById('transactionsTableBody');
  const countBadge = document.getElementById('txCountBadge');
  
  const txList = [...state.transactions].reverse();
  countBadge.textContent = `${txList.length} records`;

  tbody.innerHTML = txList.map(tx => {
    const hostel = getHostel(tx.hostelId);
    const item = getItem(tx.itemId);
    const total = tx.qty * tx.unitPrice;

    return `
      <tr>
        <td>${tx.date}</td>
        <td><span class="badge badge-hostel">${hostel?.name || 'N/A'}</span></td>
        <td><strong>${item?.name || 'Item'}</strong></td>
        <td>${tx.qty} ${item?.unit || ''}</td>
        <td><strong>${formatCurrency(total)}</strong> <small>(@ ₹${tx.unitPrice})</small></td>
        <td>${tx.supplier}</td>
        <td><code>${tx.invoice || 'N/A'}</code></td>
      </tr>
    `;
  }).join('');
}

/**
 * 4. Render Meals & Consumption Tab
 */
function renderMeals() {
  // Populate dropdowns in meal form
  const primaryItemSelect = document.getElementById('mealPrimaryItem');
  const secondaryItemSelect = document.getElementById('mealSecondaryItem');

  if (primaryItemSelect && primaryItemSelect.options.length <= 1) {
    const optionsHtml = state.rawMaterials.map(m => `
      <option value="${m.id}">${m.name} (${m.unit})</option>
    `).join('');

    primaryItemSelect.innerHTML = '<option value="">-- Select Ingredient --</option>' + optionsHtml;
    secondaryItemSelect.innerHTML = '<option value="">-- None --</option>' + optionsHtml;
  }

  const tbody = document.getElementById('mealsTableBody');
  const countBadge = document.getElementById('mealsCountBadge');

  const mealsList = [...state.meals].reverse();
  countBadge.textContent = `${mealsList.length} meals`;

  tbody.innerHTML = mealsList.map(meal => {
    const hostel = getHostel(meal.hostelId);
    const consumptionsHtml = meal.consumptions.map(c => {
      const it = getItem(c.itemId);
      return `<span class="badge badge-hostel">${it?.name}: ${c.qty} ${it?.unit}</span>`;
    }).join(' ');

    return `
      <tr>
        <td>${meal.date}</td>
        <td><span class="badge badge-hostel">${hostel?.name || 'N/A'}</span></td>
        <td><span class="badge badge-meal">${meal.type}</span></td>
        <td><strong>${meal.food}</strong></td>
        <td><strong class="text-primary">${meal.portions}</strong> plates</td>
        <td>${consumptionsHtml}</td>
      </tr>
    `;
  }).join('');
}

/**
 * 5. Render Replenishment & Reports Tab
 */
function renderReplenishment() {
  const tbody = document.getElementById('replenishmentTableBody');
  const reportRows = [];

  state.inventory.forEach(inv => {
    const item = getItem(inv.itemId);
    const hostel = getHostel(inv.hostelId);
    if (!item || !hostel) return;

    if (inv.quantity <= item.reorderLevel) {
      const deficit = item.reorderLevel - inv.quantity;
      // Formula: Replenishment Target = 2x Reorder Level
      const suggestedOrder = (item.reorderLevel * 2) - inv.quantity;
      const priority = inv.quantity < (item.reorderLevel * 0.5) ? 'URGENT' : 'HIGH';

      reportRows.push({
        hostel,
        item,
        current: inv.quantity,
        reorder: item.reorderLevel,
        deficit,
        suggestedOrder,
        priority
      });
    }
  });

  // Sort by highest deficit first
  reportRows.sort((a, b) => b.deficit - a.deficit);

  if (reportRows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: #16a34a; font-weight: 700;">
      🎉 No replenishment orders needed. All hostel store rooms are well-stocked!
    </td></tr>`;
  } else {
    tbody.innerHTML = reportRows.map(r => `
      <tr class="row-danger">
        <td><strong>${r.hostel.name}</strong></td>
        <td><strong>${r.item.name}</strong></td>
        <td>${r.item.category}</td>
        <td><strong class="text-danger">${r.current.toFixed(1)} ${r.item.unit}</strong></td>
        <td>${r.reorder.toFixed(1)} ${r.item.unit}</td>
        <td><span class="badge badge-danger">-${r.deficit.toFixed(1)} ${r.item.unit}</span></td>
        <td><strong>+ ${r.suggestedOrder.toFixed(1)} ${r.item.unit}</strong></td>
        <td><span class="badge ${r.priority === 'URGENT' ? 'badge-danger' : 'badge-warning'}">${r.priority}</span></td>
      </tr>
    `).join('');
  }

  // Render Hostel Consumption & Spending Summary
  const summaryTbody = document.getElementById('hostelSummaryTableBody');
  summaryTbody.innerHTML = state.hostels.map(h => {
    const totalSpend = state.transactions
      .filter(t => t.hostelId === h.id)
      .reduce((sum, t) => sum + (t.qty * t.unitPrice), 0);

    const alertCount = state.inventory.filter(i => {
      const it = getItem(i.itemId);
      return i.hostelId === h.id && it && i.quantity <= it.reorderLevel;
    }).length;

    return `
      <tr>
        <td><strong>${h.name}</strong></td>
        <td>${h.type}</td>
        <td><strong>${h.capacity}</strong> students</td>
        <td>${h.manager}</td>
        <td>${h.phone}</td>
        <td><strong>${formatCurrency(totalSpend)}</strong></td>
        <td>
          <span class="badge ${alertCount > 0 ? 'badge-danger' : 'badge-success'}">
            ${alertCount > 0 ? `⚠️ ${alertCount} items low` : '✅ Stock Safe'}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================================
// Interactive Event Handlers
// ============================================================================

/**
 * Tab Navigation
 */
function switchTab(targetTabId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTabId);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === targetTabId);
  });

  // Re-render the active tab
  if (targetTabId === 'tab-dashboard') renderDashboard();
  if (targetTabId === 'tab-inventory') renderInventory();
  if (targetTabId === 'tab-inward') renderStockInward();
  if (targetTabId === 'tab-meals') renderMeals();
  if (targetTabId === 'tab-replenish') renderReplenishment();
}

/**
 * Select a specific hostel from card shortcut
 */
function selectHostel(hostelId) {
  state.activeHostelId = String(hostelId);
  document.getElementById('globalHostelSelect').value = String(hostelId);
  document.getElementById('invHostelFilter').value = String(hostelId);
  switchTab('tab-inventory');
}

/**
 * Quick Restock Modal
 */
function quickRestock(hostelId, itemId) {
  const hostel = getHostel(hostelId);
  const item = getItem(itemId);
  if (!hostel || !item) return;

  document.getElementById('modalHostelId').value = hostelId;
  document.getElementById('modalItemId').value = itemId;
  document.getElementById('modalHostelName').textContent = hostel.name;
  document.getElementById('modalItemName').textContent = item.name;
  document.getElementById('modalUnit').textContent = item.unit;
  document.getElementById('modalQty').value = Math.ceil(item.reorderLevel);

  document.getElementById('quickStockModal').classList.add('active');
}

function closeStockModal() {
  document.getElementById('quickStockModal').classList.remove('active');
}

function openStockModal() {
  switchTab('tab-inward');
}

// ============================================================================
// Form Submissions
// ============================================================================

/**
 * Handle Stock Inward Form
 */
function handleStockInwardSubmit(e) {
  e.preventDefault();
  const hostelId = Number(document.getElementById('inwardHostel').value);
  const itemId = Number(document.getElementById('inwardItem').value);
  const qty = parseFloat(document.getElementById('inwardQuantity').value);
  const unitPrice = parseFloat(document.getElementById('inwardUnitPrice').value);
  const supplier = document.getElementById('inwardSupplier').value.trim();
  const invoice = document.getElementById('inwardInvoice').value.trim() || `INV-${Date.now().toString().slice(-4)}`;
  const date = document.getElementById('inwardDate').value;

  if (!hostelId || !itemId || isNaN(qty) || qty <= 0 || isNaN(unitPrice)) {
    alert('Please fill out all required fields with valid quantities.');
    return;
  }

  // 1. Add to stock transactions
  const newTx = {
    id: state.transactions.length + 1,
    hostelId,
    itemId,
    qty,
    unitPrice,
    supplier,
    invoice,
    date
  };
  state.transactions.push(newTx);

  // 2. Update hostel inventory balance
  const invRecord = state.inventory.find(i => i.hostelId === hostelId && i.itemId === itemId);
  if (invRecord) {
    invRecord.quantity += qty;
  } else {
    state.inventory.push({ hostelId, itemId, quantity: qty });
  }

  showToast(`Successfully received ${qty} of ${getItem(itemId).name} for ${getHostel(hostelId).name}!`);

  // Reset form
  e.target.reset();
  document.getElementById('inwardTotalCostText').textContent = '₹ 0.00';
  document.getElementById('inwardDate').value = new Date().toISOString().split('T')[0];

  // Re-render
  renderStockInward();
  renderDashboard();
  renderInventory();
  renderReplenishment();
}

/**
 * Handle Quick Restock Modal Form
 */
function handleQuickRestockSubmit(e) {
  e.preventDefault();
  const hostelId = Number(document.getElementById('modalHostelId').value);
  const itemId = Number(document.getElementById('modalItemId').value);
  const qty = parseFloat(document.getElementById('modalQty').value);
  const unitPrice = parseFloat(document.getElementById('modalPrice').value);
  const supplier = document.getElementById('modalSupplier').value.trim();

  const invRecord = state.inventory.find(i => i.hostelId === hostelId && i.itemId === itemId);
  if (invRecord) {
    invRecord.quantity += qty;
  }

  state.transactions.push({
    id: state.transactions.length + 1,
    hostelId,
    itemId,
    qty,
    unitPrice,
    supplier,
    invoice: `QR-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0]
  });

  closeStockModal();
  showToast(`Added ${qty} ${getItem(itemId).unit} to ${getHostel(hostelId).name}!`);

  renderDashboard();
  renderInventory();
  renderReplenishment();
}

/**
 * Handle Meal Log Form
 */
function handleMealLogSubmit(e) {
  e.preventDefault();
  const hostelId = Number(document.getElementById('mealHostel').value);
  const date = document.getElementById('mealDate').value;
  const type = document.getElementById('mealType').value;
  const portions = parseInt(document.getElementById('mealPortions').value);
  const food = document.getElementById('mealDishes').value.trim();

  const primaryItemId = Number(document.getElementById('mealPrimaryItem').value);
  const primaryQty = parseFloat(document.getElementById('mealPrimaryQty').value);

  const secondaryItemId = Number(document.getElementById('mealSecondaryItem').value);
  const secondaryQty = parseFloat(document.getElementById('mealSecondaryQty').value);

  if (!hostelId || !primaryItemId || isNaN(primaryQty) || primaryQty <= 0) {
    alert('Please enter a valid meal record and primary ingredient.');
    return;
  }

  // Deduct from inventory
  const primaryInv = state.inventory.find(i => i.hostelId === hostelId && i.itemId === primaryItemId);
  if (primaryInv) {
    if (primaryInv.quantity < primaryQty) {
      if (!confirm(`Warning: Only ${primaryInv.quantity} available in stock. Consuming ${primaryQty} will cause deficit. Proceed?`)) {
        return;
      }
    }
    primaryInv.quantity = Math.max(0, primaryInv.quantity - primaryQty);
  }

  const consumptions = [{ itemId: primaryItemId, qty: primaryQty }];

  if (secondaryItemId && !isNaN(secondaryQty) && secondaryQty > 0) {
    const secInv = state.inventory.find(i => i.hostelId === hostelId && i.itemId === secondaryItemId);
    if (secInv) {
      secInv.quantity = Math.max(0, secInv.quantity - secondaryQty);
    }
    consumptions.push({ itemId: secondaryItemId, qty: secondaryQty });
  }

  state.meals.push({
    id: state.meals.length + 1,
    hostelId,
    date,
    type,
    food,
    portions,
    consumptions
  });

  showToast(`Logged ${type} for ${getHostel(hostelId).name} and deducted raw materials!`);

  e.target.reset();
  document.getElementById('mealDate').value = new Date().toISOString().split('T')[0];

  renderMeals();
  renderDashboard();
  renderInventory();
  renderReplenishment();
}

// ============================================================================
// Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set default dates to today
  const today = new Date().toISOString().split('T')[0];
  const inwardDate = document.getElementById('inwardDate');
  const mealDate = document.getElementById('mealDate');
  if (inwardDate) inwardDate.value = today;
  if (mealDate) mealDate.value = today;

  // Tab navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Global Active Hostel dropdown
  const globalHostelSelect = document.getElementById('globalHostelSelect');
  globalHostelSelect.addEventListener('change', (e) => {
    state.activeHostelId = e.target.value;
    document.getElementById('invHostelFilter').value = e.target.value;
    renderDashboard();
    renderInventory();
  });

  // Inventory Filters
  document.getElementById('invHostelFilter').addEventListener('change', renderInventory);
  document.getElementById('invCategoryFilter').addEventListener('change', renderInventory);
  document.getElementById('invStockFilter').addEventListener('change', renderInventory);
  document.getElementById('invSearch').addEventListener('input', renderInventory);

  // Inward Form Price Calculation
  const qtyInput = document.getElementById('inwardQuantity');
  const priceInput = document.getElementById('inwardUnitPrice');
  const totalCostText = document.getElementById('inwardTotalCostText');

  function calculateInwardTotal() {
    const q = parseFloat(qtyInput.value) || 0;
    const p = parseFloat(priceInput.value) || 0;
    totalCostText.textContent = formatCurrency(q * p);
  }
  qtyInput.addEventListener('input', calculateInwardTotal);
  priceInput.addEventListener('input', calculateInwardTotal);

  // Inward Item Unit label change
  document.getElementById('inwardItem').addEventListener('change', (e) => {
    const selected = e.target.options[e.target.selectedIndex];
    const unit = selected ? selected.getAttribute('data-unit') : 'unit';
    document.getElementById('inwardUnitLabel').textContent = unit || 'unit';
  });

  // Form Submissions
  document.getElementById('stockInwardForm').addEventListener('submit', handleStockInwardSubmit);
  document.getElementById('quickRestockForm').addEventListener('submit', handleQuickRestockSubmit);
  document.getElementById('mealLogForm').addEventListener('submit', handleMealLogSubmit);

  // Initial Full Render
  renderDashboard();
  renderInventory();
  renderStockInward();
  renderMeals();
  renderReplenishment();
});
