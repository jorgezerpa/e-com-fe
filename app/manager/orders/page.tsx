'use client'
import { SectionFilters } from '@/components/SectionFilters';
import { SectionHeader } from '@/components/SectionHeader';
import React, { useState, useMemo } from 'react';

// --- Types (Based on Prisma Schema) ---
export enum OrderState {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  STUCK = 'STUCK',
  REFUNDED = 'REFUNDED',
}

export enum Currency {
  USD = 'USD',
  VES = 'VES',
}

export type OrderEvent = {
  id: number;
  state: OrderState;
  notes: string[]; // Format: [ISODateUTC]"reason"
  createdAt: string;
};

export type OrderItem = {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  currencyAtPurchase: Currency;
  nameAtPurchase: string;
  descriptionAtPurchase: string | null;
  skuAtPurchase: string | null;
};

export type Order = {
  id: number;
  state: OrderState;
  trackingToken: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;

  // Customer
  customer_firstName: string;
  customer_lastName: string;
  customer_whatsapp_number: string;
  customer_identification_number: string;
  customer_email: string | null;
  customer_address: string | null;

  // Shipping
  originFields: any | null;
  shipping_country: string;
  shipping_city: string;
  shipping_zipCode: string;
  shipping_name_at_purchase: string;
  shipping_description_at_purchase: string | null;
  shipping_provider_at_purchase: string;
  shipping_fields_at_purchase: any;
  shipping_fields_response: any;

  // Payment
  payment_name_at_purchase: string;
  payment_description_at_purchase: string | null;
  payment_provider_at_purchase: string;
  payment_fields_at_purchase: any;
  payment_fields_response: any;

  items: OrderItem[];
  orderEvents: OrderEvent[];
};

