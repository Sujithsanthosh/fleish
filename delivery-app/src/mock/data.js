export const MOCK_RIDER = {
  name: "Rajesh Kumar",
  phone: "9876543210",
  vehicle: "Activa 6G - TS 09 EA 4582",
  rating: 4.9,
};

export const MOCK_ORDERS = [
  {
    id: 'DEL-9901',
    vendor: {
      name: 'Ramesh Meats',
      address: 'Shop 4, Market Road, Phase 1',
      phone: '9888877777',
      coords: { lat: 17.4486, lng: 78.3908 }
    },
    customer: {
      name: 'Amit Sahay',
      address: 'Flat 402, Green Heights, Jubilee Hills',
      phone: '9111122222',
      instructions: 'Deliver at the gate. Call before arrival.',
      otp: '4582',
      coords: { lat: 17.4325, lng: 78.4021 }
    },
    payment: 'Prepaid',
    earnings: 45,
    distance: '3.2 km',
    estTime: '20 mins',
    status: 'ASSIGNED',
  }
];

export const RIDER_EARNINGS = {
  today: 640,
  deliveries: 14,
  weekly: 4200,
};

export const ORDER_HISTORY = [
  { id: 'DEL-9855', date: 'April 08, 12:45 PM', earnings: 40, status: 'DELIVERED' },
  { id: 'DEL-9842', date: 'April 08, 11:20 AM', earnings: 55, status: 'DELIVERED' },
  { id: 'DEL-9810', date: 'April 07, 08:30 PM', earnings: 45, status: 'DELIVERED' },
];
