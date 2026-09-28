const configuredApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
const API_BASE_URL = `${configuredApiUrl.replace(/\/$/, '')}/api`;

// Helper HTTP Fetcher
async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API Request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

// 1. User Authentication & Registration APIs
export const loginApi = async (email, password) => {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerApi = async (userData) => {
  return await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// 2. Specific User Maintenance Billing APIs (Given vs Pending vs Delayed)
export const fetchUserBillApi = async (userId) => {
  return await request(`/maintenance/my-bill?userId=${userId}`);
};

export const payMaintenanceApi = async (userId, method, txnRecord) => {
  return await request('/maintenance/pay', {
    method: 'POST',
    body: JSON.stringify({ userId, method, txnRecord }),
  });
};

export const resetMaintenanceDemoApi = async (userId) => {
  return await request('/maintenance/reset-demo', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};

// 3. Admin All Units Status API (Given vs Delayed summary across Blocks)
export const fetchAdminUnitsSummaryApi = async () => {
  return await request('/admin/units-maintenance');
};

// 4. Community Notices APIs
export const fetchNoticesApi = async () => {
  return await request('/notices');
};

export const createNoticeApi = async (noticeData) => {
  return await request('/notices', {
    method: 'POST',
    body: JSON.stringify(noticeData),
  });
};

// 5. Gallery APIs
export const fetchGalleryApi = async () => {
  return await request('/gallery');
};

export const createGalleryPhotoApi = async (photoData) => {
  return await request('/gallery', {
    method: 'POST',
    body: JSON.stringify(photoData),
  });
};
