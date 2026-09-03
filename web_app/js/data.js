/**
 * ENX MONEY - Financial Operating System Data Store & Models
 * Supports State Persistence via localStorage with Full Reset capabilities
 */

const STORAGE_KEYS = {
  INVOICES: 'enx_invoices',
  CUSTOMERS: 'enx_customers',
  PRODUCTS: 'enx_products',
  TRANSACTIONS: 'enx_transactions',
  LOANS: 'enx_loans',
  BUDGETS: 'enx_budgets',
  GOALS: 'enx_goals',
  BANK_ACCOUNTS: 'enx_bank_accounts',
  SETTINGS: 'enx_settings',
  MODE: 'enx_active_mode',
  THEME: 'enx_theme_mode',
  LANGUAGE: 'enx_language'
};

const INITIAL_INVOICES = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2024-1084',
    type: 'tax_invoice',
    status: 'paid',
    invoiceDate: '2024-08-27',
    dueDate: '2024-09-10',
    businessName: 'Apex Enterprises Ltd.',
    businessGstin: '27AABCU9603R1ZM',
    businessAddress: 'Plot 42, MIDC Industrial Area, Pune 411018',
    businessPhone: '+91 98201 23456',
    customerName: 'Sharma Hardware & Paints',
    customerId: 'cust_001',
    customerGstin: '27AABCU9603R1ZM',
    customerPhone: '+91 98234 11223',
    customerAddress: 'Plot 42, Industrial Area Phase 2, Pune',
    isInterState: false,
    items: [
      {
        id: 'item_1',
        productName: 'Premium Epoxy Primer 20L',
        hsnCode: '3208',
        quantity: 10,
        unit: 'Pcs',
        rate: 2500,
        discountPercent: 5.0,
        gstRate: 18.0
      },
      {
        id: 'item_2',
        productName: 'Industrial Synthetic Enamel 10L',
        hsnCode: '3208',
        quantity: 5,
        unit: 'Pcs',
        rate: 1800,
        discountPercent: 0.0,
        gstRate: 18.0
      }
    ],
    notes: 'Payment received via NEFT. Thank you for your business.'
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2024-1085',
    type: 'tax_invoice',
    status: 'pending',
    invoiceDate: '2024-08-25',
    dueDate: '2024-09-08',
    businessName: 'Apex Enterprises Ltd.',
    businessGstin: '27AABCU9603R1ZM',
    businessAddress: 'Plot 42, MIDC Industrial Area, Pune 411018',
    businessPhone: '+91 98201 23456',
    customerName: 'Modern Electronics & Spares',
    customerId: 'cust_002',
    customerGstin: '27AABCM8765Q1ZL',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Shop 12, Lamington Road, Mumbai',
    isInterState: false,
    items: [
      {
        id: 'item_3',
        productName: 'Heavy Duty Toroidal Transformer 500VA',
        hsnCode: '8504',
        quantity: 25,
        unit: 'Pcs',
        rate: 4200,
        discountPercent: 2.0,
        gstRate: 18.0
      }
    ],
    notes: '30-day standard payment terms.'
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2024-1086',
    type: 'tax_invoice',
    status: 'overdue',
    invoiceDate: '2024-07-25',
    dueDate: '2024-08-24',
    businessName: 'Apex Enterprises Ltd.',
    businessGstin: '27AABCU9603R1ZM',
    businessAddress: 'Plot 42, MIDC Industrial Area, Pune 411018',
    businessPhone: '+91 98201 23456',
    customerName: 'Reliable Buildcon Infra',
    customerId: 'cust_004',
    customerGstin: '27AABCR9999P1ZP',
    customerPhone: '+91 99887 76655',
    customerAddress: 'Tower B, Cyber City, Navi Mumbai',
    isInterState: false,
    items: [
      {
        id: 'item_4',
        productName: 'Galvanized Structural Fasteners (Box 500)',
        hsnCode: '7318',
        quantity: 100,
        unit: 'Box',
        rate: 1200,
        discountPercent: 10.0,
        gstRate: 18.0
      }
    ],
    notes: 'Immediate settlement requested. Payment overdue by 5 days.'
  },
  {
    id: 'inv_004',
    invoiceNumber: 'INV-2024-1087',
    type: 'bill_of_supply',
    status: 'paid',
    invoiceDate: '2024-08-28',
    dueDate: '2024-08-28',
    businessName: 'Apex Enterprises Ltd.',
    businessGstin: '27AABCU9603R1ZM',
    businessAddress: 'Plot 42, MIDC Industrial Area, Pune 411018',
    businessPhone: '+91 98201 23456',
    customerName: 'Balaji Agro Agency',
    customerId: 'cust_003',
    customerGstin: '27AABCB1234N1ZK',
    customerPhone: '+91 94220 56789',
    customerAddress: 'APMC Market Yard, Nashik, Maharashtra',
    isInterState: false,
    items: [
      {
        id: 'item_5',
        productName: 'Industrial Synthetic Enamel 10L',
        hsnCode: '3208',
        quantity: 15,
        unit: 'Pcs',
        rate: 1800,
        discountPercent: 3.0,
        gstRate: 18.0
      }
    ],
    notes: 'Cash counter sale completed with instant UPI receipt.'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'cust_001',
    name: 'Sharma Hardware & Paints',
    phone: '+91 98234 11223',
    email: 'sharma.hardware@gmail.com',
    gstin: '27AABCU9603R1ZM',
    address: 'Plot 42, Industrial Area Phase 2, Pune, Maharashtra',
    currentBalance: 45000.00,
    totalPurchases: 245000.00,
    totalPaid: 200000.00,
    lastTransactionDate: '2024-08-27',
    creditLimit: 100000,
    notes: 'Trusted wholesale distributor. 30-day payment cycle.',
    ledger: [
      { id: 'led_101', date: '2024-08-27', type: 'give', amount: 45000, description: 'Sale: 50 Boxes Industrial Paint & Primer (INV-2024-1084)', runningBalance: 45000 },
      { id: 'led_102', date: '2024-08-14', type: 'got', amount: 50000, description: 'Bank NEFT Settlement (Ref: ICICI89472)', runningBalance: 0 },
      { id: 'led_103', date: '2024-08-09', type: 'give', amount: 50000, description: 'Dispatched Hardware fixtures & accessories (INV-2024-0992)', runningBalance: 50000 }
    ]
  },
  {
    id: 'cust_002',
    name: 'Modern Electronics & Spares',
    phone: '+91 98765 43210',
    email: 'sales@modernelec.in',
    gstin: '27AABCM8765Q1ZL',
    address: 'Shop 12, Lamington Road, Mumbai, Maharashtra',
    currentBalance: 128500.00,
    totalPurchases: 680000.00,
    totalPaid: 551500.00,
    lastTransactionDate: '2024-08-28',
    creditLimit: 200000,
    notes: 'Bulk order client for capacitors & transformers.',
    ledger: [
      { id: 'led_201', date: '2024-08-25', type: 'give', amount: 128500, description: 'Heavy Duty Toroidal Transformer Order (INV-2024-1085)', runningBalance: 128500 },
      { id: 'led_202', date: '2024-08-10', type: 'got', amount: 200000, description: 'RTGS Payment received for July deliveries', runningBalance: 0 }
    ]
  },
  {
    id: 'cust_003',
    name: 'Balaji Agro Agency',
    phone: '+91 94220 56789',
    email: 'balajiagro@rediffmail.com',
    gstin: '27AABCB1234N1ZK',
    address: 'APMC Market Yard, Nashik, Maharashtra',
    currentBalance: 0.00,
    totalPurchases: 180000.00,
    totalPaid: 180000.00,
    lastTransactionDate: '2024-08-24',
    creditLimit: 50000,
    notes: 'Cleared all dues on 24th of this month.',
    ledger: [
      { id: 'led_301', date: '2024-08-24', type: 'got', amount: 35000, description: 'Full settlement via UPI QR', runningBalance: 0 },
      { id: 'led_302', date: '2024-08-20', type: 'give', amount: 35000, description: 'Agricultural equipment coatings delivery', runningBalance: 35000 }
    ]
  },
  {
    id: 'cust_004',
    name: 'Reliable Buildcon Infra',
    phone: '+91 99887 76655',
    email: 'accounts@reliableinfra.com',
    gstin: '27AABCR9999P1ZP',
    address: 'Tower B, Cyber City, Navi Mumbai',
    currentBalance: 276500.00,
    totalPurchases: 1250000.00,
    totalPaid: 973500.00,
    lastTransactionDate: '2024-08-29',
    creditLimit: 500000,
    notes: 'Commercial contracting party. High volume.',
    ledger: [
      { id: 'led_401', date: '2024-07-25', type: 'give', amount: 127440, description: 'Fasteners Supply (INV-2024-1086)', runningBalance: 276500 },
      { id: 'led_402', date: '2024-07-10', type: 'give', amount: 149060, description: 'Structural fittings consignment', runningBalance: 149060 }
    ]
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Premium Epoxy Primer 20L',
    sku: 'PRM-EPX-020',
    barcode: '8901234567890',
    category: 'Paints & Coatings',
    unit: 'Pcs',
    purchasePrice: 1800.0,
    sellingPrice: 2500.0,
    quantity: 42,
    minStockLevel: 15,
    supplierId: 'sup_001',
    supplierName: 'National Chemical Industries',
    hsnCode: '3208',
    gstRate: 18.0
  },
  {
    id: 'prod_002',
    name: 'Industrial Synthetic Enamel 10L',
    sku: 'ENM-SYN-010',
    barcode: '8901234567891',
    category: 'Paints & Coatings',
    unit: 'Pcs',
    purchasePrice: 1200.0,
    sellingPrice: 1800.0,
    quantity: 8,
    minStockLevel: 10,
    supplierId: 'sup_001',
    supplierName: 'National Chemical Industries',
    hsnCode: '3208',
    gstRate: 18.0
  },
  {
    id: 'prod_003',
    name: 'Toroidal Power Transformer 500VA',
    sku: 'TRF-TOR-500',
    barcode: '8901234567892',
    category: 'Electrical Components',
    unit: 'Pcs',
    purchasePrice: 3200.0,
    sellingPrice: 4200.0,
    quantity: 3,
    minStockLevel: 5,
    supplierId: 'sup_002',
    supplierName: 'Delta Transformers Ltd.',
    hsnCode: '8504',
    gstRate: 18.0
  },
  {
    id: 'prod_004',
    name: 'Galvanized Structural Fasteners (Box 500)',
    sku: 'FST-GLV-500',
    barcode: '8901234567893',
    category: 'Hardware & Fasteners',
    unit: 'Box',
    purchasePrice: 850.0,
    sellingPrice: 1200.0,
    quantity: 65,
    minStockLevel: 20,
    supplierId: 'sup_003',
    supplierName: 'Reliable Fasteners Corp.',
    hsnCode: '7318',
    gstRate: 18.0
  },
  {
    id: 'prod_005',
    name: 'Heavy Duty Silicone Sealant (Cartridge)',
    sku: 'SLN-IND-400',
    barcode: '8901234567894',
    category: 'Hardware & Fasteners',
    unit: 'Pcs',
    purchasePrice: 220.0,
    sellingPrice: 360.0,
    quantity: 120,
    minStockLevel: 30,
    supplierId: 'sup_001',
    supplierName: 'National Chemical Industries',
    hsnCode: '3214',
    gstRate: 18.0
  }
];