// --- Mock Data ---
const MOCK_ORDERS: Order[] = [
  {
    id: 1001,
    state: OrderState.PENDING,
    trackingToken: 'uuid-1234-abcd',
    totalAmount: 129.99,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    customer_firstName: 'John',
    customer_lastName: 'Doe',
    customer_whatsapp_number: '+1234567890',
    customer_identification_number: 'V-12345678',
    customer_email: 'john.doe@example.com',
    customer_address: '123 Main St, Apt 4B',
    originFields: null,
    shipping_country: 'Venezuela',
    shipping_city: 'Mérida',
    shipping_zipCode: '5101',
    shipping_name_at_purchase: 'Standard Delivery',
    shipping_description_at_purchase: '3-5 business days',
    shipping_provider_at_purchase: 'MRW',
    shipping_fields_at_purchase: { "Destination Agency": "Enter agency code" },
    shipping_fields_response: { "Destination Agency": "MRW-5101-CENTRAL" },
    payment_name_at_purchase: 'Zelle Transfer',
    payment_description_at_purchase: null,
    payment_provider_at_purchase: 'Zelle',
    payment_fields_at_purchase: { "Confirmation Ref": "Enter reference number" },
    payment_fields_response: { "Confirmation Ref": "192837465" },
    items: [
      { id: 1, quantity: 1, priceAtPurchase: 129.99, currencyAtPurchase: Currency.USD, nameAtPurchase: 'Smart Coffee Maker', descriptionAtPurchase: 'Brew coffee from your phone.', skuAtPurchase: 'SCM-22' }
    ],
    orderEvents: [
      { id: 1, state: OrderState.PENDING, notes: [`[${new Date().toISOString()}] "Order created by user"`], createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  },
  {
    id: 1002,
    state: OrderState.STUCK,
    trackingToken: 'uuid-5678-efgh',
    totalAmount: 45.00,
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    customer_firstName: 'Maria',
    customer_lastName: 'Gonzalez',
    customer_whatsapp_number: '+0987654321',
    customer_identification_number: 'V-87654321',
    customer_email: 'maria.g@example.com',
    customer_address: 'Av. Las Americas, Edif. El Sol',
    originFields: { "warehouse": "Mérida Norte" },
    shipping_country: 'Venezuela',
    shipping_city: 'Caracas',
    shipping_zipCode: '1010',
    shipping_name_at_purchase: 'Express Shipping',
    shipping_description_at_purchase: 'Next day delivery',
    shipping_provider_at_purchase: 'Zoom',
    shipping_fields_at_purchase: { "Home Delivery": "Provide exact instructions" },
    shipping_fields_response: { "Home Delivery": "Leave at the front desk" },
    payment_name_at_purchase: 'Pago Movil',
    payment_description_at_purchase: 'Interbank mobile payment',
    payment_provider_at_purchase: 'Mercantil',
    payment_fields_at_purchase: { "Phone": "Your registered phone", "Ref": "Last 4 digits" },
    payment_fields_response: { "Phone": "04141234567", "Ref": "4567" },
    items: [
      { id: 2, quantity: 2, priceAtPurchase: 22.50, currencyAtPurchase: Currency.USD, nameAtPurchase: 'Cotton T-Shirt', descriptionAtPurchase: 'Basic tee.', skuAtPurchase: 'TS-BLK-M' }
    ],
    orderEvents: [
      { id: 2, state: OrderState.PENDING, notes: [], createdAt: new Date(Date.now() - 259200000).toISOString() },
      { id: 3, state: OrderState.PROCESSING, notes: [`[${new Date().toISOString()}] "Payment verified"`], createdAt: new Date(Date.now() - 200000000).toISOString() },
      { id: 4, state: OrderState.STUCK, notes: [`[${new Date().toISOString()}] "Zoom agency closed due to power outage. Retrying tomorrow."`], createdAt: new Date(Date.now() - 172800000).toISOString() }
    ]
  },
  {
    id: 1003,
    state: OrderState.SHIPPED,
    trackingToken: 'uuid-9012-ijkl',
    totalAmount: 199.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer_firstName: 'Carlos',
    customer_lastName: 'Perez',
    customer_whatsapp_number: '+1122334455',
    customer_identification_number: 'E-11223344',
    customer_email: null,
    customer_address: null,
    originFields: null,
    shipping_country: 'Venezuela',
    shipping_city: 'Valencia',
    shipping_zipCode: '2001',
    shipping_name_at_purchase: 'Pickup',
    shipping_description_at_purchase: 'Pickup at store',
    shipping_provider_at_purchase: 'Internal',
    shipping_fields_at_purchase: {},
    shipping_fields_response: {},
    payment_name_at_purchase: 'Cash',
    payment_description_at_purchase: 'Pay at store',
    payment_provider_at_purchase: 'Physical',
    payment_fields_at_purchase: {},
    payment_fields_response: {},
    items: [
      { id: 3, quantity: 1, priceAtPurchase: 199.99, currencyAtPurchase: Currency.USD, nameAtPurchase: 'Wireless Headphones', descriptionAtPurchase: null, skuAtPurchase: 'WH-001' }
    ],
    orderEvents: [
      { id: 5, state: OrderState.PENDING, notes: [], createdAt: new Date().toISOString() },
      { id: 6, state: OrderState.SHIPPED, notes: [`[${new Date().toISOString()}] "Customer picked up the item at branch A"`], createdAt: new Date().toISOString() }
    ]
  }
];

// --- Utilities ---
const getStateColors = (state: OrderState) => {
  switch (state) {
    case OrderState.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case OrderState.PROCESSING: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case OrderState.SHIPPED: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    case OrderState.FINISHED: return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800';
    case OrderState.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800';
    case OrderState.STUCK: return 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-400 border-pink-200 dark:border-pink-800';
    case OrderState.REFUNDED: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
  }
};

const parseNote = (noteStr: string) => {
  // Matches [ISODateUTC]"reason"
  const regex = /^\[(.*?)\]\s*"(.*)"$/;
  const match = noteStr.match(regex);
  if (match) {
    return { date: new Date(match[1]).toLocaleString(), reason: match[2] };
  }
  return { date: null, reason: noteStr };
};

// --- Icons ---
const EyeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ExportIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const UserIcon = () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const TruckIcon = () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const CreditCardIcon = () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const BoxIcon = () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;


// --- Main Component ---
export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Filters
  const [filterState, setFilterState] = useState<string>('');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [stateOrder, setStateOrder] = useState<Order | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Derived Data
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchState = filterState === '' || order.state === filterState;
      const orderDate = new Date(order.createdAt).getTime();
      const matchStart = dateStart ? orderDate >= new Date(dateStart).getTime() : true;
      const matchEnd = dateEnd ? orderDate <= new Date(dateEnd).getTime() + 86400000 : true; // +1 day to include end of day
      return matchState && matchStart && matchEnd;
    });
  }, [orders, filterState, dateStart, dateEnd]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateState = (orderId: number, newState: OrderState, newNote: string) => {
    console.log(`Update Order ${orderId} to ${newState} with note: ${newNote}`);
    
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const formattedNote = newNote ? `[${new Date().toISOString()}] "${newNote}"` : null;
        const newEvent: OrderEvent = {
          id: Date.now(),
          state: newState,
          notes: formattedNote ? [formattedNote] : [],
          createdAt: new Date().toISOString()
        };
        return { ...o, state: newState, orderEvents: [...o.orderEvents, newEvent] };
      }
      return o;
    }));
    setStateOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        <SectionHeader title='Ordenes' description='Organiza tus ordenes' buttonLabel='exportar ordenes' buttonAction={() => setIsExportModalOpen(true)} />
        <SectionFilters 
          searchBars={[]}
          dropdownAllSelectedLabel='Todos'
          dropdowns={[
            { title:"Filtrar por estados", items: Object.values(OrderState).map(state => ({ label:state, value:state })), value: filterState, handleChangeValue: (e) => { setFilterState(e.target.value); setCurrentPage(1); } }
          ]}
          datePickers={[
            { date: dateStart, handleChangeDate: (e) => { setDateStart(e.target.value); setCurrentPage(1); }, title: "Desde" },
            { date: dateEnd, handleChangeDate: (e) => { setDateEnd(e.target.value); setCurrentPage(1); }, title: "Hasta" },
          ]}
        />
      

        {/* Table Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">State</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">
                        #{order.id}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900 dark:text-white font-medium">{order.customer_firstName} {order.customer_lastName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{order.customer_identification_number}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-900 dark:text-white">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => setStateOrder(order)}
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border cursor-pointer hover:shadow-md transition-all ${getStateColors(order.state)}`}
                          title="Click to change state"
                        >
                          {order.state}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        >
                          <EyeIcon /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination UI */}
          {totalPages > 1 && (
             <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
               <span className="text-sm text-gray-600 dark:text-gray-400">
                 Page {currentPage} of {totalPages}
               </span>
               <div className="flex gap-2">
                 <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-50 text-sm">Prev</button>
                 <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-50 text-sm">Next</button>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
      {stateOrder && <StateManagementModal order={stateOrder} onClose={() => setStateOrder(null)} onSave={handleUpdateState} />}
      {isExportModalOpen && <ExportModal onClose={() => setIsExportModalOpen(false)} />}
    </div>
  );
}

