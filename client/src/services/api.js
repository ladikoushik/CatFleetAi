// REST API Client Layer with Bearer Auth

const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cat_fleetbrain_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const DEMO_USERS = [
  {
    role: 'Admin',
    name: 'Alex Vance',
    email: 'admin@catfleet.com',
    password: 'password123',
    company: 'Caterpillar Corporate Fleet HQ',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    role: 'Dealer_Manager',
    name: 'Sarah Connor',
    email: 'dealer@catfleet.com',
    password: 'password123',
    company: 'MacAllister Machinery - Midwest',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    role: 'Rental_Analyst',
    name: 'Marcus Brody',
    email: 'analyst@catfleet.com',
    password: 'password123',
    company: 'CAT Fleet Analytics Operations',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    role: 'Customer',
    name: 'David Miller',
    email: 'customer@catfleet.com',
    password: 'password123',
    company: 'Apex Heavy Infra LLC',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
];