const INITIAL_SUPPLIERS = [
  {
    id: 'sup_001',
    name: 'National Chemical Industries',
    phone: '+91 98450 11223',
    email: 'sales@nationalchem.com',
    gstin: '27AABCN1234Q1ZK',
    address: 'Chemical Zone, Taloja MIDC, Navi Mumbai',
    outstandingPayable: 65000.0,
    totalPurchases: 450000.0,
    lastPurchaseDate: '2024-08-25',
    paymentTerms: 'Net 30 Days'
  },
  {
    id: 'sup_002',
    name: 'Delta Transformers Ltd.',
    phone: '+91 98111 88990',
    email: 'orders@deltatransformers.in',
    gstin: '27AABCD5678P1ZL',
    address: 'GIDC Electronic City, Vadodara, Gujarat',
    outstandingPayable: 63500.0,
    totalPurchases: 320000.0,
    lastPurchaseDate: '2024-08-19',
    paymentTerms: 'Immediate / Advance 50%'
  },
  {
    id: 'sup_003',
    name: 'Reliable Fasteners Corp.',
    phone: '+91 97654 33221',
    email: 'info@reliablefasteners.co.in',
    gstin: '27AABCR4432K1ZV',
    address: 'Bhosari MIDC, Pune 411026',
    outstandingPayable: 0.0,
    totalPurchases: 195000.0,
    lastPurchaseDate: '2024-08-22',
    paymentTerms: '15-day Credit'
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_001',
    title: 'Payment Received from Sharma Hardware',
    type: 'credit',
    amount: 34500.0,
    date: '2024-08-29T11:45:00',
    category: 'Sales / Invoice',
    partyName: 'Sharma Hardware & Paints',
    partyId: 'cust_001',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2024-1084',
    scope: 'business'
  },
  {
    id: 'tx_002',
    title: 'BlueDart Courier Logistics Services',
    type: 'debit',
    amount: 2450.0,
    date: '2024-08-29T09:15:00',
    category: 'Logistics & Shipping',
    partyName: 'BlueDart Express',
    paymentMethod: 'Bank Transfer',
    scope: 'business'
  },
  {
    id: 'tx_003',
    title: 'Factory & Warehouse Rent for August',
    type: 'debit',
    amount: 32000.0,
    date: '2024-08-28T16:00:00',
    category: 'Utilities & Rent',
    partyName: 'MIDC Industrial Estate',
    paymentMethod: 'NEFT',
    isRecurring: true,
    scope: 'business'
  },
  {
    id: 'tx_004',
    title: 'Sale of Electrical Transformers Batch',
    type: 'credit',
    amount: 105000.0,
    date: '2024-08-27T14:20:00',
    category: 'Wholesale B2B',
    partyName: 'Modern Electronics & Spares',
    partyId: 'cust_002',
    paymentMethod: 'RTGS',
    invoiceNumber: 'INV-2024-1085',
    scope: 'business'
  },
  {
    id: 'tx_005',
    title: 'Staff Payroll & Production Wages',
    type: 'debit',
    amount: 55000.0,
    date: '2024-08-25T17:30:00',
    category: 'Salaries & Staff',
    paymentMethod: 'Bank Transfer',
    isRecurring: true,
    scope: 'business'
  },
  {
    id: 'tx_006',
    title: 'Raw Material Epoxy Resin Inward',
    type: 'debit',
    amount: 65000.0,
    date: '2024-08-24T12:00:00',
    category: 'Inventory Purchase',
    partyName: 'National Chemical Industries',
    paymentMethod: 'Cheque',
    scope: 'business'
  },
  // Personal transactions
  {
    id: 'tx_p01',
    title: 'Monthly Executive Salary Credit',
    type: 'credit',
    amount: 125000.0,
    date: '2024-08-29T10:00:00',
    category: 'Salary & Income',
    partyName: 'Apex Enterprises Ltd.',
    paymentMethod: 'Direct Deposit',
    scope: 'personal'
  },
  {
    id: 'tx_p02',
    title: 'Apartment Maintenance & Utilities',
    type: 'debit',
    amount: 18500.0,
    date: '2024-08-28T18:00:00',
    category: 'Housing & Utilities',
    partyName: 'Pride Panorama Society',
    paymentMethod: 'UPI',
    scope: 'personal'
  },
  {
    id: 'tx_p03',
    title: 'Nature Basket Organic Groceries',
    type: 'debit',
    amount: 9450.0,
    date: '2024-08-26T20:30:00',
    category: 'Groceries & Household',
    partyName: 'Natures Basket',
    paymentMethod: 'Credit Card',
    scope: 'personal'
  },
  {
    id: 'tx_p04',
    title: 'Weekend Dining & Family Outing',
    type: 'debit',
    amount: 8200.0,
    date: '2024-08-25T21:45:00',
    category: 'Dining & Entertainment',
    partyName: 'The Westin Pune',
    paymentMethod: 'Credit Card',
    scope: 'personal'
  },
  {
    id: 'tx_p05',
    title: 'Car Fuel & Expressway Tolls',
    type: 'debit',
    amount: 4200.0,
    date: '2024-08-23T11:00:00',
    category: 'Vehicle & Fuel',
    partyName: 'Indian Oil Corp',
    paymentMethod: 'Fastag & UPI',
    scope: 'personal'
  }
];

