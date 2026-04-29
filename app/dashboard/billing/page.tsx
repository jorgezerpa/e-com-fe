'use client'
import { Navbar } from '@/components/Navbar';
import React from 'react';

// Icons placeholders
const CreditCardIcon = () => <div className="w-6 h-6 bg-blue-100 dark:bg-gray-700 rounded-full" />;
const HistoryIcon = () => <div className="w-6 h-6 bg-blue-100 dark:bg-gray-700 rounded-full" />;

export default function BillingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your plan, payment methods, and view your history.</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Professional Plan</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next billing date: April 30, 2026</p>
            </div>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 dark:border-blue-800">
              $29.00 / month
            </span>
          </div>
          <button className="mt-8 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
            Upgrade Plan
          </button>
        </div>

        {/* Payment Method Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCardIcon /> Payment Method
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="font-bold text-slate-800 dark:text-white">Visa ending in 4242</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/28</p>
            </div>
            <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Update Method
            </button>
          </div>

          {/* History Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <HistoryIcon /> Billing History
            </h3>
            <ul className="space-y-4">
              {[
                { date: 'Mar 30, 2026', price: '$29.00' },
                { date: 'Feb 28, 2026', price: '$29.00' },
                { date: 'Jan 30, 2026', price: '$29.00' }
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm items-center">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{item.date}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Need help with your billing? Contact <a href="mailto:support@yourcompany.com" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">support@yourcompany.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}