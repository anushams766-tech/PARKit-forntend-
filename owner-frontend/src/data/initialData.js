// Clean, realistic initial data for PARKit Smart Parking Platform
export const INITIAL_LOCATIONS = [
  {
    id: "LOC-01",
    name: "PARKit Tech Park - Main Lot",
    level: "Ground Floor - Area A",
    address: "Innovation Center Ground Floor, Sector 5, Bengaluru, KA 560100",
    latitude: 12.9716,
    longitude: 77.5946,
    googleMapsUrl: "https://maps.google.com/?q=12.9716,77.5946",
    totalSpots: 6,
    hourlyRate: 40,
    availableHours: "24/7 (Mon - Sun)",
    currency: "INR",
    cameraId: "CAM-01",
    cameraName: "Overhead Smartphone Cam (Miniature Model)",
    streamUrl: "http://192.168.1.105:8080/video",
    isActive: true,
    createdAt: "2026-11-06T10:00:00Z",
    description: "Physical miniature 6-bay parking model monitored via top-down smartphone camera and OpenCV pipeline."
  },
  {
    id: "LOC-02",
    name: "PARKit Downtown Smart Plaza",
    level: "Level B1 - North Sector",
    address: "MG Road Commercial Complex, Level B1, Bengaluru",
    latitude: 12.9754,
    longitude: 77.6095,
    googleMapsUrl: "https://maps.google.com/?q=12.9754,77.6095",
    totalSpots: 8,
    hourlyRate: 60,
    availableHours: "06:00 AM - 11:00 PM",
    currency: "INR",
    cameraId: "CAM-02",
    cameraName: "Plaza High-Angle RTSP Cam",
    streamUrl: "rtsp://admin:pass@192.168.1.120:554/stream1",
    isActive: true,
    createdAt: "2026-11-05T14:30:00Z",
    description: "Registered real-world multi-slot test facility."
  }
];

export const INITIAL_SPOTS = [
  {
    id: "spot-1",
    spotNumber: "Spot 1",
    spotCode: "P1",
    locationId: "LOC-01",
    level: "Ground Floor - Bay 1",
    status: "AVAILABLE", // 'AVAILABLE' | 'PARKED' | 'NEEDS_CHECK'
    cameraReading: "AVAILABLE",
    confidence: 0.98,
    vehicleInfo: null,
    emptyDuration: "1 hr 45 mins",
    lastChecked: "Just now",
    notes: "Reference background verified empty",
    manualOverride: null
  },
  {
    id: "spot-2",
    spotNumber: "Spot 2",
    spotCode: "P2",
    locationId: "LOC-01",
    level: "Ground Floor - Bay 2",
    status: "PARKED",
    cameraReading: "PARKED",
    confidence: 0.94,
    vehicleInfo: "Red Hatchback (KA-05-MQ-4821)",
    driverName: "Rahul Sharma",
    parkedSince: "48 mins ago",
    lastChecked: "2 mins ago",
    notes: "Vehicle contours detected inside parking bay boundaries",
    manualOverride: null
  },
  {
    id: "spot-3",
    spotNumber: "Spot 3",
    spotCode: "P3",
    locationId: "LOC-01",
    level: "Ground Floor - Bay 3",
    status: "AVAILABLE",
    cameraReading: "AVAILABLE",
    confidence: 0.97,
    vehicleInfo: null,
    emptyDuration: "3 hrs 10 mins",
    lastChecked: "Just now",
    notes: "Clean bay surface, no obstruction detected",
    manualOverride: null
  },
  {
    id: "spot-4",
    spotNumber: "Spot 4",
    spotCode: "P4",
    locationId: "LOC-01",
    level: "Ground Floor - Bay 4",
    status: "PARKED",
    cameraReading: "PARKED",
    confidence: 0.91,
    vehicleInfo: "Blue SUV (KA-01-AB-1903)",
    driverName: "Priya Nair",
    parkedSince: "1 hr 50 mins ago",
    lastChecked: "Just now",
    notes: "Vehicle identified at designated boundaries",
    manualOverride: null
  },
  {
    id: "spot-5",
    spotNumber: "Spot 5",
    spotCode: "P5",
    locationId: "LOC-01",
    level: "Ground Floor - Bay 5",
    status: "NEEDS_CHECK",
    cameraReading: "UNCERTAIN",
    confidence: 0.58,
    vehicleInfo: "Ambiguous contour / shadow",
    driverName: null,
    parkedSince: null,
    emptyDuration: null,
    lastChecked: "1 min ago",
    notes: "Confidence score below threshold (58%). Requires manual confirmation.",
    manualOverride: null
  },
  {
    id: "spot-6",
    spotNumber: "Spot 6",
    spotCode: "P6",
    locationId: "LOC-01",
    level: "Ground Floor - Bay 6",
    status: "AVAILABLE",
    cameraReading: "AVAILABLE",
    confidence: 0.99,
    vehicleInfo: null,
    emptyDuration: "4 hrs 20 mins",
    lastChecked: "Just now",
    notes: "Clear and ready for parking",
    manualOverride: null
  }
];

