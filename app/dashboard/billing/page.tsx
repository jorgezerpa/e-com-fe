'use client'
import { Navbar } from '@/components/Navbar';
import React from 'react';

// Icons placeholders
const CreditCardIcon = () => <div className="w-6 h-6 bg-gray-200 rounded-full" />;
const HistoryIcon = () => <div className="w-6 h-6 bg-gray-200 rounded-full" />;

export default function BillingDashboard() {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Billing & Subscription</h1>
          <p className="text-gray-500">Manage your plan, payment methods, and view your history.</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold dark:text-white">Professional Plan</h2>
              <p className="text-sm text-gray-500">Next billing date: April 30, 2026</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">$29.00 / month</span>
          </div>
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
            Upgrade Plan
          </button>
        </div>

        {/* Payment Method Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">
              <CreditCardIcon /> Payment Method
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="font-bold dark:text-white">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 12/28</p>
            </div>
            <button className="mt-4 text-sm text-blue-600 font-bold hover:underline">Update Method</button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">
              <HistoryIcon /> Billing History
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span className="dark:text-gray-300">Mar 30, 2026</span>
                <span className="font-bold dark:text-white">$29.00</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="dark:text-gray-300">Feb 28, 2026</span>
                <span className="font-bold dark:text-white">$29.00</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="dark:text-gray-300">Jan 30, 2026</span>
                <span className="font-bold dark:text-white">$29.00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 text-center">
          Need help with your billing? Contact <a href="#" className="underline">support@yourcompany.com</a>
        </p>
      </div>
    </div>
  );
}