// --- Order Detail Modal ---
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto border border-gray-200 dark:border-gray-700">
        
        {/* Header Fixed */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              Order #{order.id}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStateColors(order.state)}`}>
                {order.state}
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-600 dark:text-gray-300">
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Customer Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                <UserIcon /> Customer Details
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium text-gray-900 dark:text-white">Name:</span> {order.customer_firstName} {order.customer_lastName}</p>
                <p><span className="font-medium text-gray-900 dark:text-white">ID:</span> {order.customer_identification_number}</p>
                <p><span className="font-medium text-gray-900 dark:text-white">WhatsApp:</span> {order.customer_whatsapp_number}</p>
                {order.customer_email && <p><span className="font-medium text-gray-900 dark:text-white">Email:</span> {order.customer_email}</p>}
              </div>
            </div>

            {/* Shipping Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                <TruckIcon /> Shipping Info
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium text-gray-900 dark:text-white">Provider:</span> {order.shipping_provider_at_purchase} - {order.shipping_name_at_purchase}</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Location:</span> {order.shipping_city}, {order.shipping_country} ({order.shipping_zipCode})</p>
                {order.customer_address && <p><span className="font-medium text-gray-900 dark:text-white">Address:</span> {order.customer_address}</p>}
                
                {Object.entries(order.shipping_fields_response || {}).length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Additional Fields:</p>
                    {Object.entries(order.shipping_fields_response).map(([key, val]) => (
                      <p key={key} className="text-xs"><span className="font-medium">{key}:</span> {String(val)}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                <CreditCardIcon /> Payment Details
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium text-gray-900 dark:text-white">Method:</span> {order.payment_provider_at_purchase} - {order.payment_name_at_purchase}</p>
                <p><span className="font-medium text-gray-900 dark:text-white">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
                
                {Object.entries(order.payment_fields_response || {}).length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Transaction Details:</p>
                    {Object.entries(order.payment_fields_response).map(([key, val]) => (
                      <p key={key} className="text-xs"><span className="font-medium">{key}:</span> {String(val)}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Items Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
              <BoxIcon /> Order Items
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">SKU</th>
                    <th className="p-4 font-medium text-center">Qty</th>
                    <th className="p-4 font-medium text-right">Unit Price</th>
                    <th className="p-4 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {order.items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="p-4">
                        <p className="font-medium text-gray-900 dark:text-white">{item.nameAtPurchase}</p>
                        {item.descriptionAtPurchase && <p className="text-xs text-gray-500 truncate max-w-xs">{item.descriptionAtPurchase}</p>}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{item.skuAtPurchase || '-'}</td>
                      <td className="p-4 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</td>
                      <td className="p-4 text-right text-gray-500 dark:text-gray-400">${Number(item.priceAtPurchase).toFixed(2)} {item.currencyAtPurchase}</td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">${(item.quantity * item.priceAtPurchase).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <td colSpan={4} className="p-4 text-right font-bold text-gray-700 dark:text-gray-300">Total:</td>
                    <td className="p-4 text-right font-bold text-lg text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- State Management Modal ---
function StateManagementModal({ order, onClose, onSave }: { order: Order; onClose: () => void; onSave: (id: number, state: OrderState, note: string) => void }) {
  const [newState, setNewState] = useState<OrderState>(order.state);
  const [newNote, setNewNote] = useState('');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Order State</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><CloseIcon /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New State</label>
              <select
                value={newState}
                onChange={e => setNewState(e.target.value as OrderState)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {Object.values(OrderState).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Note (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Package given to courier. Tracking #12345"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
            </div>
            <button
              onClick={() => onSave(order.id, newState, newNote)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Confirm Update
            </button>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 uppercase tracking-wide">State History</h4>
            {order.orderEvents.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No history available.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                {[...order.orderEvents].reverse().map((event, idx) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Marker */}
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-600 text-xs font-bold text-gray-500 dark:text-gray-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${idx === 0 ? 'bg-blue-500 dark:bg-blue-500 border-blue-100 text-white' : ''}`}>
                      {idx === 0 ? <span className="w-2 h-2 bg-white rounded-full"></span> : null}
                    </div>
                    
                    {/* Content */}
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStateColors(event.state)}`}>{event.state}</span>
                        <time className="text-[10px] text-gray-500 font-medium">{new Date(event.createdAt).toLocaleDateString()}</time>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                        {event.notes.length > 0 ? (
                          event.notes.map((noteStr, i) => {
                            const parsed = parseNote(noteStr);
                            return (
                              <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded border border-gray-100 dark:border-gray-700">
                                {parsed.date && <span className="block text-[9px] text-gray-400 mb-0.5">{parsed.date}</span>}
                                <span>{parsed.reason}</span>
                              </div>
                            );
                          })
                        ) : (
                          <span className="italic opacity-50">System state change</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Export Config Modal ---
function ExportModal({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState('excel');
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ExportIcon /> Export Orders
          </h3>
        </div>
        
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="radio" name="format" value="excel" checked={format === 'excel'} onChange={() => setFormat('excel')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">CSV (.csv)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={() => setFormat('pdf')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">PDF Document (.pdf)</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500" />
              <div>
                <span className="block text-sm font-bold text-red-600 dark:text-red-400">Delete after export</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">Danger: This will permanently remove all exported orders from the database.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={() => { console.log('Export UI clicked'); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 rounded-lg transition-colors">Download File</button>
        </div>
      </div>
    </div>
  );
}