const INITIAL_LOANS = [
  {
    id: 'loan_001',
    loanName: 'Machinery & Paint Mixer Unit Loan',
    lenderBank: 'HDFC Bank Ltd.',
    loanAccountNumber: 'LOAN-HDFC-99201',
    type: 'Business Equipment',
    principalAmount: 500000.0,
    interestRateAnnual: 9.5,
    tenureMonths: 24,
    monthlyEmi: 22960.0,
    paidAmount: 183680.0,
    remainingPrincipal: 321500.0,
    startDate: '2024-01-05',
    endDate: '2026-01-05',
    nextEmiDate: '2024-09-05',
    autoDebitAccount: 'HDFC Current A/C ***4892',
    schedule: [
      { installment: 9, dueDate: '2024-09-05', emi: 22960, principal: 19800, interest: 3160, balance: 301700, status: 'upcoming' },
      { installment: 8, dueDate: '2024-08-05', emi: 22960, principal: 19650, interest: 3310, balance: 321500, status: 'paid' },
      { installment: 7, dueDate: '2024-07-05', emi: 22960, principal: 19500, interest: 3460, balance: 341150, status: 'paid' },
      { installment: 6, dueDate: '2024-06-05', emi: 22960, principal: 19350, interest: 3610, balance: 360650, status: 'paid' },
      { installment: 5, dueDate: '2024-05-05', emi: 22960, principal: 19200, interest: 3760, balance: 380000, status: 'paid' }
    ]
  },
  {
    id: 'loan_002',
    loanName: 'Commercial Delivery Van (Tata Ace Gold)',
    lenderBank: 'ICICI Bank Ltd.',
    loanAccountNumber: 'LOAN-ICICI-44120',
    type: 'Commercial Vehicle',
    principalAmount: 400000.0,
    interestRateAnnual: 10.0,
    tenureMonths: 36,
    monthlyEmi: 12906.0,
    paidAmount: 250000.0,
    remainingPrincipal: 150000.0,
    startDate: '2023-04-10',
    endDate: '2026-04-10',
    nextEmiDate: '2024-09-10',
    autoDebitAccount: 'ICICI Current A/C ***1029',
    schedule: [
      { installment: 18, dueDate: '2024-09-10', emi: 12906, principal: 11650, interest: 1256, balance: 138350, status: 'upcoming' },
      { installment: 17, dueDate: '2024-08-10', emi: 12906, principal: 11550, interest: 1356, balance: 150000, status: 'paid' }
    ]
  },
  {
    id: 'loan_003',
    loanName: 'Apex Industrial Working Capital Overdraft',
    lenderBank: 'State Bank of India',
    loanAccountNumber: 'LOAN-SBI-77218',
    type: 'Working Capital OD',
    principalAmount: 1000000.0,
    interestRateAnnual: 8.75,
    tenureMonths: 12,
    monthlyEmi: 87340.0,
    paidAmount: 524040.0,
    remainingPrincipal: 485000.0,
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    nextEmiDate: '2024-09-01',
    autoDebitAccount: 'SBI Industrial A/C ***8371',
    schedule: [
      { installment: 6, dueDate: '2024-09-01', emi: 87340, principal: 83800, interest: 3540, balance: 401200, status: 'upcoming' },
      { installment: 5, dueDate: '2024-08-01', emi: 87340, principal: 83200, interest: 4140, balance: 485000, status: 'paid' }
    ]
  }
];