export const INITIAL_CAMERA = {
  id: "CAM-01",
  locationId: "LOC-01",
  name: "Smartphone Overhead Cam (Miniature Model)",
  status: "ONLINE", // 'ONLINE' | 'OFFLINE'
  address: "http://192.168.1.105:8080/video",
  videoQuality: "1080p @ 30 FPS",
  latency: "42 ms",
  droppedFrames: "0 frames (0.0%)",
  lastSignal: "Just now",
  lastUpdated: new Date().toLocaleTimeString(),
  isDetectionActive: true
};

export const INITIAL_PAYMENTS = [
  {
    id: "TXN-9081",
    driver: "Rahul Sharma",
    spot: "Spot 2",
    timeParked: "48 mins",
    amount: 40,
    currency: "INR",
    status: "SUCCEEDED", // 'SUCCEEDED' | 'FAILED'
    date: "Today, 10:45 AM",
    paymentMethod: "Stripe Test Card (•••• 4242)"
  },
  {
    id: "TXN-9082",
    driver: "Priya Nair",
    spot: "Spot 4",
    timeParked: "1 hr 50 mins",
    amount: 80,
    currency: "INR",
    status: "SUCCEEDED",
    date: "Today, 09:30 AM",
    paymentMethod: "Stripe Test Card (•••• 4242)"
  },
  {
    id: "TXN-9083",
    driver: "Amit Verma",
    spot: "Spot 1",
    timeParked: "3 hrs 10 mins",
    amount: 120,
    currency: "INR",
    status: "SUCCEEDED",
    date: "Today, 07:15 AM",
    paymentMethod: "Stripe Test Card (•••• 4242)"
  },
  {
    id: "TXN-9084",
    driver: "Vikram Malhotra",
    spot: "Spot 5",
    timeParked: "15 mins",
    amount: 40,
    currency: "INR",
    status: "FAILED",
    date: "Today, 06:50 AM",
    paymentMethod: "Stripe Declined Card (•••• 0002)"
  },
  {
    id: "TXN-9085",
    driver: "Sneha Rao",
    spot: "Spot 3",
    timeParked: "2 hrs 00 mins",
    amount: 80,
    currency: "INR",
    status: "SUCCEEDED",
    date: "Yesterday, 08:20 PM",
    paymentMethod: "Stripe Test Card (•••• 4242)"
  }
];

export const INITIAL_STATUS_HISTORY = [
  {
    id: "HIST-001",
    spot: "Spot 3",
    changedTo: "AVAILABLE",
    changedBy: "Alex Vance (Owner)",
    reason: "Verified empty after driver departed",
    time: "Today, 11:20 AM"
  },
  {
    id: "HIST-002",
    spot: "Spot 5",
    changedTo: "NEEDS_CHECK",
    changedBy: "Camera Detection System",
    reason: "Lighting glare caused ambiguous contour threshold",
    time: "Today, 10:55 AM"
  },
  {
    id: "HIST-003",
    spot: "Spot 2",
    changedTo: "PARKED",
    changedBy: "Camera Detection System",
    reason: "Vehicle arrival confirmed by OpenCV pipeline",
    time: "Today, 10:45 AM"
  },
  {
    id: "HIST-004",
    spot: "Spot 1",
    changedTo: "AVAILABLE",
    changedBy: "Alex Vance (Owner)",
    reason: "Cleared bay after checkout",
    time: "Today, 08:30 AM"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-1",
    title: "Vehicle Parked in Spot 2",
    message: "Red Hatchback (KA-05-MQ-4821) checked into Spot 2.",
    time: "48 mins ago",
    unread: true,
    type: "parking"
  },
  {
    id: "NOTIF-2",
    title: "Spot 5 Needs Attention",
    message: "Camera confidence is 58% on Spot 5 due to shadows.",
    time: "1 hr ago",
    unread: true,
    type: "warning"
  },
  {
    id: "NOTIF-3",
    title: "Payment Received: ₹40",
    message: "Stripe test payment successful for Spot 2 (Txn #TXN-9081).",
    time: "48 mins ago",
    unread: false,
    type: "payment"
  },
  {
    id: "NOTIF-4",
    title: "Camera Signal Stable",
    message: "Overhead Camera CAM-01 connection confirmed at 1080p @ 30 FPS.",
    time: "2 hrs ago",
    unread: false,
    type: "camera"
  }
];
