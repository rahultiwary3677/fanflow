/**
 * Venue Data Service
 * 
 * Provides simulated real-time venue data for Apex Arena.
 * In a production system, this would connect to IoT sensors,
 * ticketing APIs, and crowd analytics platforms.
 */

// Simulated venue zones with real-time crowd data
export const venueZones = [
  {
    id: 'north',
    name: 'North Stand',
    gate: 'Gate A',
    crowdLevel: 0.65,
    status: 'moderate',
    label: 'Moderate',
    x: 50,
    y: 12,
  },
  {
    id: 'south',
    name: 'South Stand',
    gate: 'Gate B',
    crowdLevel: 0.92,
    status: 'heavy',
    label: 'Heavy',
    x: 50,
    y: 88,
  },
  {
    id: 'east',
    name: 'East Stand',
    gate: 'Gate C',
    crowdLevel: 0.35,
    status: 'low',
    label: 'Low',
    x: 88,
    y: 50,
  },
  {
    id: 'west',
    name: 'West Stand',
    gate: 'Gate D',
    crowdLevel: 0.60,
    status: 'moderate',
    label: 'Moderate',
    x: 12,
    y: 50,
  },
];

// Points of interest within the venue
export const pointsOfInterest = [
  { id: 'restroom-n', name: 'North Restrooms', type: 'restroom', wait: 3, x: 35, y: 18 },
  { id: 'restroom-s', name: 'South Restrooms', type: 'restroom', wait: 8, x: 65, y: 82 },
  { id: 'restroom-e', name: 'East Restrooms', type: 'restroom', wait: 1, x: 82, y: 40 },
  { id: 'restroom-w', name: 'West Restrooms', type: 'restroom', wait: 5, x: 18, y: 60 },
  { id: 'food-a1', name: 'Stand A1 (North)', type: 'food', wait: 4, x: 40, y: 8 },
  { id: 'food-b2', name: 'Stand B2 (South)', type: 'food', wait: 12, x: 60, y: 92 },
  { id: 'food-c3', name: 'Stand C3 (East)', type: 'food', wait: 2, x: 92, y: 55 },
  { id: 'food-d4', name: 'Stand D4 (West)', type: 'food', wait: 1, x: 8, y: 45, premium: true },
  { id: 'first-aid', name: 'First Aid Station', type: 'medical', wait: 0, x: 50, y: 50 },
  { id: 'merch', name: 'Merchandise Store', type: 'shop', wait: 6, x: 30, y: 50 },
];

// Match / event data
export const eventData = {
  name: 'Premier League Final',
  teams: { home: 'City FC', away: 'United FC' },
  score: { home: 2, away: 1 },
  minute: 62,
  half: 'Second Half',
  venue: 'Apex Arena',
  capacity: 60000,
  attendance: 52200,
  weather: { condition: 'Clear', temp: 24 },
};

// Concession menu items
export const menuItems = [
  { id: 1, name: 'Classic Hot Dog', price: 6.99, emoji: '🌭', category: 'food', prepTime: 2 },
  { id: 2, name: 'Loaded Nachos', price: 8.99, emoji: '🧀', category: 'food', prepTime: 3 },
  { id: 3, name: 'Margherita Pizza', price: 9.99, emoji: '🍕', category: 'food', prepTime: 5 },
  { id: 4, name: 'Chicken Wings', price: 10.99, emoji: '🍗', category: 'food', prepTime: 6 },
  { id: 5, name: 'Soft Pretzel', price: 4.99, emoji: '🥨', category: 'food', prepTime: 1 },
  { id: 6, name: 'Premium Burger', price: 12.99, emoji: '🍔', category: 'food', prepTime: 5 },
  { id: 7, name: 'Draft Beer', price: 8.99, emoji: '🍺', category: 'drink', prepTime: 1 },
  { id: 8, name: 'Soft Drink', price: 3.99, emoji: '🥤', category: 'drink', prepTime: 1 },
  { id: 9, name: 'Coffee', price: 4.49, emoji: '☕', category: 'drink', prepTime: 2 },
  { id: 10, name: 'Water Bottle', price: 2.99, emoji: '💧', category: 'drink', prepTime: 0 },
  { id: 11, name: 'Ice Cream', price: 5.99, emoji: '🍦', category: 'food', prepTime: 1 },
  { id: 12, name: 'Popcorn', price: 5.49, emoji: '🍿', category: 'food', prepTime: 1 },
];

// Notification alerts
export const smartAlerts = [
  {
    id: 1,
    type: 'info',
    title: 'Best Time to Move',
    message: 'East concourse is nearly empty. Great time to grab food or visit restrooms!',
    time: '2 min ago',
    icon: '💡',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Congestion Alert',
    message: 'South Stand exits are heavily congested. Consider using Gate C (East) instead.',
    time: '5 min ago',
    icon: '⚠️',
  },
  {
    id: 3,
    type: 'success',
    title: 'Your Order is Ready',
    message: 'Your food order #4281 is ready for pickup at Stand C3 (East Grab & Go).',
    time: '8 min ago',
    icon: '✅',
  },
];

/**
 * Get recommended route between two points.
 * Returns waypoints, estimated time, and congestion warnings.
 */
export function getRecommendedRoute(fromId, toId) {
  // In production this would use Google Maps Directions API
  // with crowd-density overlay to weight paths
  const routes = [
    {
      name: 'East Corridor (Recommended)',
      time: '3 min',
      congestion: 'low',
      steps: [
        'Head east from your current position',
        'Take the East corridor (near Gate C)',
        'Follow signs to your destination',
      ],
    },
    {
      name: 'North Concourse',
      time: '5 min',
      congestion: 'moderate',
      steps: [
        'Head north along the inner concourse',
        'Pass through the North Food Court area',
        'Turn and continue to your destination',
      ],
    },
    {
      name: 'South Concourse (Avoid)',
      time: '9 min',
      congestion: 'heavy',
      steps: [
        'Not recommended due to heavy congestion',
      ],
    },
  ];
  return routes;
}