const INITIAL_BUDGETS = [
  { id: 'b_1', name: 'Housing & Utilities', budget: 20000, spent: 18500, icon: 'ph-house-line', color: '#051937' },
  { id: 'b_2', name: 'Groceries & Household', budget: 15000, spent: 9450, icon: 'ph-shopping-cart', color: '#0066CC' },
  { id: 'b_3', name: 'Dining & Entertainment', budget: 10000, spent: 8200, icon: 'ph-fork-knife', color: '#F59E0B' },
  { id: 'b_4', name: 'Vehicle & Fuel', budget: 8000, spent: 4200, icon: 'ph-car', color: '#6366F1' },
  { id: 'b_5', name: 'Personal Care & Health', budget: 6000, spent: 1650, icon: 'ph-heartbeat', color: '#10B981' },
  { id: 'b_6', name: 'Subscriptions & Digital', budget: 6000, spent: 800, icon: 'ph-device-mobile', color: '#8B5CF6' }
];

const INITIAL_GOALS = [
  {
    id: 'goal_1',
    title: 'Emergency Rainy Day Reserve',
    targetAmount: 300000,
    currentAmount: 220000,
    monthlySip: 15000,
    deadline: '2024-12-31',
    category: 'Safety Net',
    icon: 'ph-shield-check',
    color: '#10B981'
  },
  {
    id: 'goal_2',
    title: 'Tata Curvv EV Down Payment',
    targetAmount: 500000,
    currentAmount: 340000,
    monthlySip: 25000,
    deadline: '2025-03-31',
    category: 'Automobile',
    icon: 'ph-lightning',
    color: '#0066CC'
  },
  {
    id: 'goal_3',
    title: 'Switzerland Family Vacation',
    targetAmount: 400000,
    currentAmount: 180000,
    monthlySip: 20000,
    deadline: '2025-06-30',
    category: 'Travel & Leisure',
    icon: 'ph-airplane-tilt',
    color: '#F59E0B'
  },
  {
    id: 'goal_4',
    title: 'Bluechip Equity Retirement Corpus',
    targetAmount: 2500000,
    currentAmount: 850000,
    monthlySip: 40000,
    deadline: '2030-12-31',
    category: 'Wealth Creation',
    icon: 'ph-trend-up',
    color: '#8B5CF6'
  }
];

