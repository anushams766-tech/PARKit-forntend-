// Country, State, District and Locality Hierarchy
// Comprehensive dataset supporting multiple countries, all Indian States & Union Territories,
// all Karnataka districts, and full Mysuru (Mysore) localities.

export const LOCATION_HIERARCHY = [
  {
    code: 'IN',
    name: 'India',
    states: [
      {
        code: 'KA',
        name: 'Karnataka',
        districts: [
          {
            name: 'Mysore (Mysuru)',
            localities: [
              'Vijayanagar',
              'Kuvempunagar',
              'Jayalakshmipuram',
              'Gokulam',
              'Saraswathipuram',
              'Bannimantap',
              'Hebbal',
              'Hootagalli',
              'Dattagalli',
              'Nazarbad',
              'Devaraja Mohalla',
              'Mandi Mohalla',
              'Chamundipuram',
              'Yadavagiri',
              'Siddhartha Layout',
              'Ramakrishnanagar',
              'Bogadi',
              'Alanahalli',
              'JP Nagar',
              'Vontikoppal',
              'Lashkar Mohalla',
            ],
          },
          {
            name: 'Bangalore Urban (Bengaluru)',
            localities: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City', 'Malleshwaram'],
          },
          {
            name: 'Bangalore Rural',
            localities: ['Devanahalli', 'Nelamangala', 'Doddaballapura', 'Hosakote'],
          },
          {
            name: 'Dakshina Kannada (Mangalore)',
            localities: ['Hampankatta', 'Kadri', 'Bejai', 'Kankanady', 'Surathkal'],
          },
          {
            name: 'Udupi',
            localities: ['Manipal', 'Malpe', 'Karkala', 'Kundapura'],
          },
          {
            name: 'Belagavi (Belgaum)',
            localities: ['Tilakwadi', 'Camp', 'Shahapur', 'Khanapur'],
          },
          {
            name: 'Hubballi-Dharwad',
            localities: ['Vidyanagar', 'Keshwapur', 'Gokul Road', 'Dharwad Central'],
          },
          {
            name: 'Tumakuru (Tumkur)',
            localities: ['Siddaganga', 'Batawadi', 'Ashok Nagar', 'Kyathsandra'],
          },
          {
            name: 'Shivamogga (Shimoga)',
            localities: ['Vinoba Nagar', 'Gopala', 'Durgigudi', 'Savalanga Road'],
          },
          {
            name: 'Hassan',
            localities: ['Holenarasipura Road', 'Vidya Nagar', 'Shankar Mutt Road'],
          },
          {
            name: 'Mandya',
            localities: ['Sugar Town', 'Subhash Nagar', 'VV Nagar'],
          },
          {
            name: 'Ballari (Bellary)',
            localities: ['Cantonment', 'Gandhi Nagar', 'Cowlbazar'],
          },
          {
            name: 'Kalaburagi (Gulbarga)',
            localities: ['Sedam Road', 'MSK Mill Area', 'Super Market'],
          },
          {
            name: 'Davanagere',
            localities: ['MCC A Block', 'MCC B Block', 'PJ Extension'],
          },
          {
            name: 'Chikkamagaluru',
            localities: ['Kalyan Nagar', 'MG Road', 'Rathnagiri Road'],
          },
          {
            name: 'Bagalkote',
            localities: ['Navanagar', 'Old Bagalkote', 'Vidyagiri'],
          },
          {
            name: 'Vijayapura (Bijapur)',
            localities: ['Station Road', 'Solapur Road', 'Adarsh Nagar'],
          },
          {
            name: 'Bidar',
            localities: ['Mailoor', 'Old City', 'Kumbarwada'],
          },
          {
            name: 'Chamarajanagar',
            localities: ['Santhemarahalli', 'Gundlupet Road', 'Ramasamudra'],
          },
          {
            name: 'Chikkaballapura',
            localities: ['BB Road', 'Prashanth Nagar', 'Sidlaghatta Road'],
          },
          {
            name: 'Chitradurga',
            localities: ['Fort Area', 'Kelagote', 'BD Road'],
          },
          {
            name: 'Gadag',
            localities: ['Betageri', 'Pala Badami Road', 'Mulagund Naka'],
          },
          {
            name: 'Haveri',
            localities: ['PB Road', 'Vidyanagar', 'Ashwini Nagar'],
          },
          {
            name: 'Kodagu (Coorg)',
            localities: ['Madikeri', 'Kushalnagar', 'Virajpet'],
          },
          {
            name: 'Kolar',
            localities: ['Robertsonpet', 'Bangarapet Road', 'Gulpet'],
          },
          {
            name: 'Koppal',
            localities: ['Kinnal Road', 'Ashok Circle', 'Bhagyanagar'],
          },
          {
            name: 'Raichur',
            localities: ['Station Road', 'Brehemepur', 'Askihal'],
          },
          {
            name: 'Ramanagara',
            localities: ['Channapatna Road', 'Ijoor', 'MG Road'],
          },
          {
            name: 'Uttara Kannada (Karwar)',
            localities: ['Bhatkal', 'Kumta', 'Sirsi', 'Karwar Beach Road'],
          },
          {
            name: 'Yadgir',
            localities: ['Station Road', 'Chittapur Road', 'Gandhi Chowk'],
          },
        ],
      },
      // All 28 States & 8 Union Territories of India
      { code: 'AP', name: 'Andhra Pradesh', districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Anantapur', 'Kadapa'] },
      { code: 'AR', name: 'Arunachal Pradesh', districts: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'] },
      { code: 'AS', name: 'Assam', districts: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tezpur'] },
      { code: 'BR', name: 'Bihar', districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'] },
      { code: 'CG', name: 'Chhattisgarh', districts: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'] },
      { code: 'GA', name: 'Goa', districts: ['North Goa (Panaji)', 'South Goa (Margao)'] },
      { code: 'GJ', name: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'] },
      { code: 'HR', name: 'Haryana', districts: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Panchkula'] },
      { code: 'HP', name: 'Himachal Pradesh', districts: ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Manali'] },
      { code: 'JH', name: 'Jharkhand', districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'] },
      { code: 'KL', name: 'Kerala', districts: ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Kottayam', 'Palakkad', 'Malappuram'] },
      { code: 'MP', name: 'Madhya Pradesh', districts: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'] },
      { code: 'MH', name: 'Maharashtra', districts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Navi Mumbai', 'Solapur', 'Kolhapur'] },
      { code: 'MN', name: 'Manipur', districts: ['Imphal West', 'Imphal East', 'Churachandpur', 'Thoubal'] },
      { code: 'ML', name: 'Meghalaya', districts: ['East Khasi Hills (Shillong)', 'West Garo Hills (Tura)', 'Ri Bhoi'] },
      { code: 'MZ', name: 'Mizoram', districts: ['Aizawl', 'Lunglei', 'Champhai'] },
      { code: 'NL', name: 'Nagaland', districts: ['Kohima', 'Dimapur', 'Mokokchung'] },
      { code: 'OD', name: 'Odisha', districts: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur'] },
      { code: 'PB', name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)'] },
      { code: 'RJ', name: 'Rajasthan', districts: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Alwar'] },
      { code: 'SK', name: 'Sikkim', districts: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'] },
      { code: 'TN', name: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur'] },
      { code: 'TG', name: 'Telangana', districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Rangareddy', 'Medchal-Malkajgiri'] },
      { code: 'TR', name: 'Tripura', districts: ['West Tripura (Agartala)', 'Gomati', 'South Tripura'] },
      { code: 'UP', name: 'Uttar Pradesh', districts: ['Lucknow', 'Kanpur', 'Noida (Gautam Buddha Nagar)', 'Ghaziabad', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Bareilly', 'Aligarh'] },
      { code: 'UK', name: 'Uttarakhand', districts: ['Dehradun', 'Haridwar', 'Nainital', 'Rishikesh', 'Haldwani'] },
      { code: 'WB', name: 'West Bengal', districts: ['Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Darjeeling', 'Siliguri', 'Hooghly', 'Asansol'] },
      // 8 Union Territories
      { code: 'DL', name: 'Delhi (NCT)', districts: ['New Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi', 'Central Delhi', 'South West Delhi'] },
      { code: 'CH', name: 'Chandigarh', districts: ['Chandigarh'] },
      { code: 'JK', name: 'Jammu and Kashmir', districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'] },
      { code: 'LA', name: 'Ladakh', districts: ['Leh', 'Kargil'] },
      { code: 'PY', name: 'Puducherry', districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
      { code: 'AN', name: 'Andaman and Nicobar Islands', districts: ['South Andaman (Port Blair)', 'North and Middle Andaman', 'Nicobar'] },
      { code: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', districts: ['Daman', 'Diu', 'Dadra and Nagar Haveli (Silvassa)'] },
      { code: 'LD', name: 'Lakshadweep', districts: ['Kavaratti', 'Agatti', 'Amini'] },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    states: [
      { code: 'CA', name: 'California', districts: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'] },
      { code: 'NY', name: 'New York', districts: ['New York City', 'Buffalo', 'Rochester', 'Albany'] },
      { code: 'TX', name: 'Texas', districts: ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth'] },
      { code: 'WA', name: 'Washington', districts: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'] },
      { code: 'IL', name: 'Illinois', districts: ['Chicago', 'Aurora', 'Naperville', 'Rockford'] },
      { code: 'FL', name: 'Florida', districts: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'] },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    states: [
      { code: 'ENG', name: 'England', districts: ['Greater London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol'] },
      { code: 'SCT', name: 'Scotland', districts: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] },
      { code: 'WLS', name: 'Wales', districts: ['Cardiff', 'Swansea', 'Newport'] },
      { code: 'NIR', name: 'Northern Ireland', districts: ['Belfast', 'Derry', 'Lisburn'] },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    states: [
      { code: 'DXB', name: 'Dubai', districts: ['Downtown Dubai', 'Dubai Marina', 'Deira', 'Jumeirah', 'Business Bay'] },
      { code: 'AUH', name: 'Abu Dhabi', districts: ['Abu Dhabi City', 'Al Ain', 'Al Dhafra'] },
      { code: 'SHJ', name: 'Sharjah', districts: ['Sharjah City', 'Khor Fakkan', 'Kalba'] },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    states: [
      { code: 'ON', name: 'Ontario', districts: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'] },
      { code: 'BC', name: 'British Columbia', districts: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'] },
      { code: 'QC', name: 'Quebec', districts: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'] },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    states: [
      { code: 'NSW', name: 'New South Wales', districts: ['Sydney', 'Newcastle', 'Wollongong'] },
      { code: 'VIC', name: 'Victoria', districts: ['Melbourne', 'Geelong', 'Ballarat'] },
      { code: 'QLD', name: 'Queensland', districts: ['Brisbane', 'Gold Coast', 'Cairns'] },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    states: [
      { code: 'BE', name: 'Berlin', districts: ['Berlin Mitte', 'Charlottenburg', 'Pankow', 'Kreuzberg'] },
      { code: 'BY', name: 'Bavaria', districts: ['Munich', 'Nuremberg', 'Augsburg'] },
      { code: 'NW', name: 'North Rhine-Westphalia', districts: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen'] },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    states: [
      { code: 'SG', name: 'Singapore', districts: ['Central Region', 'East Region', 'West Region', 'North Region'] },
    ],
  },
];

// 10 Key Localities across Mysore, Karnataka with coordinates
export const MYSORE_LOCALITIES = [
  { name: 'Vijayanagar', zone: 'West', coordinates: { lat: 12.3385, lng: 76.6080 }, landmark: 'Near High Tension Double Road' },
  { name: 'Kuvempunagar', zone: 'South', coordinates: { lat: 12.2850, lng: 76.6265 }, landmark: 'Near Complex Circle' },
  { name: 'Jayalakshmipuram', zone: 'Central-West', coordinates: { lat: 12.3210, lng: 76.6315 }, landmark: 'Near Kalidasa Road' },
  { name: 'Gokulam', zone: 'North-West', coordinates: { lat: 12.3325, lng: 76.6280 }, landmark: 'Near 3rd Stage Yoga Hub' },
  { name: 'Hebbal', zone: 'North-West', coordinates: { lat: 12.3650, lng: 76.5980 }, landmark: 'Near Electronic City / Industrial Area' },
  { name: 'Saraswathipuram', zone: 'Central-South', coordinates: { lat: 12.3020, lng: 76.6340 }, landmark: 'Near Kukkarahalli Lake Gate' },
  { name: 'Bannimantap', zone: 'North', coordinates: { lat: 12.3420, lng: 76.6520 }, landmark: 'Near Torchlight Parade Grounds' },
  { name: 'Hootagalli', zone: 'West', coordinates: { lat: 12.3480, lng: 76.5720 }, landmark: 'Near Belawadi Industrial Hub' },
  { name: 'Dattagalli', zone: 'South-West', coordinates: { lat: 12.2740, lng: 76.6050 }, landmark: 'Near Ring Road Junction' },
  { name: 'Nazarbad', zone: 'East', coordinates: { lat: 12.3080, lng: 76.6660 }, landmark: 'Near Mysore Palace North Gate' },
];

export const DEFAULT_USER_LOCATION = {
  country: 'India',
  state: 'Karnataka',
  district: 'Mysore (Mysuru)',
  locality: 'Vijayanagar',
  coordinates: { lat: 12.3051, lng: 76.6554 },
  isDetected: false,
};

// Calculate approximate straight-line distance in km between two lat/lng pairs
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Find closest Mysore locality based on coordinates
export function findClosestMysoreLocality(lat, lng) {
  let closest = MYSORE_LOCALITIES[0];
  let minDistance = Infinity;

  MYSORE_LOCALITIES.forEach((loc) => {
    const dist = calculateDistanceKm(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
    if (dist !== null && dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  });

  return closest;
}

// Reverse geocode fallback
export async function reverseGeocode(lat, lng) {
  const closest = findClosestMysoreLocality(lat, lng);
  return {
    country: 'India',
    state: 'Karnataka',
    district: 'Mysore (Mysuru)',
    locality: closest.name,
    localityDetails: closest,
    formatted: `${closest.name}, Mysore (Mysuru), Karnataka, India`,
  };
}
