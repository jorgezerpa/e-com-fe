'use client'
import { getOrders, updateOrder } from '@/apiHandlers/orders';
import { SectionFilters } from '@/components/SectionFilters';
import { SectionHeader } from '@/components/SectionHeader';
import { RowItem, SectionTable } from '@/components/SectionTable';
import { BoxIcon, CloseIcon, CreditCardIcon, ExportIcon, EyeIcon, TruckIcon, UserIcon } from '@/icons';
import { Order, OrderEvent, OrderState } from '@/types';
import { useParams } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';


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


// --- Main Component ---
export default function OrderManagement() {
  const params = useParams()
  const companyId = params.id

  const [orders, setOrders] = useState<Order[]>([]);

  // Filters
  const [filterState, setFilterState] = useState<string>('');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');

  // Modals
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [stateOrder, setStateOrder] = useState<Order | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(()=>{
    fetchData()
  }, [filterState, dateStart, dateEnd])

  const fetchData = async() => {
    const ordersResult = await getOrders(Number(companyId), { state: filterState, from: dateStart, to: dateEnd })
    setOrders(ordersResult)
  }

  const handleUpdateState = async(orderId: number, newState: OrderState, newNote: string) => {
    await updateOrder(orderId, { state: newState, notes: newNote })
    await fetchData()
    setStateOrder(null);
  };

    const getRowItems = () => {
      if(orders.length === 0) return []
      const rows: RowItem[] = []

      for(let i = 0; i<orders.length; i++) {
        rows.push(
          { 
            id: orders[i].id, 
            disabled: false, 
            cells: [
              { type: "string", value: orders[i].id.toString() }, 
              { type: "string", value: orders[i].createdAt }, 
              { type: "titleAndSubtitle", title: orders[i].customer_firstName + " " + orders[i].customer_lastName, subtitle: orders[i].customer_email || "" }, 
              { type: "string", value: orders[i].totalAmount.toString() }, 
              { type: "coloredButton", label: orders[i].state, class: getStateColors(orders[i].state), action: () => setStateOrder(orders[i]) }, 
            ] 
          }
        )
      }
      return rows
    }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        <SectionHeader title='Ordenes' description='Organiza tus ordenes' buttonLabel='exportar ordenes' buttonAction={() => setIsExportModalOpen(true)} />
        <SectionFilters 
          searchBars={[]}
          dropdownAllSelectedLabel='Todos'
          dropdowns={[
            { title:"Filtrar por estados", items: Object.values(OrderState).map(state => ({ label:state, value:state })), value: filterState, handleChangeValue: (e) => { setFilterState(e.target.value); } }
          ]}
          datePickers={[
            { date: dateStart, handleChangeDate: (e) => { setDateStart(e.target.value); }, title: "Desde" },
            { date: dateEnd, handleChangeDate: (e) => { setDateEnd(e.target.value); }, title: "Hasta" },
          ]}
        />
      
        <SectionTable 
          columns={[
            { label: "Order Id", key: "key" },
            { label: "Date", key: "key" },
            { label: "Customer", key: "key" },
            { label: "Total", key: "key" },
            { label: "State", key: "key" },
          ]}
          rows={getRowItems()}
          actions={[
            { icon: "eye", label:"detalles", handleClick: (id:string|number) => { const order = orders.find(o => o.id == id); setViewOrder(order||null) } }
          ]}
          
        />
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
                <p><span className="font-medium text-gray-900 dark:text-white">Total Amount:</span> ${order.totalAmount}</p>
                
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
                    <td className="p-4 text-right font-bold text-lg text-gray-900 dark:text-white">${order.totalAmount}</td>
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