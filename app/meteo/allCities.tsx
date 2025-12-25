const ALL_CITIES = [
  {
    name: 'Paris',
    lat: 48.8566,
    lon: 2.3522,
    src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    src: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Madrid',
    lat: 40.4168,
    lon: -3.7038,
    src: 'https://images.unsplash.com/photo-1574556462575-eb106a5865a0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Moscow',
    lat: 55.7558,
    lon: 37.6173,
    src: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Istanbul',
    lat: 41.0082,
    lon: 28.9784,
    src: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
  },

  // Amérique du Nord
  {
    name: 'New York',
    lat: 40.7128,
    lon: -74.006,
    src: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Los Angeles',
    lat: 34.0522,
    lon: -118.2437,
    src: 'https://images.unsplash.com/photo-1545108629-89e675f81d96?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Chicago',
    lat: 41.8781,
    lon: -87.6298,
    src: 'https://images.unsplash.com/photo-1597933534024-debb6104af15?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Toronto',
    lat: 43.65107,
    lon: -79.347015,
    src: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80',
  },

  // Amérique du Sud
  {
    name: 'Rio de Janeiro',
    lat: -22.9068,
    lon: -43.1729,
    src: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Buenos Aires',
    lat: -34.6037,
    lon: -58.3816,
    src: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=800&q=80',
  },

  // Asie
  {
    name: 'Tokyo',
    lat: 35.6895,
    lon: 139.6917,
    src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beijing',
    lat: 39.9042,
    lon: 116.4074,
    src: 'https://images.unsplash.com/photo-1713173642147-30cbbdb176d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Seoul',
    lat: 37.5665,
    lon: 126.978,
    src: 'https://images.unsplash.com/photo-1595185515922-9b79af1ef52d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Delhi',
    lat: 28.6139,
    lon: 77.209,
    src: 'https://images.unsplash.com/photo-1624858020896-4a558c5d7042?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    src: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=800&q=80',
  },

  // Océanie
  {
    name: 'Sydney',
    lat: -33.8688,
    lon: 151.2093,
    src: 'https://images.unsplash.com/photo-1590716209211-ea74d5f63573?auto=format&fit=crop&w=800&q=80',
  },
  //   {name: "Melbourne", lat: -37.8136, lon: 144.9631, src: "https://images.unsplash.com/photo-1546868762-b61266729c8a?auto=format&fit=crop&w=800&q=80"},
  //   {name: "Auckland", lat: -36.8485, lon: 174.7633, src: "https://images.unsplash.com/photo-1595125990323-885cec5217ff?auto=format&fit=crop&w=800&q=80"},

  // Afrique
  {
    name: 'Cairo',
    lat: 30.0444,
    lon: 31.2357,
    src: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cape Town',
    lat: -33.9249,
    lon: 18.4241,
    src: 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?auto=format&fit=crop&w=800&q=80',
  },

  // Moyen-Orient
  //   {name: "Dubai", lat: 25.2048, lon: 55.2708, src: "https://images.unsplash.com/photo-photo-1559717201-fbb671ff56b7?auto=format&fit=crop&w=800&q=80"},

  {
    name: 'Lima',
    lat: -12.0464,
    lon: -77.0428,
    src: 'https://images.unsplash.com/photo-1526697675318-89790adec369?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'São Paulo',
    lat: -23.5505,
    lon: -46.6333,
    src: 'https://images.unsplash.com/photo-1723596807374-5cfbe183a820?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mexico City',
    lat: 19.4326,
    lon: -99.1332,
    src: 'https://images.unsplash.com/photo-1598535989263-cb097f8ac3f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Doha',
    lat: 25.2854,
    lon: 51.531,
    src: 'https://images.unsplash.com/photo-1647252285041-9b2886aff1c6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dubai',
    lat: 25.2048,
    lon: 55.2708,
    src: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Athens',
    lat: 37.9838,
    lon: 23.7275,
    src: 'https://images.unsplash.com/photo-1668093375941-ccfe6c34c89c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Lisbon',
    lat: 38.7223,
    lon: -9.1393,
    src: 'https://images.unsplash.com/photo-1697748525265-7431cba075b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Amsterdam',
    lat: 52.3676,
    lon: 4.9041,
    src: 'https://images.unsplash.com/photo-1576638993447-11310de155e8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Barcelona',
    lat: 41.3851,
    lon: 2.1734,
    src: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Berlin',
    lat: 52.52,
    lon: 13.405,
    src: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Rome',
    lat: 41.9028,
    lon: 12.4964,
    src: 'https://images.unsplash.com/photo-1603199766980-fdd4ac568a11?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Honolulu',
    lat: 21.3069,
    lon: -157.8583,
    src: 'https://images.unsplash.com/photo-1573992554018-83e7853bd45f?auto=format&fit=crop&w=800&q=80',
  },

  // Autres villes notables
  // {
  //   name: 'Honolulu',
  //   lat: 21.3069,
  //   lon: -157.8583,
  //   src: 'https://images.unsplash.com/photo-1573993228224-5ffd3f00511c?auto=format&fit=crop&w=800&q=80',
  // },

  // {
  //   name: 'Rome',
  //   lat: 41.9028,
  //   lon: 12.4964,
  //   src: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Berlin',
  //   lat: 52.52,
  //   lon: 13.405,
  //   src: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Barcelona',
  //   lat: 41.3851,
  //   lon: 2.1734,
  //   src: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Amsterdam',
  //   lat: 52.3676,
  //   lon: 4.9041,
  //   src: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Lisbon',
  //   lat: 38.7223,
  //   lon: -9.1393,
  //   src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Athens',
  //   lat: 37.9838,
  //   lon: 23.7275,
  //   src: 'https://images.unsplash.com/photo-1505731132164-cca7f5a396ab?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Dubai',
  //   lat: 25.2048,
  //   lon: 55.2708,
  //   src: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Doha',
  //   lat: 25.2854,
  //   lon: 51.531,
  //   src: 'https://images.unsplash.com/photo-1602080759865-26f4d76c9557?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Mexico City',
  //   lat: 19.4326,
  //   lon: -99.1332,
  //   src: 'https://images.unsplash.com/photo-1535359056830-7d0f6f5f8c1f?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'São Paulo',
  //   lat: -23.5505,
  //   lon: -46.6333,
  //   src: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Lima',
  //   lat: -12.0464,
  //   lon: -77.0428,
  //   src: 'https://images.unsplash.com/photo-1526404746352-9d3a9b83b5a9?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Bangkok',
  //   lat: 13.7563,
  //   lon: 100.5018,
  //   src: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Hong Kong',
  //   lat: 22.3193,
  //   lon: 114.1694,
  //   src: 'https://images.unsplash.com/photo-1508002366005-75a695ee2d17?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Jakarta',
  //   lat: -6.2088,
  //   lon: 106.8456,
  //   src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Mumbai',
  //   lat: 19.076,
  //   lon: 72.8777,
  //   src: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Manila',
  //   lat: 14.5995,
  //   lon: 120.9842,
  //   src: 'https://images.unsplash.com/photo-1586861133629-bb9d861bdead?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'San Francisco',
  //   lat: 37.7749,
  //   lon: -122.4194,
  //   src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Miami',
  //   lat: 25.7617,
  //   lon: -80.1918,
  //   src: 'https://images.unsplash.com/photo-1500021802129-7e95f0a56f74?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Vancouver',
  //   lat: 49.2827,
  //   lon: -123.1207,
  //   src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Nairobi',
  //   lat: -1.2921,
  //   lon: 36.8219,
  //   src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
  // },

  // {
  //   name: 'Vienna',
  //   lat: 48.2082,
  //   lon: 16.3738,
  //   src: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Prague',
  //   lat: 50.0755,
  //   lon: 14.4378,
  //   src: 'https://images.unsplash.com/photo-1506086679525-9d75f2a3c1ae?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Budapest',
  //   lat: 47.4979,
  //   lon: 19.0402,
  //   src: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Warsaw',
  //   lat: 52.2297,
  //   lon: 21.0122,
  //   src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Stockholm',
  //   lat: 59.3293,
  //   lon: 18.0686,
  //   src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Copenhagen',
  //   lat: 55.6761,
  //   lon: 12.5683,
  //   src: 'https://images.unsplash.com/photo-1519046904884-53103b34b006?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Dublin',
  //   lat: 53.3498,
  //   lon: -6.2603,
  //   src: 'https://images.unsplash.com/photo-1517957754645-70813251524f?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Zurich',
  //   lat: 47.3769,
  //   lon: 8.5417,
  //   src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Edinburgh',
  //   lat: 55.9533,
  //   lon: -3.1883,
  //   src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Oslo',
  //   lat: 59.9139,
  //   lon: 10.7522,
  //   src: 'https://images.unsplash.com/photo-1513273216457-2b71f5f9c8f8?auto=format&fit=crop&w=800&q=80',
  // },

  // // Amériques
  // {
  //   name: 'Seattle',
  //   lat: 47.6062,
  //   lon: -122.3321,
  //   src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Boston',
  //   lat: 42.3601,
  //   lon: -71.0589,
  //   src: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Montreal',
  //   lat: 45.5017,
  //   lon: -73.5673,
  //   src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Bogotá',
  //   lat: 4.711,
  //   lon: -74.0721,
  //   src: 'https://images.unsplash.com/photo-1536704670251-8a4f784db346?auto=format&fit=crop&w=800&q=80',
  // },

  // // Asie & Moyen Orient
  // {
  //   name: 'Shanghai',
  //   lat: 31.2304,
  //   lon: 121.4737,
  //   src: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Taipei',
  //   lat: 25.033,
  //   lon: 121.5654,
  //   src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Kuala Lumpur',
  //   lat: 3.139,
  //   lon: 101.6869,
  //   src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  // },

  // // Afrique
  // {
  //   name: 'Casablanca',
  //   lat: 33.5731,
  //   lon: -7.5898,
  //   src: 'https://images.unsplash.com/photo-1602526219334-c3e1c3d317e2?auto=format&fit=crop&w=800&q=80',
  // },
  // {
  //   name: 'Marrakesh',
  //   lat: 31.6295,
  //   lon: -7.9811,
  //   src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
  // },
];

export default ALL_CITIES;