const INITIAL_BANK_ACCOUNTS = [
  { id: 'acc_1', bank: 'HDFC Bank', name: 'Apex Current Account', accNumber: '•••• 4892', type: 'Current', balance: 1120400, ifsc: 'HDFC0001048', scope: 'business', isPrimary: true },
  { id: 'acc_2', bank: 'ICICI Bank', name: 'Apex Tax & GST A/C', accNumber: '•••• 1029', type: 'Current', balance: 415220, ifsc: 'ICIC0000214', scope: 'business' },
  { id: 'acc_3', bank: 'State Bank of India', name: 'Working Capital CC', accNumber: '•••• 8371', type: 'Cash Credit', balance: 310000, ifsc: 'SBIN0004921', scope: 'business' },
  { id: 'acc_4', bank: 'HDFC Bank', name: 'Piyush Salary & Savings', accNumber: '•••• 7731', type: 'Savings', balance: 325320, ifsc: 'HDFC0001048', scope: 'personal', isPrimary: true },
  { id: 'acc_5', bank: 'Zerodha Broking', name: 'Direct Mutual Funds & Equity', accNumber: '•••• 9940', type: 'Demat', balance: 160000, ifsc: 'HDFC0000001', scope: 'personal' }
];

const INITIAL_SETTINGS = {
  business: {
    companyName: 'Apex Enterprises Ltd.',
    tagline: 'Precision Engineering & Industrial Supplies',
    gstin: '27AABCU9603R1ZM',
    pan: 'AABCU9603R',
    email: 'accounts@apexenterprises.in',
    phone: '+91 98201 23456',
    address: 'Plot 42, Sector 10, MIDC Industrial Area, Pune 411018, Maharashtra',
    state: 'Maharashtra',
    stateCode: '27',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50200049281048',
    ifsc: 'HDFC0001048',
    branch: 'Bhosari MIDC Branch, Pune'
  },
  user: {
    fullName: 'Piyush Walunj',
    email: 'piyush.walunj@enterprenex.com',
    phone: '+91 98201 23456',
    role: 'Managing Director & Founder',
    pin: '1234',
    biometricEnabled: true,
    twoFactorEnabled: true
  }
};

