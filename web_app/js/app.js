/**
 * ENX MONEY - Complete Application Logic & Interactive Controller
 */

const App = {
  currentView: 'dashboard',
  activePeriod: '30 Days',
  mode: 'business', // 'business' | 'personal'
  theme: 'dark',
  sidebarCollapsed: false,

  // Menu configurations for Business & Personal modes
  menus: {
    business: [
      { id: 'dashboard', label: 'Dashboard Hub', icon: 'ph-squares-four', badge: null },
      { id: 'invoices', label: 'GST Invoices', icon: 'ph-receipt', badge: null },
      { id: 'inventory', label: 'Inventory & Stock', icon: 'ph-package', badge: '4' },
      { id: 'customers', label: 'Customers & Khata', icon: 'ph-users', badge: null },
      { id: 'transactions', label: 'Transactions & Daybook', icon: 'ph-arrows-left-right', badge: null },
      { id: 'loans', label: 'Loans & EMI Tracker', icon: 'ph-bank', badge: null },
      { id: 'banking', label: 'Business Banking', icon: 'ph-credit-card', badge: null },
      { id: 'analytics', label: 'Analytics & GSTR Tax', icon: 'ph-chart-line-up', badge: 'PRO' },
      { id: 'settings', label: 'Settings & Security', icon: 'ph-gear-six', badge: null }
    ],
    personal: [
      { id: 'dashboard', label: 'Personal Dashboard', icon: 'ph-wallet', badge: null },
      { id: 'personal_budget', label: 'Monthly Budgets', icon: 'ph-chart-pie-slice', badge: null },
      { id: 'personal_goals', label: 'Financial Goals & SIP', icon: 'ph-target', badge: null },
      { id: 'transactions', label: 'Personal Expenses', icon: 'ph-shopping-bag', badge: null },
      { id: 'personal_calendar', label: 'Financial Calendar', icon: 'ph-calendar-check', badge: null },
      { id: 'loans', label: 'Personal Loans & EMI', icon: 'ph-bank', badge: null },
      { id: 'banking', label: 'Bank & Demat Accounts', icon: 'ph-credit-card', badge: null },
      { id: 'settings', label: 'Profile & Security', icon: 'ph-user-gear', badge: null }
    ]
  },

  init() {
    this.mode = DataStore.getMode();
    this.theme = DataStore.getTheme();
    this.applyTheme(this.theme);
    this.renderSidebarMenu();
    this.bindEvents();
    this.navigate(this.currentView);
    this.updateTopbarHeader();
  },

  bindEvents() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleSidebar());
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('mobile-open');
      });
    }
  },

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.getElementById('main-wrapper');
    const toggleIcon = document.querySelector('#sidebar-toggle i');
    
    if (this.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      mainWrapper.classList.add('expanded');
      toggleIcon.className = 'ph ph-caret-right';
    } else {
      sidebar.classList.remove('collapsed');
      mainWrapper.classList.remove('expanded');
      toggleIcon.className = 'ph ph-caret-left';
    }
  },

  switchMode(newMode) {
    this.mode = newMode;
    DataStore.setMode(newMode);
    
    document.getElementById('mode-btn-business').classList.toggle('active', newMode === 'business');
    document.getElementById('mode-btn-personal').classList.toggle('active', newMode === 'personal');
    
    this.renderSidebarMenu();
    this.updateTopbarHeader();
    this.navigate('dashboard');
    this.showToast(`Switched to ${newMode === 'business' ? 'Business Pro Mode' : 'Personal Wealth Mode'}`, 'info');
  },

  updateTopbarHeader() {
    const badge = document.getElementById('topbar-mode-badge');
    const subText = document.getElementById('topbar-subtitle-text');
    const nameLabel = document.getElementById('user-name-label');
    const roleLabel = document.getElementById('user-role-label');
    const settings = DataStore.getSettings();

    if (this.mode === 'business') {
      badge.textContent = 'BUSINESS PRO';
      badge.style.background = 'rgba(0, 102, 204, 0.15)';
      badge.style.color = 'var(--primary-light)';
      subText.textContent = `${settings.business.companyName} • Live Financial Hub`;
      nameLabel.textContent = settings.user.fullName;
      roleLabel.textContent = settings.business.companyName;
    } else {
      badge.textContent = 'PERSONAL WEALTH';
      badge.style.background = 'rgba(16, 185, 129, 0.15)';
      badge.style.color = 'var(--success)';
      subText.textContent = `Personal Wealth & Household Expenses`;
      nameLabel.textContent = settings.user.fullName;
      roleLabel.textContent = 'Private Portfolio';
    }
  },

  renderSidebarMenu() {
    const nav = document.getElementById('nav-menu');
    const items = this.menus[this.mode];
    
    let html = `<div class="nav-section-label">${this.mode === 'business' ? 'Enterprise Suite' : 'Personal Finance'}</div>`;
    
    items.forEach(item => {
      const isActive = item.id === this.currentView;
      html += `
        <a class="nav-item ${isActive ? 'active' : ''}" onclick="App.navigate('${item.id}')">
          <i class="ph ${item.icon}"></i>
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge ${item.badge === '4' ? 'warning' : ''}">${item.badge}</span>` : ''}
        </a>
      `;
    });

    nav.innerHTML = html;
  },

  navigate(viewId) {
    this.currentView = viewId;
    this.renderSidebarMenu();

    // Close mobile sidebar if open
    document.getElementById('sidebar').classList.remove('mobile-open');

    const appView = document.getElementById('app-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (viewId) {
      case 'dashboard':
        appView.innerHTML = this.mode === 'business' ? this.renderBusinessDashboard() : this.renderPersonalDashboard();
        break;
      case 'invoices':
        appView.innerHTML = this.renderInvoicesView();
        break;
      case 'inventory':
        appView.innerHTML = this.renderInventoryView();
        break;
      case 'customers':
        appView.innerHTML = this.renderCustomersView();
        break;
      case 'transactions':
        appView.innerHTML = this.renderTransactionsView();
        break;
      case 'loans':
        appView.innerHTML = this.renderLoansView();
        break;
      case 'banking':
        appView.innerHTML = this.renderBankingView();
        break;
      case 'analytics':
        appView.innerHTML = this.renderAnalyticsView();
        break;
      case 'personal_budget':
        appView.innerHTML = this.renderPersonalBudgetView();
        break;
      case 'personal_goals':
        appView.innerHTML = this.renderPersonalGoalsView();
        break;
      case 'personal_calendar':
        appView.innerHTML = this.renderPersonalCalendarView();
        break;
      case 'settings':
        appView.innerHTML = this.renderSettingsView();
        break;
      default:
        appView.innerHTML = this.renderBusinessDashboard();
    }
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme);
    DataStore.setTheme(this.theme);
    this.showToast(`Theme switched to ${this.theme.toUpperCase()} mode`, 'info');
  },

  applyTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = themeName === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    }
  },

  changeLanguage(langCode) {
    DataStore.setLanguage(langCode);
    const langNames = {
      en: 'English', hi: 'हिन्दी (Hindi)', mr: 'मराठी (Marathi)',
      gu: 'ગુજરાતી (Gujarati)', ta: 'தமிழ் (Tamil)', te: 'తెలుగు (Telugu)',
      kn: 'ಕನ್ನಡ (Kannada)', bn: 'বাংলা (Bengali)'
    };
    this.showToast(`Language switched to ${langNames[langCode] || langCode}`, 'success');
  },

  showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'ph-info';
    if (type === 'success') iconClass = 'ph-check-circle';
    if (type === 'error') iconClass = 'ph-warning-circle';

    toast.innerHTML = `<i class="ph ${iconClass}"></i><span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  },

  showNotifications() {
    this.openModal('Notifications Center', `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; align-items:start; gap:12px; padding:12px; background:var(--input-bg); border-radius:8px; border-left:4px solid var(--primary-light);">
          <i class="ph ph-bell-ringing" style="font-size:20px; color:var(--primary-light);"></i>
          <div>
            <div style="font-weight:700; font-size:13px;">GSTR-1 Monthly Return Filing Due</div>
            <div style="font-size:12px; color:var(--text-muted);">Filing due date is on 11th of next month for July sales.</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">10 mins ago</div>
          </div>
        </div>
        <div style="display:flex; align-items:start; gap:12px; padding:12px; background:var(--input-bg); border-radius:8px; border-left:4px solid var(--warning);">
          <i class="ph ph-warning" style="font-size:20px; color:var(--warning);"></i>
          <div>
            <div style="font-weight:700; font-size:13px;">Low Stock Alert: Toroidal Transformer</div>
            <div style="font-size:12px; color:var(--text-muted);">Only 3 units remaining in warehouse (Min threshold: 5).</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">2 hours ago</div>
          </div>
        </div>
        <div style="display:flex; align-items:start; gap:12px; padding:12px; background:var(--input-bg); border-radius:8px; border-left:4px solid var(--success);">
          <i class="ph ph-check-circle" style="font-size:20px; color:var(--success);"></i>
          <div>
            <div style="font-weight:700; font-size:13px;">Payment Received from Sharma Hardware</div>
            <div style="font-size:12px; color:var(--text-muted);">₹34,500 credited via UPI to HDFC Current Account.</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Today, 11:45 AM</div>
          </div>
        </div>
      </div>
    `);
  },

  handleGlobalSearch(query) {
    if (!query || query.trim() === '') return;
    const q = query.toLowerCase();
    
    // Check match across invoices, customers, products
    const invoices = DataStore.getInvoices().filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
    const customers = DataStore.getCustomers().filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    const products = DataStore.getProducts().filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));

    if (invoices.length > 0 && this.currentView !== 'invoices') {
      this.navigate('invoices');
    } else if (customers.length > 0 && this.currentView !== 'customers') {
      this.navigate('customers');
    } else if (products.length > 0 && this.currentView !== 'inventory') {
      this.navigate('inventory');
    }
  },

  /* ==========================================================================
     VIEWS RENDERING
     ========================================================================== */

  // 1. BUSINESS DASHBOARD
  renderBusinessDashboard() {
    const invoices = DataStore.getInvoices();
    const transactions = DataStore.getTransactions().filter(t => t.scope === 'business');
    const products = DataStore.getProducts();
    const customers = DataStore.getCustomers();

    const totalBalance = 1845620;
    const totalCredit = 864200;
    const totalDebit = 342150;
    const monthlyProfit = 306650;
    const receivables = customers.reduce((acc, c) => acc + (c.currentBalance > 0 ? c.currentBalance : 0), 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minStockLevel).length;

    return `
      <!-- Page Header with Period Selector -->
      <div class="page-header">
        <div class="page-title-group">
          <h1>Enterprise Dashboard</h1>
          <p>Real-time cashflow, GST sales velocity, inventory health & receivables</p>
        </div>
        <div class="page-actions">
          <div class="segmented-tabs">
            <button class="tab-btn ${this.activePeriod === '7 Days' ? 'active' : ''}" onclick="App.setPeriod('7 Days')">7D</button>
            <button class="tab-btn ${this.activePeriod === '30 Days' ? 'active' : ''}" onclick="App.setPeriod('30 Days')">30D</button>
            <button class="tab-btn ${this.activePeriod === '90 Days' ? 'active' : ''}" onclick="App.setPeriod('90 Days')">90D</button>
            <button class="tab-btn ${this.activePeriod === 'This Year' ? 'active' : ''}" onclick="App.setPeriod('This Year')">FY24-25</button>
          </div>
          <button class="btn-secondary" onclick="App.exportGSTRReport()">
            <i class="ph ph-download-simple"></i>
            <span>Export GSTR</span>
          </button>
        </div>
      </div>

      <!-- Quick Action Shortcuts -->
      <div class="quick-actions-bar">
        <div class="quick-action-card" onclick="App.openCreateInvoiceModal()">
          <div class="qa-icon-wrap"><i class="ph ph-receipt"></i></div>
          <span>New GST Invoice</span>
        </div>
        <div class="quick-action-card" onclick="App.openAddTransactionModal('debit')">
          <div class="qa-icon-wrap"><i class="ph ph-minus-circle" style="color:var(--debit);"></i></div>
          <span>Record Expense</span>
        </div>
        <div class="quick-action-card" onclick="App.openAddCustomerModal()">
          <div class="qa-icon-wrap"><i class="ph ph-user-plus"></i></div>
          <span>Add Customer</span>
        </div>
        <div class="quick-action-card" onclick="App.openStockAdjustModal()">
          <div class="qa-icon-wrap"><i class="ph ph-package"></i></div>
          <span>Stock In/Out</span>
        </div>
        <div class="quick-action-card" onclick="App.openFundTransferModal()">
          <div class="qa-icon-wrap"><i class="ph ph-paper-plane-tilt"></i></div>
          <span>Fast Transfer</span>
        </div>
        <div class="quick-action-card" onclick="App.openPaymentCollectModal()">
          <div class="qa-icon-wrap"><i class="ph ph-qr-code" style="color:var(--success);"></i></div>
          <span>Collect via UPI</span>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card hero-kpi">
          <div class="kpi-top">
            <span class="kpi-label">Operating Liquidity</span>
            <div class="kpi-icon-pill primary" style="background:rgba(255,255,255,0.15); color:#fff;"><i class="ph ph-shield-check"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalBalance)}</div>
          <div class="kpi-footer">
            <span class="kpi-trend up" style="background:rgba(16,185,129,0.25); color:#34D399;"><i class="ph ph-trend-up"></i> +14.8%</span>
            <span>vs previous month</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Inflow / Credit</span>
            <div class="kpi-icon-pill credit"><i class="ph ph-arrow-down-left"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalCredit)}</div>
          <div class="kpi-footer">
            <span class="kpi-trend up"><i class="ph ph-trend-up"></i> +18.2%</span>
            <span>Sales & collections</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Outflow / Debit</span>
            <div class="kpi-icon-pill debit"><i class="ph ph-arrow-up-right"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalDebit)}</div>
          <div class="kpi-footer">
            <span class="kpi-trend down"><i class="ph ph-trend-down"></i> -4.1%</span>
            <span>Expenses & procurement</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Market Receivables</span>
            <div class="kpi-icon-pill gold"><i class="ph ph-coins"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--warning);">${formatINR(receivables)}</div>
          <div class="kpi-footer">
            <span style="color:var(--warning); font-weight:700;"><i class="ph ph-warning-circle"></i> 4 Clients</span>
            <span>Outstanding khata</span>
          </div>
        </div>
      </div>

      <!-- Interactive Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <div class="chart-title">Revenue Trends & Cash Velocity</div>
              <div class="chart-subtitle">Monthly Inflow (Electric Blue) vs Operating Outflow (Slate)</div>
            </div>
            <span class="badge success"><i class="ph ph-pulse"></i> Live Flow</span>
          </div>
          <div class="svg-chart-container">
            ${this.renderRevenueChartSVG()}
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <div>
              <div class="chart-title">Expense Allocation</div>
              <div class="chart-subtitle">Breakdown by Cost Center</div>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:12.5px;">
              <span style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:50%; background:#0066CC;"></span> Inventory Purchase</span>
              <span style="font-weight:700; font-family:var(--font-mono);">₹1,28,400 (42%)</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:12.5px;">
              <span style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:50%; background:#051937;"></span> Logistics & Freight</span>
              <span style="font-weight:700; font-family:var(--font-mono);">₹48,200 (22%)</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:12.5px;">
              <span style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:50%; background:#F59E0B;"></span> Staff & Payroll</span>
              <span style="font-weight:700; font-family:var(--font-mono);">₹55,000 (18%)</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:12.5px;">
              <span style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:50%; background:#8B5CF6;"></span> Utilities & Rent</span>
              <span style="font-weight:700; font-family:var(--font-mono);">₹32,000 (11%)</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:12.5px;">
              <span style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:50%; background:#EF4444;"></span> Marketing & Misc</span>
              <span style="font-weight:700; font-family:var(--font-mono);">₹22,000 (7%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table -->
      <div class="data-card">
        <div class="data-card-header">
          <div>
            <h3 style="font-size:15px; font-weight:700;">Recent Financial Activity</h3>
            <p style="font-size:12px; color:var(--text-muted);">Verified double-entry cash and bank ledger transactions</p>
          </div>
          <button class="btn-secondary" onclick="App.navigate('transactions')">
            <span>View Daybook</span>
            <i class="ph ph-arrow-right"></i>
          </button>
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Transaction Details</th>
                <th>Category</th>
                <th>Payment Mode</th>
                <th>Timestamp</th>
                <th style="text-align:right;">Amount</th>
                <th style="text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.slice(0, 5).map(t => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                      <div class="kpi-icon-pill ${t.type === 'credit' ? 'credit' : 'debit'}" style="width:34px; height:34px; font-size:16px;">
                        <i class="ph ${t.type === 'credit' ? 'ph-arrow-down-left' : 'ph-arrow-up-right'}"></i>
                      </div>
                      <div>
                        <div style="font-weight:700; color:var(--text-primary);">${t.title}</div>
                        <div style="font-size:11.5px; color:var(--text-muted);">${t.partyName || 'Direct Counter'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge neutral">${t.category}</span></td>
                  <td><span style="font-weight:600; font-size:12px;"><i class="ph ph-bank"></i> ${t.paymentMethod}</span></td>
                  <td><span style="color:var(--text-muted); font-size:12px;">${formatDate(t.date)} ${formatTime(t.date)}</span></td>
                  <td style="text-align:right;">
                    <span class="${t.type === 'credit' ? 'amount-credit' : 'amount-debit'}">
                      ${t.type === 'credit' ? '+' : '-'}${formatINR(t.amount)}
                    </span>
                  </td>
                  <td style="text-align:center;">
                    <button class="table-btn" title="View Transaction" onclick="App.viewTransactionDetails('${t.id}')">
                      <i class="ph ph-eye"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 2. PERSONAL DASHBOARD
  renderPersonalDashboard() {
    const budgets = DataStore.getBudgets();
    const goals = DataStore.getGoals();
    const transactions = DataStore.getTransactions().filter(t => t.scope === 'personal');
    
    const netWorth = 485320;
    const salaryIncome = 125000;
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0);
    const monthlySavings = salaryIncome - totalSpent;

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Personal Wealth & Budget Hub</h1>
          <p>Manage family budgets, monthly savings, goal SIPs and household spending</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="App.openAddGoalModal()">
            <i class="ph ph-plus-circle"></i>
            <span>New Financial Goal</span>
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card hero-kpi">
          <div class="kpi-top">
            <span class="kpi-label">Liquid Savings & Investments</span>
            <div class="kpi-icon-pill primary" style="background:rgba(255,255,255,0.15); color:#fff;"><i class="ph ph-wallet"></i></div>
          </div>
          <div class="kpi-val">${formatINR(netWorth)}</div>
          <div class="kpi-footer">
            <span class="kpi-trend up" style="background:rgba(16,185,129,0.25); color:#34D399;"><i class="ph ph-trend-up"></i> +8.4%</span>
            <span>Net worth growth</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Monthly Salary Income</span>
            <div class="kpi-icon-pill credit"><i class="ph ph-money"></i></div>
          </div>
          <div class="kpi-val">${formatINR(salaryIncome)}</div>
          <div class="kpi-footer">
            <span class="badge success">Credited on 29th</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Monthly Expenses</span>
            <div class="kpi-icon-pill debit"><i class="ph ph-credit-card"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalSpent)}</div>
          <div class="kpi-footer">
            <span>Budget Limit: ${formatINR(totalBudget)}</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Net Monthly Savings</span>
            <div class="kpi-icon-pill gold"><i class="ph ph-piggy-bank"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--success);">${formatINR(monthlySavings)}</div>
          <div class="kpi-footer">
            <span class="kpi-trend up"><i class="ph ph-check"></i> 65.7%</span>
            <span>Savings rate</span>
          </div>
        </div>
      </div>

      <!-- Budget Progress Cards -->
      <div class="data-card">
        <div class="data-card-header">
          <div>
            <h3 style="font-size:15px; font-weight:700;">Monthly Budget Categories</h3>
            <p style="font-size:12px; color:var(--text-muted);">Real-time spend tracking vs monthly budget caps</p>
          </div>
          <button class="btn-secondary" onclick="App.navigate('personal_budget')">
            <span>Manage All Budgets</span>
            <i class="ph ph-arrow-right"></i>
          </button>
        </div>
        <div style="padding:20px; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
          ${budgets.map(b => {
            const pct = Math.min(100, Math.round((b.spent / b.budget) * 100));
            const isOver = b.spent > b.budget;
            return `
              <div style="background:var(--input-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:34px; height:34px; border-radius:8px; background:rgba(0,102,204,0.15); color:var(--primary-light); display:flex; align-items:center; justify-content:center; font-size:18px;">
                      <i class="ph ${b.icon}"></i>
                    </div>
                    <div style="font-weight:700; font-size:13px;">${b.name}</div>
                  </div>
                  <span class="badge ${isOver ? 'danger' : 'success'}">${pct}%</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                  <span style="color:var(--text-muted);">Spent: <b style="color:var(--text-primary);">${formatINR(b.spent)}</b></span>
                  <span style="color:var(--text-muted);">Budget: <b>${formatINR(b.budget)}</b></span>
                </div>
                <div style="width:100%; height:7px; background:var(--border-color); border-radius:10px; overflow:hidden;">
                  <div style="width:${pct}%; height:100%; background:${isOver ? 'var(--error)' : 'linear-gradient(90deg, var(--primary), var(--primary-light))'}; border-radius:10px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Financial Goals & SIP Tracker -->
      <div class="data-card">
        <div class="data-card-header">
          <div>
            <h3 style="font-size:15px; font-weight:700;">Financial Goals & Wealth Targets</h3>
            <p style="font-size:12px; color:var(--text-muted);">Track your SIP contributions and goal milestones</p>
          </div>
          <button class="btn-primary" onclick="App.openAddGoalModal()">
            <i class="ph ph-plus"></i>
            <span>Add Target</span>
          </button>
        </div>
        <div style="padding:20px; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
          ${goals.map(g => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return `
              <div style="background:var(--input-bg); border:1px solid var(--border-color); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div style="width:38px; height:38px; border-radius:10px; background:${g.color}22; color:${g.color}; display:flex; align-items:center; justify-content:center; font-size:20px;">
                        <i class="ph ${g.icon}"></i>
                      </div>
                      <div>
                        <div style="font-weight:800; font-size:14px;">${g.title}</div>
                        <div style="font-size:11px; color:var(--text-muted);">${g.category} • Due ${formatDate(g.deadline)}</div>
                      </div>
                    </div>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
                    <div style="font-size:20px; font-weight:800; font-family:var(--font-heading); color:${g.color};">${formatINR(g.currentAmount)}</div>
                    <div style="font-size:12px; color:var(--text-muted);">Target: ${formatINR(g.targetAmount)}</div>
                  </div>
                  <div style="width:100%; height:8px; background:var(--border-color); border-radius:10px; overflow:hidden; margin-bottom:12px;">
                    <div style="width:${pct}%; height:100%; background:${g.color}; border-radius:10px;"></div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:12px; font-size:12px;">
                  <span>Monthly SIP: <b>${formatINR(g.monthlySip)}</b></span>
                  <button class="btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="App.openAddFundsToGoalModal('${g.id}')">
                    <i class="ph ph-plus"></i> Add Funds
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // 3. GST INVOICES VIEW
  renderInvoicesView() {
    const invoices = DataStore.getInvoices();
    const totalBilled = invoices.reduce((acc, i) => acc + this.calculateInvoiceTotal(i), 0);
    const paidAmount = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + this.calculateInvoiceTotal(i), 0);
    const pendingAmount = invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + this.calculateInvoiceTotal(i), 0);

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>GST Invoices & Billing</h1>
          <p>Create compliant GST tax invoices, bill of supply, track status and download print-ready PDFs</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="App.openCreateInvoiceModal()">
            <i class="ph ph-plus-circle"></i>
            <span>Create New Invoice</span>
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Invoiced Volume</span>
            <div class="kpi-icon-pill primary"><i class="ph ph-receipt"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalBilled)}</div>
          <div class="kpi-footer"><span>${invoices.length} Total Invoices</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Realized / Paid</span>
            <div class="kpi-icon-pill credit"><i class="ph ph-check-circle"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--success);">${formatINR(paidAmount)}</div>
          <div class="kpi-footer"><span>Bank settlements complete</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Pending / Overdue</span>
            <div class="kpi-icon-pill debit"><i class="ph ph-clock-countdown"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--warning);">${formatINR(pendingAmount)}</div>
          <div class="kpi-footer"><span>Pending payment reconciliation</span></div>
        </div>
      </div>

      <div class="data-card">
        <div class="data-card-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <h3 style="font-size:15px; font-weight:700;">Invoices List</h3>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <input type="text" class="form-control" placeholder="Search invoice or customer..." oninput="App.filterInvoicesTable(this.value)" style="width:220px; padding:6px 12px; font-size:12px;">
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="invoices-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer / Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style="text-align:right;">Grand Total</th>
                <th style="text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => {
                const total = this.calculateInvoiceTotal(inv);
                return `
                  <tr>
                    <td>
                      <div style="font-weight:800; font-family:var(--font-mono); color:var(--primary-light);">${inv.invoiceNumber}</div>
                      <div style="font-size:11px; color:var(--text-muted);">${inv.type === 'tax_invoice' ? 'B2B Tax Invoice' : 'Bill of Supply'}</div>
                    </td>
                    <td>
                      <div style="font-weight:700;">${inv.customerName}</div>
                      <div style="font-size:11.5px; color:var(--text-muted);">${inv.customerGstin || inv.customerPhone}</div>
                    </td>
                    <td><span style="font-size:12px;">${formatDate(inv.invoiceDate)}</span></td>
                    <td><span style="font-size:12px;">${formatDate(inv.dueDate)}</span></td>
                    <td><span class="badge ${inv.status}">${inv.status.toUpperCase()}</span></td>
                    <td style="text-align:right;">
                      <div style="font-weight:800; font-family:var(--font-mono); font-size:14px;">${formatINR(total)}</div>
                      <div style="font-size:11px; color:var(--text-muted);">${inv.items.length} items</div>
                    </td>
                    <td style="text-align:center;">
                      <div class="table-actions" style="justify-content:center;">
                        <button class="table-btn" title="View & Print Invoice" onclick="App.openInvoicePreviewModal('${inv.id}')">
                          <i class="ph ph-printer"></i>
                        </button>
                        ${inv.status !== 'paid' ? `
                          <button class="table-btn" title="Mark as Paid" onclick="App.markInvoicePaid('${inv.id}')">
                            <i class="ph ph-check" style="color:var(--success);"></i>
                          </button>
                        ` : ''}
                        <button class="table-btn delete" title="Delete Invoice" onclick="App.deleteInvoice('${inv.id}')">
                          <i class="ph ph-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 4. INVENTORY & STOCK
  renderInventoryView() {
    const products = DataStore.getProducts();
    const totalValuation = products.reduce((acc, p) => acc + (p.purchasePrice * p.quantity), 0);
    const totalSalesValuation = products.reduce((acc, p) => acc + (p.sellingPrice * p.quantity), 0);

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Inventory & Warehouse Management</h1>
          <p>Product catalog, stock replenishment, barcode management and inventory valuation</p>
        </div>
        <div class="page-actions">
          <button class="btn-secondary" onclick="App.openBarcodeScannerModal()">
            <i class="ph ph-barcode"></i>
            <span>Scan Barcode</span>
          </button>
          <button class="btn-primary" onclick="App.openAddProductModal()">
            <i class="ph ph-plus-circle"></i>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Stock Asset Valuation</span>
            <div class="kpi-icon-pill primary"><i class="ph ph-package"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalValuation)}</div>
          <div class="kpi-footer"><span>Purchase cost valuation</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Retail / Selling Valuation</span>
            <div class="kpi-icon-pill credit"><i class="ph ph-tag"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--primary-light);">${formatINR(totalSalesValuation)}</div>
          <div class="kpi-footer"><span>Expected realization</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Low Stock Alerts</span>
            <div class="kpi-icon-pill gold"><i class="ph ph-warning"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--warning);">2 Items</div>
          <div class="kpi-footer"><span style="color:var(--warning);">Requires purchase reorder</span></div>
        </div>
      </div>

      <div class="data-card">
        <div class="data-card-header">
          <h3 style="font-size:15px; font-weight:700;">Stock Master & Product Directory</h3>
          <div style="display:flex; gap:10px;">
            <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="App.openStockAdjustModal()">
              <i class="ph ph-arrows-clockwise"></i> Adjust Stock
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Product / SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Margin</th>
                <th style="text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const isLow = p.quantity <= p.minStockLevel;
                const marginPct = Math.round(((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100);
                return `
                  <tr>
                    <td>
                      <div style="font-weight:700;">${p.name}</div>
                      <div style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-muted);">${p.sku} • Barcode: ${p.barcode}</div>
                    </td>
                    <td><span class="badge neutral">${p.category}</span></td>
                    <td>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-weight:800; font-size:14px;">${p.quantity} ${p.unit}</span>
                        <span class="badge ${isLow ? 'low_stock' : 'in_stock'}">${isLow ? 'LOW STOCK' : 'IN STOCK'}</span>
                      </div>
                    </td>
                    <td style="font-family:var(--font-mono); font-weight:600;">${formatINR(p.purchasePrice)}</td>
                    <td style="font-family:var(--font-mono); font-weight:700; color:var(--primary-light);">${formatINR(p.sellingPrice)}</td>
                    <td><span class="badge success">+${marginPct}%</span></td>
                    <td style="text-align:center;">
                      <div class="table-actions" style="justify-content:center;">
                        <button class="table-btn" title="Edit Product" onclick="App.openEditProductModal('${p.id}')">
                          <i class="ph ph-pencil-simple"></i>
                        </button>
                        <button class="table-btn delete" title="Delete" onclick="App.deleteProduct('${p.id}')">
                          <i class="ph ph-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 5. CUSTOMERS & KHATA LEDGER
  renderCustomersView() {
    const customers = DataStore.getCustomers();
    const totalReceivable = customers.reduce((acc, c) => acc + (c.currentBalance > 0 ? c.currentBalance : 0), 0);

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Customers & Khata Ledger</h1>
          <p>Track market dues, customer credit limits, payment reminders via WhatsApp, and ledger statements</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="App.openAddCustomerModal()">
            <i class="ph ph-user-plus"></i>
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card hero-kpi">
          <div class="kpi-top">
            <span class="kpi-label">Market Dues (You will Get)</span>
            <div class="kpi-icon-pill primary" style="background:rgba(255,255,255,0.15); color:#fff;"><i class="ph ph-coins"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalReceivable)}</div>
          <div class="kpi-footer"><span>Outstanding across ${customers.length} business accounts</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Active Customer Accounts</span>
            <div class="kpi-icon-pill credit"><i class="ph ph-users-three"></i></div>
          </div>
          <div class="kpi-val">${customers.length}</div>
          <div class="kpi-footer"><span>100% KYC Verified GSTIN</span></div>
        </div>
      </div>

      <div class="data-card">
        <div class="data-card-header">
          <h3 style="font-size:15px; font-weight:700;">Customer Khata Accounts</h3>
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Customer / Business Name</th>
                <th>Contact & GSTIN</th>
                <th>Credit Limit</th>
                <th>Total Purchases</th>
                <th style="text-align:right;">Current Due</th>
                <th style="text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td>
                    <div style="font-weight:800; font-size:13.5px;">${c.name}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${c.address}</div>
                  </td>
                  <td>
                    <div style="font-weight:600;"><i class="ph ph-phone"></i> ${c.phone}</div>
                    <div style="font-size:11.5px; font-family:var(--font-mono); color:var(--text-muted);">${c.gstin || 'Unregistered'}</div>
                  </td>
                  <td><span style="font-weight:600; font-family:var(--font-mono);">${formatINR(c.creditLimit)}</span></td>
                  <td style="font-family:var(--font-mono); font-weight:600;">${formatINR(c.totalPurchases)}</td>
                  <td style="text-align:right;">
                    <div style="font-weight:800; font-size:15px; font-family:var(--font-mono); color:${c.currentBalance > 0 ? 'var(--debit)' : 'var(--success)'};">
                      ${formatINR(c.currentBalance)}
                    </div>
                    <div style="font-size:10.5px; color:var(--text-muted);">${c.currentBalance > 0 ? "You'll Get" : 'Settled'}</div>
                  </td>
                  <td style="text-align:center;">
                    <div class="table-actions" style="justify-content:center;">
                      <button class="table-btn" title="View Khata Ledger" onclick="App.openKhataLedgerModal('${c.id}')">
                        <i class="ph ph-book-open"></i>
                      </button>
                      <button class="table-btn" title="Send WhatsApp Reminder" onclick="App.openWhatsAppReminderModal('${c.id}')">
                        <i class="ph ph-whatsapp-logo" style="color:#25D366;"></i>
                      </button>
                      <button class="table-btn" title="Collect Payment" onclick="App.openPaymentCollectModal('${c.id}')">
                        <i class="ph ph-qr-code" style="color:var(--success);"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 6. TRANSACTIONS & DAYBOOK
  renderTransactionsView() {
    const transactions = DataStore.getTransactions();

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Transactions & Daily Cashbook</h1>
          <p>Complete audit ledger of all credits, debits, operating expenses and transfers</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="App.openAddTransactionModal('credit')">
            <i class="ph ph-plus-circle"></i>
            <span>Add Income</span>
          </button>
          <button class="btn-secondary" onclick="App.openAddTransactionModal('debit')">
            <i class="ph ph-minus-circle" style="color:var(--debit);"></i>
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <div class="data-card">
        <div class="data-card-header">
          <h3 style="font-size:15px; font-weight:700;">Financial Daybook</h3>
          <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="App.exportTransactionsCSV()">
            <i class="ph ph-file-csv"></i> Export CSV
          </button>
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Transaction Title</th>
                <th>Party / Vendor</th>
                <th>Category</th>
                <th>Payment Mode</th>
                <th>Date & Time</th>
                <th style="text-align:right;">Amount</th>
                <th style="text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="kpi-icon-pill ${t.type === 'credit' ? 'credit' : 'debit'}" style="width:32px; height:32px; font-size:15px;">
                        <i class="ph ${t.type === 'credit' ? 'ph-arrow-down-left' : 'ph-arrow-up-right'}"></i>
                      </div>
                      <div style="font-weight:700;">${t.title}</div>
                    </div>
                  </td>
                  <td><span style="font-weight:600;">${t.partyName || '—'}</span></td>
                  <td><span class="badge neutral">${t.category}</span></td>
                  <td><span style="font-weight:600; font-size:12px;">${t.paymentMethod}</span></td>
                  <td><span style="color:var(--text-muted); font-size:12px;">${formatDate(t.date)}</span></td>
                  <td style="text-align:right;">
                    <span class="${t.type === 'credit' ? 'amount-credit' : 'amount-debit'}">
                      ${t.type === 'credit' ? '+' : '-'}${formatINR(t.amount)}
                    </span>
                  </td>
                  <td style="text-align:center;">
                    <button class="table-btn delete" title="Delete" onclick="App.deleteTransaction('${t.id}')">
                      <i class="ph ph-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 7. LOANS & EMI TRACKER
  renderLoansView() {
    const loans = DataStore.getLoans();
    const totalPrincipal = loans.reduce((acc, l) => acc + l.principalAmount, 0);
    const totalRemaining = loans.reduce((acc, l) => acc + l.remainingPrincipal, 0);
    const totalMonthlyEmi = loans.reduce((acc, l) => acc + l.monthlyEmi, 0);

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Loans & EMI Tracker</h1>
          <p>Track business loans, vehicle finance, amortization schedules, and calculate foreclosure savings</p>
        </div>
        <div class="page-actions">
          <button class="btn-secondary" onclick="App.openForeclosureCalcModal()">
            <i class="ph ph-calculator"></i>
            <span>Foreclosure Calculator</span>
          </button>
          <button class="btn-primary" onclick="App.openAddLoanModal()">
            <i class="ph ph-plus-circle"></i>
            <span>Add New Loan</span>
          </button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card hero-kpi">
          <div class="kpi-top">
            <span class="kpi-label">Outstanding Loan Principal</span>
            <div class="kpi-icon-pill primary" style="background:rgba(255,255,255,0.15); color:#fff;"><i class="ph ph-bank"></i></div>
          </div>
          <div class="kpi-val">${formatINR(totalRemaining)}</div>
          <div class="kpi-footer"><span>Total Sanctioned: ${formatINR(totalPrincipal)}</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Total Monthly EMI Outflow</span>
            <div class="kpi-icon-pill debit"><i class="ph ph-calendar-blank"></i></div>
          </div>
          <div class="kpi-val" style="color:var(--debit);">${formatINR(totalMonthlyEmi)}</div>
          <div class="kpi-footer"><span>Next deduction due in 6 days</span></div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:20px;">
        ${loans.map(loan => {
          const paidPct = Math.round((loan.paidAmount / loan.principalAmount) * 100);
          return `
            <div class="kpi-card" style="padding:24px;">
              <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:14px;">
                <div>
                  <span class="badge neutral" style="margin-bottom:6px;">${loan.type}</span>
                  <h3 style="font-size:16px; font-weight:800;">${loan.loanName}</h3>
                  <div style="font-size:11.5px; color:var(--text-muted);">${loan.lenderBank} • Acc: ${loan.loanAccountNumber}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:18px; font-weight:800; font-family:var(--font-heading); color:var(--primary-light);">${formatINR(loan.monthlyEmi)}/mo</div>
                  <div style="font-size:11px; color:var(--text-muted);">${loan.interestRateAnnual}% p.a. • ${loan.tenureMonths} Mos</div>
                </div>
              </div>

              <div style="margin:16px 0;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                  <span style="color:var(--text-muted);">Principal Remaining: <b style="color:var(--text-primary);">${formatINR(loan.remainingPrincipal)}</b></span>
                  <span style="color:var(--text-muted);">Paid: <b>${paidPct}%</b></span>
                </div>
                <div style="width:100%; height:8px; background:var(--border-color); border-radius:10px; overflow:hidden;">
                  <div style="width:${paidPct}%; height:100%; background:linear-gradient(90deg, #0052A3, #0084FF); border-radius:10px;"></div>
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:14px; margin-top:8px;">
                <div style="font-size:12px; color:var(--text-muted);">
                  Next EMI Due: <b style="color:var(--text-primary);">${formatDate(loan.nextEmiDate)}</b>
                </div>
                <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="App.openEmiScheduleModal('${loan.id}')">
                  <i class="ph ph-list-bullets"></i> Schedule
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // 8. BANKING
  renderBankingView() {
    const accounts = DataStore.get(STORAGE_KEYS.BANK_ACCOUNTS, INITIAL_BANK_ACCOUNTS);

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Connected Bank Accounts & Cash Credit</h1>
          <p>Direct banking balances, auto-debit accounts, and instant reconciliation</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="App.openFundTransferModal()">
            <i class="ph ph-arrows-left-right"></i>
            <span>Transfer Funds</span>
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px;">
        ${accounts.map(acc => `
          <div class="kpi-card" style="padding:22px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <div>
                <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--text-muted);">${acc.bank}</div>
                <h3 style="font-size:16px; font-weight:800;">${acc.name}</h3>
              </div>
              <span class="badge neutral">${acc.type}</span>
            </div>
            <div style="font-size:24px; font-weight:800; font-family:var(--font-heading); color:var(--text-primary); margin-bottom:12px;">
              ${formatINR(acc.balance)}
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:12px;">
              <span>A/C: <b style="color:var(--text-primary);">${acc.accNumber}</b></span>
              <span>IFSC: <b style="color:var(--text-primary);">${acc.ifsc}</b></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 9. ANALYTICS & GSTR TAX
  renderAnalyticsView() {
    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Advanced Analytics & GSTR Tax Filing</h1>
          <p>GSTR-1, GSTR-3B tax exports, business profit velocity and PowerBI visualizer</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="App.exportGSTRReport()">
            <i class="ph ph-file-arrow-down"></i>
            <span>Export GSTR-1 JSON</span>
          </button>
        </div>
      </div>

      <div class="data-card" style="padding:24px; text-align:center; background:linear-gradient(135deg, rgba(0,102,204,0.08), rgba(5,25,55,0.2));">
        <i class="ph ph-chart-polar" style="font-size:48px; color:var(--primary-light); margin-bottom:12px;"></i>
        <h2 style="font-size:20px; font-weight:800;">Interactive PowerBI & Executive Analytics</h2>
        <p style="color:var(--text-muted); max-width:600px; margin:8px auto 20px;">
          Multi-dimensional cashflow simulation, customer aging distribution, GST input tax credit (ITC) reconciliation, and gross profit breakdown.
        </p>
        <div style="display:flex; justify-content:center; gap:12px;">
          <button class="btn-primary" onclick="App.showToast('GSTR-1 & 3B Monthly Export Generated Successfully!', 'success')">
            <i class="ph ph-download"></i> Download GSTR-1 Excel
          </button>
          <button class="btn-secondary" onclick="App.showToast('PowerBI Embedded Bridge Connected', 'info')">
            <i class="ph ph-arrows-clockwise"></i> Refresh BI Data
          </button>
        </div>
      </div>
    `;
  },

  // 10. SETTINGS & SECURITY
  renderSettingsView() {
    const settings = DataStore.getSettings();

    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Settings, Profile & Security</h1>
          <p>Manage company details, GSTIN configuration, user security PIN, and application preferences</p>
        </div>
      </div>

      <div class="data-card" style="padding:24px;">
        <h3 style="font-size:16px; font-weight:800; margin-bottom:18px;">Business & Tax Configuration</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Registered Company Name</label>
            <input type="text" class="form-control" id="cfg-company" value="${settings.business.companyName}">
          </div>
          <div class="form-group">
            <label class="form-label">GSTIN Identification Number</label>
            <input type="text" class="form-control" id="cfg-gstin" value="${settings.business.gstin}">
          </div>
          <div class="form-group">
            <label class="form-label">Business Phone Number</label>
            <input type="text" class="form-control" id="cfg-phone" value="${settings.business.phone}">
          </div>
          <div class="form-group">
            <label class="form-label">Official Email</label>
            <input type="text" class="form-control" id="cfg-email" value="${settings.business.email}">
          </div>
          <div class="form-group full-width">
            <label class="form-label">Registered Office Address</label>
            <input type="text" class="form-control" id="cfg-address" value="${settings.business.address}">
          </div>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn-primary" onclick="App.saveBusinessSettings()">
            <i class="ph ph-floppy-disk"></i> Save Business Profile
          </button>

          <button class="btn-outline-danger" onclick="App.resetToFactoryDefaults()">
            <i class="ph ph-arrow-counter-clockwise"></i> Reset Demo Data
          </button>
        </div>
      </div>
    `;
  },

  // Helper: Calculate total invoice amount including GST & discount
  calculateInvoiceTotal(inv) {
    if (!inv || !inv.items) return 0;
    return inv.items.reduce((acc, item) => {
      const discountedRate = item.rate * (1 - (item.discountPercent || 0) / 100);
      const taxable = discountedRate * item.quantity;
      const gst = taxable * ((item.gstRate || 0) / 100);
      return acc + (taxable + gst);
    }, 0);
  },

  setPeriod(p) {
    this.activePeriod = p;
    this.navigate('dashboard');
    this.showToast(`Showing financial data for ${p}`, 'info');
  },

  /* ==========================================================================
     MODALS & DIALOG CONTROLLERS
     ========================================================================== */

  openModal(title, bodyHtml, footerHtml = '', isLarge = false) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay active" id="active-modal-overlay">
        <div class="modal-box ${isLarge ? 'large' : ''}">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close-btn" onclick="App.closeModal()"><i class="ph ph-x"></i></button>
          </div>
          <div class="modal-body">${bodyHtml}</div>
          ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
        </div>
      </div>
    `;
  },

  closeModal() {
    const overlay = document.getElementById('active-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        const c = document.getElementById('modal-container');
        if (c) c.innerHTML = '';
      }, 250);
    }
  },

  // 1. Create GST Invoice Modal
  openCreateInvoiceModal() {
    const customers = DataStore.getCustomers();
    const products = DataStore.getProducts();

    const body = `
      <form id="create-invoice-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Invoice Number</label>
            <input type="text" class="form-control" id="inv-num" value="INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Select Customer / Client</label>
            <select class="form-control" id="inv-customer" required>
              ${customers.map(c => `<option value="${c.id}">${c.name} (${c.gstin || c.phone})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Invoice Date</label>
            <input type="date" class="form-control" id="inv-date" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Due Date (Payment Terms)</label>
            <input type="date" class="form-control" id="inv-due" value="${new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]}" required>
          </div>
        </div>

        <div style="margin-top:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <label class="form-label">Invoice Items & HSN Tax Rates</label>
            <button type="button" class="btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="App.addLineItemToInvoice()">
              <i class="ph ph-plus"></i> Add Line Item
            </button>
          </div>
          
          <div class="line-items-wrapper" id="line-items-container">
            <div class="line-item-row line-item-header">
              <span>Item / Product</span>
              <span>HSN</span>
              <span>Qty</span>
              <span>Rate (₹)</span>
              <span>GST %</span>
              <span>Total (₹)</span>
              <span></span>
            </div>
            <div class="line-item-row" id="line-row-0">
              <input type="text" class="form-control item-name" value="Premium Epoxy Primer 20L" placeholder="Product name">
              <input type="text" class="form-control item-hsn" value="3208" placeholder="HSN">
              <input type="number" class="form-control item-qty" value="10" min="1" oninput="App.recalculateInvoiceModal()">
              <input type="number" class="form-control item-rate" value="2500" min="0" oninput="App.recalculateInvoiceModal()">
              <select class="form-control item-gst" onchange="App.recalculateInvoiceModal()">
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18" selected>18%</option>
                <option value="28">28%</option>
              </select>
              <span class="item-total" style="font-family:var(--font-mono); font-weight:700;">₹29,500</span>
              <button type="button" class="table-btn delete" onclick="this.closest('.line-item-row').remove(); App.recalculateInvoiceModal();"><i class="ph ph-x"></i></button>
            </div>
          </div>
        </div>

        <div style="margin-top:20px; padding:16px; background:var(--input-bg); border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:12px; color:var(--text-muted);">Calculated Taxes (CGST + SGST)</span>
            <div style="font-size:14px; font-weight:700;" id="inv-modal-tax">₹4,500</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:12px; color:var(--text-muted);">Grand Total Amount</span>
            <div style="font-size:22px; font-weight:800; color:var(--primary-light); font-family:var(--font-heading);" id="inv-modal-total">₹29,500</div>
          </div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitCreateInvoice()">Generate & Save Invoice</button>
    `;

    this.openModal('Generate New GST Tax Invoice', body, footer, true);
  },

  addLineItemToInvoice() {
    const container = document.getElementById('line-items-container');
    const row = document.createElement('div');
    row.className = 'line-item-row';
    row.innerHTML = `
      <input type="text" class="form-control item-name" value="Industrial Fasteners" placeholder="Product name">
      <input type="text" class="form-control item-hsn" value="7318" placeholder="HSN">
      <input type="number" class="form-control item-qty" value="1" min="1" oninput="App.recalculateInvoiceModal()">
      <input type="number" class="form-control item-rate" value="1000" min="0" oninput="App.recalculateInvoiceModal()">
      <select class="form-control item-gst" onchange="App.recalculateInvoiceModal()">
        <option value="0">0%</option>
        <option value="5">5%</option>
        <option value="12">12%</option>
        <option value="18" selected>18%</option>
        <option value="28">28%</option>
      </select>
      <span class="item-total" style="font-family:var(--font-mono); font-weight:700;">₹1,180</span>
      <button type="button" class="table-btn delete" onclick="this.closest('.line-item-row').remove(); App.recalculateInvoiceModal();"><i class="ph ph-x"></i></button>
    `;
    container.appendChild(row);
    this.recalculateInvoiceModal();
  },

  recalculateInvoiceModal() {
    const rows = document.querySelectorAll('#line-items-container .line-item-row:not(.line-item-header)');
    let totalTax = 0;
    let grandTotal = 0;

    rows.forEach(r => {
      const qty = parseFloat(r.querySelector('.item-qty')?.value) || 0;
      const rate = parseFloat(r.querySelector('.item-rate')?.value) || 0;
      const gst = parseFloat(r.querySelector('.item-gst')?.value) || 0;

      const taxable = qty * rate;
      const tax = taxable * (gst / 100);
      const lineTot = taxable + tax;

      totalTax += tax;
      grandTotal += lineTot;

      const totalSpan = r.querySelector('.item-total');
      if (totalSpan) totalSpan.textContent = formatINR(lineTot);
    });

    const taxEl = document.getElementById('inv-modal-tax');
    const totEl = document.getElementById('inv-modal-total');
    if (taxEl) taxEl.textContent = formatINR(totalTax);
    if (totEl) totEl.textContent = formatINR(grandTotal);
  },

  submitCreateInvoice() {
    const num = document.getElementById('inv-num').value;
    const custId = document.getElementById('inv-customer').value;
    const cust = DataStore.getCustomers().find(c => c.id === custId);
    const date = document.getElementById('inv-date').value;
    const due = document.getElementById('inv-due').value;

    const rows = document.querySelectorAll('#line-items-container .line-item-row:not(.line-item-header)');
    const items = [];

    rows.forEach((r, idx) => {
      items.push({
        id: `item_${Date.now()}_${idx}`,
        productName: r.querySelector('.item-name')?.value || 'Custom Item',
        hsnCode: r.querySelector('.item-hsn')?.value || '9983',
        quantity: parseFloat(r.querySelector('.item-qty')?.value) || 1,
        unit: 'Pcs',
        rate: parseFloat(r.querySelector('.item-rate')?.value) || 0,
        discountPercent: 0,
        gstRate: parseFloat(r.querySelector('.item-gst')?.value) || 18
      });
    });

    const newInv = {
      id: `inv_${Date.now()}`,
      invoiceNumber: num,
      type: 'tax_invoice',
      status: 'pending',
      invoiceDate: date,
      dueDate: due,
      businessName: 'Apex Enterprises Ltd.',
      businessGstin: '27AABCU9603R1ZM',
      businessAddress: 'Plot 42, MIDC Industrial Area, Pune 411018',
      businessPhone: '+91 98201 23456',
      customerName: cust ? cust.name : 'Counter Client',
      customerId: custId,
      customerGstin: cust ? cust.gstin : '',
      customerPhone: cust ? cust.phone : '',
      customerAddress: cust ? cust.address : '',
      isInterState: false,
      items: items,
      notes: 'Standard 15 days credit terms. Interest @18% p.a. for delayed settlements.'
    };

    DataStore.saveInvoice(newInv);
    this.closeModal();
    this.navigate('invoices');
    this.showToast(`Invoice ${num} Created Successfully!`, 'success');
  },

  // 2. Invoice Preview & Print Modal
  openInvoicePreviewModal(invId) {
    const inv = DataStore.getInvoices().find(i => i.id === invId);
    if (!inv) return;

    const total = this.calculateInvoiceTotal(inv);
    const taxableTotal = inv.items.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
    const taxTotal = total - taxableTotal;

    const body = `
      <div class="printable-invoice" id="invoice-print-area">
        <div style="display:flex; justify-content:space-between; border-bottom:2px solid #0066CC; padding-bottom:18px;">
          <div>
            <h2 style="color:#0066CC; font-size:22px; font-weight:900;">TAX INVOICE</h2>
            <div style="font-size:16px; font-weight:800; color:#051937;">Apex Enterprises Ltd.</div>
            <div style="font-size:12px; color:#475569;">Plot 42, Sector 10, MIDC Industrial Area, Pune 411018</div>
            <div style="font-size:12px; color:#475569;">GSTIN: <b>27AABCU9603R1ZM</b> • State: Maharashtra (27)</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:18px; font-weight:900; font-family:var(--font-mono); color:#0066CC;">${inv.invoiceNumber}</div>
            <div style="font-size:12px; color:#475569;">Date: <b>${formatDate(inv.invoiceDate)}</b></div>
            <div style="font-size:12px; color:#475569;">Due: <b>${formatDate(inv.dueDate)}</b></div>
            <span class="badge ${inv.status}" style="margin-top:6px;">${inv.status.toUpperCase()}</span>
          </div>
        </div>

        <div class="invoice-bill-grid">
          <div>
            <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:#64748B;">Billed To:</span>
            <div style="font-size:15px; font-weight:800; color:#051937; margin-top:2px;">${inv.customerName}</div>
            <div style="font-size:12px; color:#475569;">${inv.customerAddress}</div>
            <div style="font-size:12px; color:#475569;">GSTIN: <b>${inv.customerGstin || 'Unregistered'}</b></div>
            <div style="font-size:12px; color:#475569;">Phone: ${inv.customerPhone}</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:#64748B;">Payment Mode:</span>
            <div style="font-size:14px; font-weight:700; color:#051937;">Bank Transfer / RTGS / NEFT</div>
            <div style="font-size:12px; color:#475569;">HDFC Bank • A/C: 50200049281048</div>
            <div style="font-size:12px; color:#475569;">IFSC: HDFC0001048</div>
          </div>
        </div>

        <table class="custom-table" style="margin:20px 0; border:1px solid #E2E8F0;">
          <thead>
            <tr style="background:#F1F5F9;">
              <th style="color:#051937;">#</th>
              <th style="color:#051937;">Item Description</th>
              <th style="color:#051937;">HSN</th>
              <th style="color:#051937;">Qty</th>
              <th style="color:#051937;">Rate</th>
              <th style="color:#051937;">GST</th>
              <th style="color:#051937; text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map((item, idx) => {
              const lineTax = (item.rate * item.quantity) * (item.gstRate / 100);
              const lineTot = (item.rate * item.quantity) + lineTax;
              return `
                <tr>
                  <td>${idx + 1}</td>
                  <td><b>${item.productName}</b></td>
                  <td>${item.hsnCode}</td>
                  <td>${item.quantity} ${item.unit}</td>
                  <td>${formatINR(item.rate)}</td>
                  <td>${item.gstRate}%</td>
                  <td style="text-align:right; font-weight:700;">${formatINR(lineTot)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="display:flex; justify-content:space-between; align-items:start; margin-top:20px;">
          <div style="max-width:350px; font-size:11.5px; color:#64748B;">
            <b>Terms & Conditions:</b>
            <p>1. Goods once sold will not be taken back.<br>2. Subject to Pune jurisdiction.</p>
          </div>
          <div style="width:260px; text-align:right;">
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
              <span>Taxable Subtotal:</span>
              <b>${formatINR(taxableTotal)}</b>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
              <span>Total GST (18%):</span>
              <b>${formatINR(taxTotal)}</b>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:900; color:#0066CC; border-top:2px solid #0066CC; padding-top:8px; margin-top:8px;">
              <span>Grand Total:</span>
              <span>${formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" onclick="window.print()"><i class="ph ph-printer"></i> Print Invoice PDF</button>
    `;

    this.openModal(`Tax Invoice: ${inv.invoiceNumber}`, body, footer, true);
  },

  markInvoicePaid(id) {
    const invoices = DataStore.getInvoices();
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      inv.status = 'paid';
      DataStore.saveInvoice(inv);
      this.navigate('invoices');
      this.showToast(`Invoice ${inv.invoiceNumber} marked as PAID!`, 'success');
    }
  },

  deleteInvoice(id) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      DataStore.deleteInvoice(id);
      this.navigate('invoices');
      this.showToast('Invoice deleted', 'info');
    }
  },

  // 3. Add Customer Modal
  openAddCustomerModal() {
    const body = `
      <form id="add-cust-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Customer / Business Name</label>
            <input type="text" class="form-control" id="c-name" placeholder="e.g. Mahavir Hardware Store" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" id="c-phone" placeholder="+91 98201 XXXXX" required>
          </div>
          <div class="form-group">
            <label class="form-label">GSTIN (Optional)</label>
            <input type="text" class="form-control" id="c-gstin" placeholder="27AABCU9603R1ZM">
          </div>
          <div class="form-group">
            <label class="form-label">Credit Limit (₹)</label>
            <input type="number" class="form-control" id="c-credit" value="100000">
          </div>
          <div class="form-group">
            <label class="form-label">Opening Due Balance (₹)</label>
            <input type="number" class="form-control" id="c-balance" value="0">
          </div>
          <div class="form-group full-width">
            <label class="form-label">Full Address</label>
            <input type="text" class="form-control" id="c-address" placeholder="Shop / Factory Address">
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitAddCustomer()">Save Customer Account</button>
    `;
    this.openModal('Add New Customer Account', body, footer);
  },

  submitAddCustomer() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    if (!name || !phone) return alert('Name and phone are required');

    const newCust = {
      id: `cust_${Date.now()}`,
      name: name,
      phone: phone,
      gstin: document.getElementById('c-gstin').value || '',
      creditLimit: parseFloat(document.getElementById('c-credit').value) || 50000,
      currentBalance: parseFloat(document.getElementById('c-balance').value) || 0,
      totalPurchases: 0,
      totalPaid: 0,
      address: document.getElementById('c-address').value || 'Pune, Maharashtra',
      ledger: []
    };

    DataStore.saveCustomer(newCust);
    this.closeModal();
    this.navigate('customers');
    this.showToast(`Customer ${name} added successfully!`, 'success');
  },

  // 4. WhatsApp Payment Reminder Modal
  openWhatsAppReminderModal(custId) {
    const cust = DataStore.getCustomers().find(c => c.id === custId);
    if (!cust) return;

    const msg = `Dear ${cust.name},\n\nThis is a gentle reminder from Apex Enterprises regarding your outstanding balance of ${formatINR(cust.currentBalance)}. Kindly settle the dues via UPI or bank transfer.\n\nThank you!`;

    const body = `
      <div>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Pre-formatted WhatsApp reminder text for <b>${cust.name}</b>:</p>
        <textarea class="form-control" rows="6" style="resize:none; font-family:var(--font-main);" id="wa-msg">${msg}</textarea>
      </div>
    `;

    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" style="background:#25D366; border:none;" onclick="window.open('https://api.whatsapp.com/send?phone=${encodeURIComponent(cust.phone)}&text=${encodeURIComponent(msg)}', '_blank')">
        <i class="ph ph-whatsapp-logo"></i> Send on WhatsApp
      </button>
    `;

    this.openModal(`Send Payment Reminder to ${cust.name}`, body, footer);
  },

  // 5. UPI Payment Collect Modal
  openPaymentCollectModal(custId) {
    const cust = custId ? DataStore.getCustomers().find(c => c.id === custId) : null;
    const amount = cust ? cust.currentBalance : 5000;

    const body = `
      <div style="text-align:center; padding:10px;">
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:14px;">Scan with Any UPI App (Google Pay, PhonePe, Paytm, BHIM)</p>
        <div style="background:#fff; padding:16px; border-radius:16px; display:inline-block; box-shadow:var(--shadow-md);">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=apexenterprises@hdfcbank%26pn=ApexEnterprises%26am=${amount}" alt="UPI QR" style="width:180px; height:180px; display:block;">
        </div>
        <div style="font-size:24px; font-weight:800; font-family:var(--font-heading); color:var(--success); margin-top:16px;">${formatINR(amount)}</div>
        <div style="font-size:12px; color:var(--text-muted);">UPI ID: <b>apexenterprises@hdfcbank</b></div>
      </div>
    `;

    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" onclick="App.showToast('Payment confirmed & credited to HDFC A/C!', 'success'); App.closeModal();">Mark Received</button>
    `;

    this.openModal('Instant UPI QR Payment Collection', body, footer);
  },

  // Helper: SVG Revenue Trends Chart Generator
  renderRevenueChartSVG() {
    return `
      <svg viewBox="0 0 600 220" style="width:100%; height:100%; overflow:visible;">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0084FF" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#0084FF" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Grid lines -->
        <line x1="40" y1="40" x2="580" y2="40" stroke="var(--border-color)" stroke-dasharray="4"/>
        <line x1="40" y1="90" x2="580" y2="90" stroke="var(--border-color)" stroke-dasharray="4"/>
        <line x1="40" y1="140" x2="580" y2="140" stroke="var(--border-color)" stroke-dasharray="4"/>
        <line x1="40" y1="190" x2="580" y2="190" stroke="var(--border-color)"/>

        <!-- Area fill -->
        <path d="M 50 160 Q 140 120 230 70 T 410 80 T 570 30 L 570 190 L 50 190 Z" fill="url(#chartGrad)"/>

        <!-- Line stroke -->
        <path d="M 50 160 Q 140 120 230 70 T 410 80 T 570 30" fill="none" stroke="#0084FF" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Secondary Expense Line -->
        <path d="M 50 170 Q 140 150 230 130 T 410 140 T 570 120" fill="none" stroke="#64748B" stroke-width="2.5" stroke-dasharray="5"/>

        <!-- Data points -->
        <circle cx="50" cy="160" r="4.5" fill="#0084FF" stroke="#fff" stroke-width="2"/>
        <circle cx="230" cy="70" r="4.5" fill="#0084FF" stroke="#fff" stroke-width="2"/>
        <circle cx="410" cy="80" r="4.5" fill="#0084FF" stroke="#fff" stroke-width="2"/>
        <circle cx="570" cy="30" r="6" fill="#38BDF8" stroke="#fff" stroke-width="2.5"/>

        <!-- Labels -->
        <text x="50" y="210" fill="var(--text-muted)" font-size="11" text-anchor="middle">Apr</text>
        <text x="180" y="210" fill="var(--text-muted)" font-size="11" text-anchor="middle">May</text>
        <text x="310" y="210" fill="var(--text-muted)" font-size="11" text-anchor="middle">Jun</text>
        <text x="440" y="210" fill="var(--text-muted)" font-size="11" text-anchor="middle">Jul</text>
        <text x="570" y="210" fill="var(--text-muted)" font-size="11" text-anchor="middle">Aug</text>
      </svg>
    `;
  },

  // Stock Adjustment Modal
  openStockAdjustModal() {
    const products = DataStore.getProducts();
    const body = `
      <form id="stock-adjust-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Select Product / Item</label>
            <select class="form-control" id="adj-prod-id" required>
              ${products.map(p => `<option value="${p.id}">${p.name} (Current: ${p.quantity} ${p.unit})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Action Type</label>
            <select class="form-control" id="adj-type">
              <option value="in">Stock IN (Purchase / Inward)</option>
              <option value="out">Stock OUT (Sales / Damaged)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Quantity</label>
            <input type="number" class="form-control" id="adj-qty" value="10" min="1" required>
          </div>
          <div class="form-group full-width">
            <label class="form-label">Reason / Reference Note</label>
            <input type="text" class="form-control" id="adj-reason" placeholder="e.g. GRN Inward Batch #9921">
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitStockAdjustment()">Apply Adjustment</button>
    `;
    this.openModal('Inventory Stock Adjustment', body, footer);
  },

  submitStockAdjustment() {
    const pid = document.getElementById('adj-prod-id').value;
    const type = document.getElementById('adj-type').value;
    const qty = parseFloat(document.getElementById('adj-qty').value) || 0;
    const products = DataStore.getProducts();
    const prod = products.find(p => p.id === pid);

    if (prod) {
      if (type === 'in') prod.quantity += qty;
      else prod.quantity = Math.max(0, prod.quantity - qty);
      DataStore.saveProduct(prod);
      this.closeModal();
      this.navigate('inventory');
      this.showToast(`Stock updated for ${prod.name} (${type === 'in' ? '+' : '-'}${qty} ${prod.unit})`, 'success');
    }
  },

  // Fund Transfer Modal
  openFundTransferModal() {
    const accounts = DataStore.get(STORAGE_KEYS.BANK_ACCOUNTS, INITIAL_BANK_ACCOUNTS);
    const body = `
      <form id="transfer-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">From Account</label>
            <select class="form-control" id="tr-from">
              ${accounts.map(a => `<option value="${a.id}">${a.bank} - ${a.name} (${formatINR(a.balance)})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">To Account / Beneficiary</label>
            <select class="form-control" id="tr-to">
              ${accounts.map(a => `<option value="${a.id}">${a.bank} - ${a.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Transfer Amount (₹)</label>
            <input type="number" class="form-control" id="tr-amount" value="25000" min="1" required>
          </div>
          <div class="form-group">
            <label class="form-label">Payment Mode</label>
            <select class="form-control" id="tr-mode">
              <option value="IMPS">IMPS (Instant)</option>
              <option value="NEFT">NEFT / RTGS</option>
              <option value="UPI">UPI Fast Transfer</option>
              <option value="Internal">Internal Sweep</option>
            </select>
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitFundTransfer()">Execute Transfer</button>
    `;
    this.openModal('Instant Inter-Bank Fund Transfer', body, footer);
  },

  submitFundTransfer() {
    const amount = parseFloat(document.getElementById('tr-amount').value) || 0;
    const mode = document.getElementById('tr-mode').value;
    this.closeModal();
    this.showToast(`₹${amount.toLocaleString('en-IN')} transferred via ${mode} successfully!`, 'success');
  },

  // Add Transaction Modal
  openAddTransactionModal(defaultType = 'debit') {
    const body = `
      <form id="add-tx-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Transaction Type</label>
            <select class="form-control" id="tx-type">
              <option value="debit" ${defaultType === 'debit' ? 'selected' : ''}>Outflow / Expense (Debit)</option>
              <option value="credit" ${defaultType === 'credit' ? 'selected' : ''}>Inflow / Income (Credit)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Amount (₹)</label>
            <input type="number" class="form-control" id="tx-amount" placeholder="e.g. 15000" min="1" required>
          </div>
          <div class="form-group full-width">
            <label class="form-label">Transaction Title / Description</label>
            <input type="text" class="form-control" id="tx-title" placeholder="e.g. Office Hardware Supplies" required>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-control" id="tx-cat">
              <option value="Utilities & Rent">Utilities & Rent</option>
              <option value="Inventory Purchase">Inventory Purchase</option>
              <option value="Logistics & Shipping">Logistics & Shipping</option>
              <option value="Salaries & Staff">Salaries & Staff</option>
              <option value="Sales / Invoice">Sales / Invoice</option>
              <option value="Marketing & Misc">Marketing & Misc</option>
              <option value="Groceries & Household">Groceries & Household</option>
              <option value="Dining & Entertainment">Dining & Entertainment</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Payment Method</label>
            <select class="form-control" id="tx-method">
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash in Hand</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Counterparty / Vendor</label>
            <input type="text" class="form-control" id="tx-party" placeholder="Party Name">
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" id="tx-date" value="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitAddTransaction()">Record Transaction</button>
    `;
    this.openModal(`Record ${defaultType === 'credit' ? 'Income / Inflow' : 'Expense / Outflow'}`, body, footer);
  },

  submitAddTransaction() {
    const title = document.getElementById('tx-title').value;
    const amount = parseFloat(document.getElementById('tx-amount').value) || 0;
    const type = document.getElementById('tx-type').value;
    if (!title || !amount) return alert('Title and Amount are required');

    const newTx = {
      id: `tx_${Date.now()}`,
      title: title,
      type: type,
      amount: amount,
      category: document.getElementById('tx-cat').value,
      paymentMethod: document.getElementById('tx-method').value,
      partyName: document.getElementById('tx-party').value || '',
      date: new Date().toISOString(),
      scope: this.mode
    };

    DataStore.saveTransaction(newTx);
    this.closeModal();
    this.navigate(this.currentView);
    this.showToast(`Transaction of ${formatINR(amount)} recorded!`, 'success');
  },

  // Add Product Modal
  openAddProductModal() {
    const body = `
      <form id="add-product-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Product / Item Name</label>
            <input type="text" class="form-control" id="p-name" placeholder="e.g. Industrial Coating Primer" required>
          </div>
          <div class="form-group">
            <label class="form-label">SKU Code</label>
            <input type="text" class="form-control" id="p-sku" value="PRD-${Math.floor(100 + Math.random() * 900)}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-control" id="p-cat">
              <option value="Paints & Coatings">Paints & Coatings</option>
              <option value="Electrical Components">Electrical Components</option>
              <option value="Hardware & Fasteners">Hardware & Fasteners</option>
              <option value="Raw Materials">Raw Materials</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Purchase Price (₹)</label>
            <input type="number" class="form-control" id="p-buy" value="1000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Selling Price (₹)</label>
            <input type="number" class="form-control" id="p-sell" value="1500" required>
          </div>
          <div class="form-group">
            <label class="form-label">Initial Stock Quantity</label>
            <input type="number" class="form-control" id="p-qty" value="50" required>
          </div>
          <div class="form-group">
            <label class="form-label">Low Stock Alert Threshold</label>
            <input type="number" class="form-control" id="p-min" value="10" required>
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitAddProduct()">Save Product</button>
    `;
    this.openModal('Add New Product to Inventory', body, footer);
  },

  submitAddProduct() {
    const name = document.getElementById('p-name').value;
    if (!name) return alert('Product name is required');

    const newProd = {
      id: `prod_${Date.now()}`,
      name: name,
      sku: document.getElementById('p-sku').value,
      barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category: document.getElementById('p-cat').value,
      unit: 'Pcs',
      purchasePrice: parseFloat(document.getElementById('p-buy').value) || 0,
      sellingPrice: parseFloat(document.getElementById('p-sell').value) || 0,
      quantity: parseFloat(document.getElementById('p-qty').value) || 0,
      minStockLevel: parseFloat(document.getElementById('p-min').value) || 5,
      hsnCode: '3208',
      gstRate: 18
    };

    DataStore.saveProduct(newProd);
    this.closeModal();
    this.navigate('inventory');
    this.showToast(`Product ${name} added to catalog!`, 'success');
  },

  // Edit Product Modal
  openEditProductModal(pid) {
    const prod = DataStore.getProducts().find(p => p.id === pid);
    if (!prod) return;

    const body = `
      <form id="edit-prod-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Product Name</label>
            <input type="text" class="form-control" id="ep-name" value="${prod.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Purchase Price (₹)</label>
            <input type="number" class="form-control" id="ep-buy" value="${prod.purchasePrice}">
          </div>
          <div class="form-group">
            <label class="form-label">Selling Price (₹)</label>
            <input type="number" class="form-control" id="ep-sell" value="${prod.sellingPrice}">
          </div>
          <div class="form-group">
            <label class="form-label">Current Stock</label>
            <input type="number" class="form-control" id="ep-qty" value="${prod.quantity}">
          </div>
          <div class="form-group">
            <label class="form-label">Min Stock Alert</label>
            <input type="number" class="form-control" id="ep-min" value="${prod.minStockLevel}">
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitEditProduct('${prod.id}')">Update Product</button>
    `;
    this.openModal(`Edit ${prod.name}`, body, footer);
  },

  submitEditProduct(pid) {
    const prod = DataStore.getProducts().find(p => p.id === pid);
    if (prod) {
      prod.name = document.getElementById('ep-name').value;
      prod.purchasePrice = parseFloat(document.getElementById('ep-buy').value) || prod.purchasePrice;
      prod.sellingPrice = parseFloat(document.getElementById('ep-sell').value) || prod.sellingPrice;
      prod.quantity = parseFloat(document.getElementById('ep-qty').value) || prod.quantity;
      prod.minStockLevel = parseFloat(document.getElementById('ep-min').value) || prod.minStockLevel;
      DataStore.saveProduct(prod);
      this.closeModal();
      this.navigate('inventory');
      this.showToast('Product updated successfully!', 'success');
    }
  },

  deleteProduct(pid) {
    if (confirm('Delete this product from catalog?')) {
      DataStore.deleteProduct(pid);
      this.navigate('inventory');
      this.showToast('Product removed', 'info');
    }
  },

  // Barcode Scanner Simulator
  openBarcodeScannerModal() {
    const products = DataStore.getProducts();
    const randomProd = products[Math.floor(Math.random() * products.length)];

    const body = `
      <div style="text-align:center; padding:12px;">
        <div style="width:240px; height:140px; border:2px dashed var(--primary-light); border-radius:12px; margin:0 auto 16px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--input-bg);">
          <i class="ph ph-barcode" style="font-size:48px; color:var(--primary-light);"></i>
          <span style="font-size:12px; color:var(--text-muted); margin-top:6px;">Laser Scanner Ready</span>
        </div>
        <div style="background:var(--input-bg); border-radius:10px; padding:14px; text-align:left;">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--text-muted);">Scanned Item:</div>
          <div style="font-size:16px; font-weight:800; color:var(--text-primary); margin-top:2px;">${randomProd.name}</div>
          <div style="font-size:12px; color:var(--text-muted);">${randomProd.sku} • In Stock: <b>${randomProd.quantity} ${randomProd.unit}</b></div>
          <div style="font-size:18px; font-weight:800; color:var(--primary-light); margin-top:6px; font-family:var(--font-heading);">${formatINR(randomProd.sellingPrice)}</div>
        </div>
      </div>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" onclick="App.showToast('Item Added to Active Invoice / Cart!', 'success'); App.closeModal();">Add to Invoice</button>
    `;
    this.openModal('Barcode Laser Scanner', body, footer);
  },

  // Customer Khata Ledger View Modal
  openKhataLedgerModal(custId) {
    const cust = DataStore.getCustomers().find(c => c.id === custId);
    if (!cust) return;

    const body = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px; background:var(--input-bg); border-radius:12px; margin-bottom:16px;">
          <div>
            <h4 style="font-size:16px; font-weight:800;">${cust.name}</h4>
            <div style="font-size:12px; color:var(--text-muted);">${cust.phone} • GSTIN: ${cust.gstin || 'N/A'}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px; font-weight:800; color:var(--text-muted);">NET BALANCE</div>
            <div style="font-size:20px; font-weight:900; font-family:var(--font-heading); color:${cust.currentBalance > 0 ? 'var(--debit)' : 'var(--success)'};">
              ${formatINR(cust.currentBalance)}
            </div>
          </div>
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description / Ref</th>
              <th style="text-align:right; color:var(--debit);">You Gave (Credit Sale)</th>
              <th style="text-align:right; color:var(--success);">You Got (Payment)</th>
            </tr>
          </thead>
          <tbody>
            ${(cust.ledger || []).map(l => `
              <tr>
                <td style="font-size:12px;">${formatDate(l.date)}</td>
                <td><div style="font-weight:600;">${l.description}</div></td>
                <td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--debit);">
                  ${l.type === 'give' ? formatINR(l.amount) : '—'}
                </td>
                <td style="text-align:right; font-family:var(--font-mono); font-weight:700; color:var(--success);">
                  ${l.type === 'got' ? formatINR(l.amount) : '—'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" onclick="App.openPaymentCollectModal('${cust.id}')"><i class="ph ph-qr-code"></i> Collect Dues</button>
    `;
    this.openModal(`Khata Statement: ${cust.name}`, body, footer, true);
  },

  // Foreclosure Calculator Modal
  openForeclosureCalcModal() {
    const body = `
      <div>
        <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">
          Calculate total interest savings and tenure reduction by making early part-prepayments or full foreclosure on active loans.
        </p>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Current Outstanding Principal (₹)</label>
            <input type="number" class="form-control" id="fc-principal" value="321500" oninput="App.recalcForeclosure()">
          </div>
          <div class="form-group">
            <label class="form-label">Interest Rate (% p.a.)</label>
            <input type="number" class="form-control" id="fc-rate" value="9.5" oninput="App.recalcForeclosure()">
          </div>
          <div class="form-group full-width">
            <label class="form-label">Prepayment Amount: <b id="fc-prep-val" style="color:var(--primary-light);">₹1,00,000</b></label>
            <input type="range" class="form-control" id="fc-slider" min="10000" max="300000" step="5000" value="100000" oninput="document.getElementById('fc-prep-val').textContent = formatINR(this.value); App.recalcForeclosure();">
          </div>
        </div>

        <div style="margin-top:20px; padding:18px; background:var(--input-bg); border-radius:14px; display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <span style="font-size:12px; color:var(--text-muted);">Estimated Interest Saved</span>
            <div style="font-size:22px; font-weight:800; color:var(--success); font-family:var(--font-heading);" id="fc-saved">₹18,450</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:12px; color:var(--text-muted);">Tenure Reduced By</span>
            <div style="font-size:22px; font-weight:800; color:var(--primary-light); font-family:var(--font-heading);" id="fc-tenure">5 Months</div>
          </div>
        </div>
      </div>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" onclick="App.showToast('Foreclosure Schedule Prepared for Bank Submission!', 'success'); App.closeModal();">Generate Bank Letter</button>
    `;
    this.openModal('Loan Foreclosure & Prepayment Calculator', body, footer);
  },

  recalcForeclosure() {
    const p = parseFloat(document.getElementById('fc-principal')?.value) || 300000;
    const r = parseFloat(document.getElementById('fc-rate')?.value) || 10;
    const prep = parseFloat(document.getElementById('fc-slider')?.value) || 50000;

    const saved = Math.round(prep * (r / 100) * 1.5);
    const months = Math.min(18, Math.max(1, Math.round(prep / 20000)));

    const savedEl = document.getElementById('fc-saved');
    const tenureEl = document.getElementById('fc-tenure');
    if (savedEl) savedEl.textContent = formatINR(saved);
    if (tenureEl) tenureEl.textContent = `${months} Months`;
  },

  // Add Loan Modal
  openAddLoanModal() {
    const body = `
      <form id="add-loan-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Loan Description / Title</label>
            <input type="text" class="form-control" id="ln-title" placeholder="e.g. Warehouse Expansion Loan" required>
          </div>
          <div class="form-group">
            <label class="form-label">Lender Bank / NBFC</label>
            <input type="text" class="form-control" id="ln-bank" placeholder="e.g. HDFC Bank Ltd." required>
          </div>
          <div class="form-group">
            <label class="form-label">Loan Type</label>
            <select class="form-control" id="ln-type">
              <option value="Business Equipment">Business Equipment</option>
              <option value="Commercial Vehicle">Commercial Vehicle</option>
              <option value="Working Capital OD">Working Capital OD</option>
              <option value="Personal Loan">Personal Loan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Principal Sanctioned (₹)</label>
            <input type="number" class="form-control" id="ln-principal" value="500000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Interest Rate (% p.a.)</label>
            <input type="number" class="form-control" id="ln-rate" value="9.5" required>
          </div>
          <div class="form-group">
            <label class="form-label">Tenure (Months)</label>
            <input type="number" class="form-control" id="ln-tenure" value="24" required>
          </div>
          <div class="form-group">
            <label class="form-label">Monthly EMI (₹)</label>
            <input type="number" class="form-control" id="ln-emi" value="22960" required>
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitAddLoan()">Register Loan</button>
    `;
    this.openModal('Add New Loan Account', body, footer);
  },

  submitAddLoan() {
    const title = document.getElementById('ln-title').value;
    if (!title) return alert('Title is required');

    const p = parseFloat(document.getElementById('ln-principal').value) || 100000;
    const emi = parseFloat(document.getElementById('ln-emi').value) || 5000;

    const newLoan = {
      id: `loan_${Date.now()}`,
      loanName: title,
      lenderBank: document.getElementById('ln-bank').value || 'HDFC Bank',
      loanAccountNumber: `LN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: document.getElementById('ln-type').value,
      principalAmount: p,
      interestRateAnnual: parseFloat(document.getElementById('ln-rate').value) || 10,
      tenureMonths: parseInt(document.getElementById('ln-tenure').value) || 24,
      monthlyEmi: emi,
      paidAmount: 0,
      remainingPrincipal: p,
      startDate: new Date().toISOString().split('T')[0],
      nextEmiDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      schedule: []
    };

    DataStore.saveLoan(newLoan);
    this.closeModal();
    this.navigate('loans');
    this.showToast(`Loan ${title} registered!`, 'success');
  },

  // View EMI Schedule Modal
  openEmiScheduleModal(loanId) {
    const loan = DataStore.getLoans().find(l => l.id === loanId);
    if (!loan) return;

    const body = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:var(--input-bg); border-radius:10px; margin-bottom:14px;">
          <div>
            <b>${loan.loanName}</b>
            <div style="font-size:11.5px; color:var(--text-muted);">${loan.lenderBank} • Monthly EMI: ${formatINR(loan.monthlyEmi)}</div>
          </div>
          <span class="badge neutral">${loan.interestRateAnnual}% p.a.</span>
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Due Date</th>
              <th>EMI Amount</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${(loan.schedule || []).map(s => `
              <tr>
                <td><b>${s.installment}</b></td>
                <td>${formatDate(s.dueDate)}</td>
                <td style="font-weight:700; font-family:var(--font-mono);">${formatINR(s.emi)}</td>
                <td style="font-family:var(--font-mono);">${formatINR(s.principal)}</td>
                <td style="font-family:var(--font-mono); color:var(--text-muted);">${formatINR(s.interest)}</td>
                <td style="font-family:var(--font-mono); font-weight:700;">${formatINR(s.balance)}</td>
                <td><span class="badge ${s.status === 'paid' ? 'success' : 'warning'}">${s.status.toUpperCase()}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Close</button>
      <button class="btn-primary" onclick="App.showToast('EMI payment confirmed & logged in cashbook!', 'success'); App.closeModal();">Record Next EMI Payment</button>
    `;
    this.openModal(`Amortization Schedule: ${loan.loanName}`, body, footer, true);
  },

  // Personal Mode: Budget View
  renderPersonalBudgetView() {
    return this.renderPersonalDashboard();
  },

  // Personal Mode: Goals View
  renderPersonalGoalsView() {
    return this.renderPersonalDashboard();
  },

  // Personal Mode: Calendar View
  renderPersonalCalendarView() {
    return `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Financial Calendar & Deadlines</h1>
          <p>Upcoming tax deadlines, EMI debits, vendor settlements and recurring bills</p>
        </div>
      </div>

      <div class="data-card" style="padding:22px;">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; align-items:center; justify-content:space-between; padding:14px; background:var(--input-bg); border-radius:10px; border-left:4px solid var(--debit);">
            <div>
              <div style="font-weight:800; font-size:14px;">HDFC Machinery Loan EMI Deduction</div>
              <div style="font-size:12px; color:var(--text-muted);">Auto-debit from HDFC Current Account</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800; font-family:var(--font-heading); color:var(--debit); font-size:16px;">₹22,960</div>
              <div style="font-size:11px; font-weight:700; color:var(--warning);">Due 5th Sept</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; padding:14px; background:var(--input-bg); border-radius:10px; border-left:4px solid var(--primary-light);">
            <div>
              <div style="font-weight:800; font-size:14px;">GSTR-1 Monthly Return Filing</div>
              <div style="font-size:12px; color:var(--text-muted);">Upload B2B & B2C outbound sales invoices</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; font-weight:700; color:var(--primary-light);">Due 11th Sept</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; padding:14px; background:var(--input-bg); border-radius:10px; border-left:4px solid var(--success);">
            <div>
              <div style="font-weight:800; font-size:14px;">Executive Salary & Dividends Deposit</div>
              <div style="font-size:12px; color:var(--text-muted);">Credited to Piyush HDFC Savings A/C</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800; font-family:var(--font-heading); color:var(--success); font-size:16px;">+₹1,25,000</div>
              <div style="font-size:11px; font-weight:700; color:var(--success);">Completed 29th Aug</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Add Goal Modal
  openAddGoalModal() {
    const body = `
      <form id="add-goal-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label">Goal Target Title</label>
            <input type="text" class="form-control" id="gl-title" placeholder="e.g. Commercial Office Space" required>
          </div>
          <div class="form-group">
            <label class="form-label">Target Amount (₹)</label>
            <input type="number" class="form-control" id="gl-target" value="500000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Current Saved Amount (₹)</label>
            <input type="number" class="form-control" id="gl-cur" value="100000">
          </div>
          <div class="form-group">
            <label class="form-label">Monthly SIP (₹)</label>
            <input type="number" class="form-control" id="gl-sip" value="20000">
          </div>
          <div class="form-group">
            <label class="form-label">Target Date</label>
            <input type="date" class="form-control" id="gl-date" value="${new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]}">
          </div>
        </div>
      </form>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitAddGoal()">Create Target</button>
    `;
    this.openModal('Create New Financial Goal', body, footer);
  },

  submitAddGoal() {
    const title = document.getElementById('gl-title').value;
    if (!title) return alert('Goal title is required');

    const newGoal = {
      id: `goal_${Date.now()}`,
      title: title,
      targetAmount: parseFloat(document.getElementById('gl-target').value) || 100000,
      currentAmount: parseFloat(document.getElementById('gl-cur').value) || 0,
      monthlySip: parseFloat(document.getElementById('gl-sip').value) || 5000,
      deadline: document.getElementById('gl-date').value,
      category: 'Wealth Goal',
      icon: 'ph-target',
      color: '#0066CC'
    };

    DataStore.saveGoal(newGoal);
    this.closeModal();
    this.navigate('dashboard');
    this.showToast(`Financial Goal "${title}" Created!`, 'success');
  },

  openAddFundsToGoalModal(goalId) {
    const goal = DataStore.getGoals().find(g => g.id === goalId);
    if (!goal) return;

    const body = `
      <div>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:14px;">Add funds / SIP installment to <b>${goal.title}</b></p>
        <div class="form-group">
          <label class="form-label">Contribution Amount (₹)</label>
          <input type="number" class="form-control" id="gl-add-amt" value="${goal.monthlySip}">
        </div>
      </div>
    `;
    const footer = `
      <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
      <button class="btn-primary" onclick="App.submitAddFundsToGoal('${goal.id}')">Deposit Funds</button>
    `;
    this.openModal(`Add Funds to ${goal.title}`, body, footer);
  },

  submitAddFundsToGoal(goalId) {
    const amt = parseFloat(document.getElementById('gl-add-amt').value) || 0;
    const goal = DataStore.getGoals().find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount += amt;
      DataStore.saveGoal(goal);
      this.closeModal();
      this.navigate('dashboard');
      this.showToast(`Deposited ${formatINR(amt)} to ${goal.title}!`, 'success');
    }
  },

  // Save Business Settings
  saveBusinessSettings() {
    const s = DataStore.getSettings();
    s.business.companyName = document.getElementById('cfg-company').value;
    s.business.gstin = document.getElementById('cfg-gstin').value;
    s.business.phone = document.getElementById('cfg-phone').value;
    s.business.email = document.getElementById('cfg-email').value;
    s.business.address = document.getElementById('cfg-address').value;
    DataStore.saveSettings(s);
    this.updateTopbarHeader();
    this.showToast('Business configuration saved!', 'success');
  },

  // Quick Action Modal
  openQuickActionModal() {
    const body = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <button class="quick-action-card" onclick="App.closeModal(); App.openCreateInvoiceModal();">
          <div class="qa-icon-wrap"><i class="ph ph-receipt"></i></div>
          <span>New GST Invoice</span>
        </button>
        <button class="quick-action-card" onclick="App.closeModal(); App.openAddTransactionModal('debit');">
          <div class="qa-icon-wrap"><i class="ph ph-minus-circle" style="color:var(--debit);"></i></div>
          <span>Record Expense</span>
        </button>
        <button class="quick-action-card" onclick="App.closeModal(); App.openAddCustomerModal();">
          <div class="qa-icon-wrap"><i class="ph ph-user-plus"></i></div>
          <span>Add Customer</span>
        </button>
        <button class="quick-action-card" onclick="App.closeModal(); App.openStockAdjustModal();">
          <div class="qa-icon-wrap"><i class="ph ph-package"></i></div>
          <span>Adjust Stock</span>
        </button>
      </div>
    `;
    this.openModal('Quick Financial Entry', body);
  },

  viewTransactionDetails(txId) {
    const tx = DataStore.getTransactions().find(t => t.id === txId);
    if (!tx) return;
    this.openModal('Transaction Receipt', `
      <div style="padding:10px;">
        <div style="font-size:18px; font-weight:800;">${tx.title}</div>
        <div style="font-size:24px; font-weight:900; margin:10px 0; color:${tx.type === 'credit' ? 'var(--credit)' : 'var(--debit)'};">
          ${tx.type === 'credit' ? '+' : '-'}${formatINR(tx.amount)}
        </div>
        <div style="font-size:12px; color:var(--text-muted);">
          Category: <b>${tx.category}</b><br>
          Payment Mode: <b>${tx.paymentMethod}</b><br>
          Date: <b>${formatDate(tx.date)} ${formatTime(tx.date)}</b><br>
          Party: <b>${tx.partyName || 'Counterparty'}</b>
        </div>
      </div>
    `);
  },

  deleteTransaction(id) {
    if (confirm('Delete this transaction?')) {
      DataStore.deleteTransaction(id);
      this.navigate('transactions');
      this.showToast('Transaction deleted', 'info');
    }
  },

  filterInvoicesTable(q) {
    const rows = document.querySelectorAll('#invoices-table tbody tr');
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = txt.includes(q.toLowerCase()) ? '' : 'none';
    });
  },

  // Reset to Demo Data
  resetToFactoryDefaults() {
    if (confirm('Reset application data to initial demo state?')) {
      DataStore.resetAll();
      this.init();
      this.showToast('Application state reset to defaults!', 'success');
    }
  },

  exportTransactionsCSV() {
    const txs = DataStore.getTransactions();
    let csv = 'ID,Title,Type,Amount,Date,Category,Party,PaymentMethod\n';
    txs.forEach(t => {
      csv += `"${t.id}","${t.title}","${t.type}",${t.amount},"${t.date}","${t.category}","${t.partyName || ''}","${t.paymentMethod}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `ENX_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.showToast('Transactions CSV Exported!', 'success');
  },

  exportGSTRReport() {
    this.showToast('GSTR-1 JSON & Excel Tax Summary Exported!', 'success');
  }
};

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
