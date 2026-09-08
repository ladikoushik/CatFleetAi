import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { apiFetch } from '../services/api';
import { Building2, MapPin, Phone, Mail, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MOCK_DEALERS = [
  {
    id: 'd-1',
    dealerCode: 'CAT-DLR-MW01',
    name: 'MacAllister Machinery CAT',
    region: 'North America - Midwest',
    contactEmail: 'rentals@macallistercat.com',
    phone: '+1 (317) 545-2151',
    branches: [
      {
        id: 'b-1',
        name: 'Indianapolis Main Rental Hub',
        address: '7580 E 30th St',
        city: 'Indianapolis',
        state: 'IN',
        managerName: 'Robert Hayes',
      },
    ],
  },
  {
    id: 'd-2',
    dealerCode: 'CAT-DLR-TX02',
    name: 'HOLT CAT Texas',
    region: 'North America - South',
    contactEmail: 'support@holtcat.com',
    phone: '+1 (210) 648-1111',
    branches: [
      {
        id: 'b-2',
        name: 'San Antonio Central Yard',
        address: '3302 South W.W. White Rd',
        city: 'San Antonio',
        state: 'TX',
        managerName: 'Elena Rostova',
      },
    ],
  },
];

export const Dealers = () => {
  const { hasRole } = useAuth();
  const [dealers, setDealers] = useState(MOCK_DEALERS);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const data = await apiFetch('/dealers');
        if (Array.isArray(data) && data.length > 0) {
          setDealers(data);
        }
      } catch (err) {
        console.log('Using local dealer mock state');
      }
    };
    fetchDealers();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-sans flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-cat-yellow" />
            <span>Caterpillar Dealership Network & Branches</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Regional dealer franchises and branch inventory hubs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dealers.map((dealer) => (
          <div
            key={dealer.id}
            className="p-6 rounded-2xl bg-white dark:bg-cat-card border border-gray-200 dark:border-cat-borderDark shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cat-yellow font-mono">
                    {dealer.dealerCode}
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-sans">
                    {dealer.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Region: {dealer.region}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 my-4 p-3 rounded-xl bg-gray-50 dark:bg-cat-dark border border-gray-200 dark:border-cat-borderDark">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-cat-yellow" />
                  <span>{dealer.contactEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-cat-yellow" />
                  <span>{dealer.phone}</span>
                </div>
              </div>

              {/* Linked Branches */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Branch Inventory Hubs
                </h4>
                <div className="space-y-2">
                  {dealer.branches?.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-gray-100 dark:bg-cat-black border border-gray-200 dark:border-cat-borderDark flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{b.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {b.address}, {b.city} {b.state} • Manager: {b.managerName}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};