// Central LocalStorage Controller
class DataStore {
  static get(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      this.set(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      this.set(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.set(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.set(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
      this.set(STORAGE_KEYS.LOANS, INITIAL_LOANS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
      this.set(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
      this.set(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS)) {
      this.set(STORAGE_KEYS.BANK_ACCOUNTS, INITIAL_BANK_ACCOUNTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MODE)) {
      this.set(STORAGE_KEYS.MODE, 'business');
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      this.set(STORAGE_KEYS.THEME, 'dark'); // Default to sleek midnight navy theme
    }
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
      this.set(STORAGE_KEYS.LANGUAGE, 'en');
    }
  }

  static resetAll() {
    localStorage.clear();
    this.init();
  }

  // Invoices API
  static getInvoices() { return this.get(STORAGE_KEYS.INVOICES, INITIAL_INVOICES); }
  static saveInvoice(inv) {
    const list = this.getInvoices();
    const idx = list.findIndex(i => i.id === inv.id);
    if (idx >= 0) list[idx] = inv;
    else list.unshift(inv);
    this.set(STORAGE_KEYS.INVOICES, list);
    return inv;
  }
  static deleteInvoice(id) {
    const list = this.getInvoices().filter(i => i.id !== id);
    this.set(STORAGE_KEYS.INVOICES, list);
  }

  // Customers API
  static getCustomers() { return this.get(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS); }
  static saveCustomer(cust) {
    const list = this.getCustomers();
    const idx = list.findIndex(c => c.id === cust.id);
    if (idx >= 0) list[idx] = cust;
    else list.unshift(cust);
    this.set(STORAGE_KEYS.CUSTOMERS, list);
    return cust;
  }
  static deleteCustomer(id) {
    const list = this.getCustomers().filter(c => c.id !== id);
    this.set(STORAGE_KEYS.CUSTOMERS, list);
  }

  // Products API
  static getProducts() { return this.get(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS); }
  static saveProduct(prod) {
    const list = this.getProducts();
    const idx = list.findIndex(p => p.id === prod.id);
    if (idx >= 0) list[idx] = prod;
    else list.unshift(prod);
    this.set(STORAGE_KEYS.PRODUCTS, list);
    return prod;
  }
  static deleteProduct(id) {
    const list = this.getProducts().filter(p => p.id !== id);
    this.set(STORAGE_KEYS.PRODUCTS, list);
  }

  // Transactions API
  static getTransactions() { return this.get(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS); }
  static saveTransaction(tx) {
    const list = this.getTransactions();
    const idx = list.findIndex(t => t.id === tx.id);
    if (idx >= 0) list[idx] = tx;
    else list.unshift(tx);
    this.set(STORAGE_KEYS.TRANSACTIONS, list);
    return tx;
  }
  static deleteTransaction(id) {
    const list = this.getTransactions().filter(t => t.id !== id);
    this.set(STORAGE_KEYS.TRANSACTIONS, list);
  }

  // Loans API
  static getLoans() { return this.get(STORAGE_KEYS.LOANS, INITIAL_LOANS); }
  static saveLoan(loan) {
    const list = this.getLoans();
    const idx = list.findIndex(l => l.id === loan.id);
    if (idx >= 0) list[idx] = loan;
    else list.unshift(loan);
    this.set(STORAGE_KEYS.LOANS, list);
    return loan;
  }

  // Budgets API
  static getBudgets() { return this.get(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS); }
  static saveBudget(b) {
    const list = this.getBudgets();
    const idx = list.findIndex(item => item.id === b.id);
    if (idx >= 0) list[idx] = b;
    else list.push(b);
    this.set(STORAGE_KEYS.BUDGETS, list);
  }

  // Goals API
  static getGoals() { return this.get(STORAGE_KEYS.GOALS, INITIAL_GOALS); }
  static saveGoal(goal) {
    const list = this.getGoals();
    const idx = list.findIndex(g => g.id === goal.id);
    if (idx >= 0) list[idx] = goal;
    else list.unshift(goal);
    this.set(STORAGE_KEYS.GOALS, list);
    return goal;
  }

  // Settings API
  static getSettings() { return this.get(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS); }
  static saveSettings(s) { this.set(STORAGE_KEYS.SETTINGS, s); }

  // App Mode & Theme
  static getMode() { return this.get(STORAGE_KEYS.MODE, 'business'); }
  static setMode(m) { this.set(STORAGE_KEYS.MODE, m); }
  static getTheme() { return this.get(STORAGE_KEYS.THEME, 'dark'); }
  static setTheme(t) { this.set(STORAGE_KEYS.THEME, t); }
  static getLanguage() { return this.get(STORAGE_KEYS.LANGUAGE, 'en'); }
  static setLanguage(l) { this.set(STORAGE_KEYS.LANGUAGE, l); }
}

// Global Currency Formatter for Indian Rupee
function formatINR(val, showDecimals = false) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Number(val);
  const options = {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  };
  return num.toLocaleString('en-IN', options);
}

// Compact Number Formatter (e.g. ₹18.45 L)
function formatINRCompact(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Number(val);
  if (Math.abs(num) >= 10000000) {
    return '₹' + (num / 10000000).toFixed(2) + ' Cr';
  } else if (Math.abs(num) >= 100000) {
    return '₹' + (num / 100000).toFixed(2) + ' L';
  } else if (Math.abs(num) >= 1000) {
    return '₹' + (num / 1000).toFixed(1) + ' k';
  }
  return '₹' + num.toLocaleString('en-IN');
}

// Date Formatter
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Time Formatter
function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Auto-initialize store on load
DataStore.init();
