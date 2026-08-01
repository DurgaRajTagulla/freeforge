import { useState, useMemo } from 'react';
import {
  MapPin, Sun, Snowflake, CloudRain, Users, User, Heart,
  Search, Clock, IndianRupee, Car, Train, Plane, Hotel,
  Star, ChevronRight, X, Compass, Calendar, Wallet,
  Shield, Camera, Mountain, Waves, TreePalm, Landmark,
  BookOpen, Shirt, Ticket, Bell, ChevronDown
} from 'lucide-react';
import './TourGuide.css';

const temples = [
  {
    id: 'tirupati-balaji',
    name: 'Tirupati Balaji (Venkateswara)',
    location: 'Tirumala, Andhra Pradesh',
    deity: 'Lord Venkateswara (Balaji)',
    architecture: 'Dravidian',
    significance: 'The richest and most visited Hindu temple in the world. Over 50,000-100,000 pilgrims visit daily. The temple sits atop the seven peaks of Tirumala Hills.',
    bestTimeToVisit: 'October to March (pleasant weather); avoid summer heat',
    dressCode: 'Traditional Indian attire mandatory. Men: Dhoti/Kurta. Women: Saree/Salwar Kameez. No jeans, shorts, or western wear allowed.',
    entryFee: 'Free darshan (4-8 hrs queue) | Special Darshan: \u20B9300 per person | VIP Darshan: \u20B9500 per person',
    aartiTimings: 'Suprabhatam: 3:00 AM | Darshan: 3:30 AM - 6:00 PM | Evening Darshan: 6:00 PM - 7:00 PM',
    openingHours: '3:00 AM - 11:00 PM (daily)',
    duration: '1-2 days',
    howToReach: {
      flight: 'Tirupati Airport (TIR) - 15 km from Tirupati, then bus to Tirumala',
      train: 'Tirupati Railway Station (TPTY) - well connected to all major cities',
      road: 'APSRTC buses from Tirupati to Tirumala (every 2 mins)'
    },
    whereToStay: [
      { type: 'Budget', name: 'TTD Free Accommodation / Dormitory', price: 'Free - \u20B9100/night' },
      { type: 'Mid-Range', name: 'Tirumala Hotels / Sindhuri Park', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Marasa Sarovar Premiere / Bliss Hotel', price: '\u20B94,000 - \u20B98,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B910,000 per person (1-2 days)',
    tips: [
      'Book darshan tickets online at tirumala.org (opens 180 days in advance)',
      'Laddu prasadam: \u20B950 per laddu (max 2 per person)',
      'Free meals (Annaprasadam) available at Matrusri Tarigonda Vengamamba Annaprasadam Complex',
      'Tonsuring (head shaving) is a common offering - done at nearby shops',
      'Carry an ID proof for darshan booking',
      'Weekdays are less crowded than weekends'
    ]
  },
  {
    id: 'golden-temple',
    name: 'Golden Temple (Harmandir Sahib)',
    location: 'Amritsar, Punjab',
    deity: 'Guru Granth Sahib (Sikh Holy Scripture)',
    architecture: 'Sikh-Mughal-Rajput fusion',
    significance: 'The holiest Gurdwara of Sikhism. The temple is surrounded by the sacred Amrit Sarovar (Pool of Nectar). The Langar serves free meals to 50,000-1,00,000 people daily.',
    bestTimeToVisit: 'October to March (winter); avoid summer (extreme heat)',
    dressCode: 'Head must be covered (scarves available free). Remove shoes. Dress modestly. No alcohol or tobacco.',
    entryFee: 'Free entry for all (24/7)',
    aartiTimings: 'Pehla Prakash: 2:30 AM | Asa Di Var: 6:00 AM | Kirtan: 9:30 AM - 9:00 PM | Sukhasan: 9:30 PM',
    openingHours: 'Open 24 hours, all 7 days',
    duration: '1-2 days',
    howToReach: {
      flight: 'Sri Guru Ram Dass Jee International Airport (ATQ) - 13 km',
      train: 'Amritsar Junction (ASR) - well connected to Delhi, Mumbai, Kolkata',
      road: 'Buses from Delhi (8-9 hrs, 450 km), Jalandhar (1.5 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'SGPG Guest House / Dormitory', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Hotel Neelam / Best Western', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Taj Swarna / Holiday Inn Amritsar', price: '\u20B95,000 - \u20B910,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B912,000 per person (1-2 days)',
    tips: [
      'Visit early morning (4-5 AM) for peaceful experience',
      'Langar (free community meal) is served in the langar hall - everyone sits together',
      'Carry a handkerchief to cover your head if you don\'t have a scarf',
      'Photography allowed inside but be respectful',
      'Combine with Jallianwala Bagh (5 min walk) and Wagah Border (22 km)',
      'The temple glitters beautifully at night - must see'
    ]
  },
  {
    id: 'varanasi-kashi',
    name: 'Kashi Vishwanath Temple',
    location: 'Varanasi, Uttar Pradesh',
    deity: 'Lord Shiva (Vishwanath - Lord of the Universe)',
    architecture: 'Nagara style Hindu temple',
    significance: 'One of the 12 Jyotirlingas of Lord Shiva. Located on the banks of River Ganga, it is considered the holiest of all Shiva temples. Part of the new Kashi Vishwanath Corridor.',
    bestTimeToVisit: 'October to March (winter); avoid summer (extreme heat)',
    dressCode: 'Traditional Indian wear recommended. Modest clothing required. Shoes removed before entering.',
    entryFee: 'Free entry (general darshan) | Quick darshan: \u20B9300',
    aartiTimings: 'Mangala Aarti: 3:00 AM - 4:00 AM | Bhog Aarti: 11:30 AM - 12:00 PM | Sandhya Aarti: 7:00 PM - 7:30 PM | Shringar Aarti: 9:00 PM - 9:30 PM',
    openingHours: '4:00 AM - 11:00 PM (daily)',
    duration: '2-3 days',
    howToReach: {
      flight: 'Lal Bahadur Shastri Airport (VNS) - 22 km, flights from Delhi, Mumbai',
      train: 'Varanasi Junction (BSB) or Deen Dayal Upadhyaya Junction (DDU, 18 km)',
      road: 'Buses from Delhi (12-14 hrs), Prayagraj (3 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Zostel Varanasi / Ganpati Guest House', price: '\u20B9300 - \u20B9800/night' },
      { type: 'Mid-Range', name: 'Hotel Ganges / Ramada Plaza', price: '\u20B91,500 - \u20B94,000/night' },
      { type: 'Luxury', name: 'Taj Nadesar Palace / BrijRama Palace', price: '\u20B98,000 - \u20B925,000/night' }
    ],
    estimatedBudget: '\u20B94,000 - \u20B915,000 per person (2-3 days)',
    tips: [
      'Witness the Ganga Aarti at Dashashwamedh Ghat (6:30 PM daily)',
      'Take an early morning boat ride on the Ganga',
      'The new Kashi Vishwanath Corridor has made darshan much easier',
      'Try Banarasi paan and kachori from local shops',
      'Visit Sarnath (10 km) where Buddha gave his first sermon',
      'Carry cash for offerings and prasad'
    ]
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    location: 'Madurai, Tamil Nadu',
    deity: 'Goddess Meenakshi (Parvati) and Lord Sundareshwarar (Shiva)',
    architecture: 'Dravidian (14 colorful gopurams)',
    significance: 'One of the 51 Shakti Peethas. The temple has 14 towering gopurams covered with 33,000+ colorful sculptures. It was nominated as one of the New Seven Wonders of the World.',
    bestTimeToVisit: 'October to March (winter); April for Chithirai Festival',
    dressCode: 'Traditional Indian attire. Men: shirt and dhoti/pants. Women: saree or churidar. Modest dressing.',
    entryFee: 'Free entry for all | Camera: \u20B950',
    aartiTimings: 'Thirupallandu: 5:00 AM | Uchikala Pooja: 12:00 PM | Sayarakshai: 6:00 PM | Arthajama Pooja: 9:30 PM',
    openingHours: '5:00 AM - 12:30 PM & 4:00 PM - 9:30 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Madurai Airport (IXM) - 12 km from city center',
      train: 'Madurai Junction (MDU) - trains from Chennai, Delhi, Mumbai',
      road: 'Buses from Chennai (8 hrs), Coimbatore (5 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Zostel Madurai / Heritage Madurai Hostel', price: '\u20B9400 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Heritage Madurai / Hotel Royal Court', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Taj Gateway Pasumalai / The Gateway Hotel', price: '\u20B95,000 - \u20B912,000/night' }
    ],
    estimatedBudget: '\u20B94,000 - \u20B912,000 per person (1-2 days)',
    tips: [
      'Visit during evening aarti for spectacular light and sound show',
      'The temple is a living temple - very busy and vibrant',
      'Explore the 4 corridors and the golden lotus tank',
      'Madurai is also known as "Athens of the East" - explore the city',
      'Try Jigarthanda (famous Madurai drink) from famous shops',
      'Photography restrictions inside sanctum sanctorum'
    ]
  },
  {
    id: 'siddhivinayak',
    name: 'Siddhivinayak Temple',
    location: 'Mumbai, Maharashtra',
    deity: 'Lord Ganesha (Siddhivinayak - Remover of Obstacles)',
    architecture: 'Modern Hindu temple',
    significance: 'One of the most powerful Ganesha temples in India. Famous for fulfilling wishes. Visited by Bollywood stars and politicians especially on Tuesdays.',
    bestTimeToVisit: 'October to March (winter); Ganesh Chaturthi (Aug-Sep) is the biggest celebration',
    dressCode: 'Modest clothing. No strict dress code but traditional wear preferred.',
    entryFee: 'Free entry | Special darshan: \u20B950 - \u20B9100',
    aartiTimings: 'Aarti: 6:00 AM - 7:00 AM | Midday Aarti: 12:00 PM - 12:30 PM | Sandhya Aarti: 7:30 PM - 8:00 PM',
    openingHours: '5:30 AM - 9:30 PM (Mon-Fri), 5:30 AM - 10:00 PM (Sat)',
    duration: '1 day',
    howToReach: {
      flight: 'Chhatrapati Shivaji Airport (BOM) - 15 km',
      train: 'Dadar Station or Prabhadevi Station (1 km)',
      road: 'Well connected by BEST buses and taxis'
    },
    whereToStay: [
      { type: 'Budget', name: 'Local hotels in Dadar/Prabhadevi', price: '\u20B9800 - \u20B91,500/night' },
      { type: 'Mid-Range', name: 'Hotel Trident / ITC Grand Central', price: '\u20B93,000 - \u20B97,000/night' },
      { type: 'Luxury', name: 'Taj Mahal Palace / The Leela Mumbai', price: '\u20B910,000 - \u20B925,000/night' }
    ],
    estimatedBudget: '\u20B92,000 - \u20B98,000 per person (1 day)',
    tips: [
      'Tuesday is the busiest day - expect 3-5 hour wait',
      'Visit early morning (5:30 AM) for shorter queues',
      'Online darshan booking available on the temple website',
      'Ganesh Chaturthi (Aug-Sep) celebrations are grand',
      'Combine with Dadar flower market and Shivaji Park'
    ]
  },
  {
    id: 'jagannath-puri',
    name: 'Jagannath Temple',
    location: 'Puri, Odisha',
    deity: 'Lord Jagannath (Krishna), Balabhadra, Subhadra',
    architecture: 'Kalinga (Nagara style)',
    significance: 'One of the Char Dham pilgrimage sites. The annual Rath Yatra (Chariot Festival) is the largest chariot festival in the world, pulling 3 massive chariots through the streets.',
    bestTimeToVisit: 'October to March (winter); June-July for Rath Yatra',
    dressCode: 'Traditional Indian wear. Men: dhoti. Women: saree. Leather items not allowed inside.',
    entryFee: 'Free entry for Indians | foreigners: \u20B9500',
    aartiTimings: 'Mangala Aarti: 5:30 AM | Abakash: 6:00 AM | Pahili Puja: 6:30 AM | Bhitra Dhoop: 7:30 AM - 8:30 PM',
    openingHours: '5:30 AM - 9:00 PM (daily)',
    duration: '2-3 days',
    howToReach: {
      flight: 'Biju Patnaik International Airport (BBI) in Bhubaneswar - 60 km',
      train: 'Puri Railway Station (PURI) - direct trains from Kolkata, Delhi, Mumbai',
      road: 'Buses from Bhubaneswar (1.5 hrs), Kolkata (6 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'OTS Guest House / Yatri Niwas', price: '\u20B9300 - \u20B9800/night' },
      { type: 'Mid-Range', name: 'Hotel Swosti / Mayfair Beach Resort', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Taj Fisherman\'s Cove / The Chariot Resort', price: '\u20B96,000 - \u20B915,000/night' }
    ],
    estimatedBudget: '\u20B94,000 - \u20B912,000 per person (2-3 days)',
    tips: [
      'Carry your Aadhaar/ID - required for entry',
      'Non-Hindus are not allowed inside the sanctum (view from outside)',
      'The Mahaprasad (temple food) is served in Ananda Bazaar - try it',
      'Rath Yatra (June/July) is a must-see if visiting during that time',
      'Combine with Konark Sun Temple (65 km) and Chilika Lake (110 km)',
      'Photography restricted inside the main temple'
    ]
  },
  {
    id: 'badrinath',
    name: 'Badrinath Temple',
    location: 'Badrinath, Uttarakhand',
    deity: 'Lord Vishnu (Badrinarayan)',
    architecture: 'Garhwal temple architecture (colorful facade)',
    significance: 'One of the Char Dham and Chota Char Dham pilgrimage sites. Located at 3,133 m altitude in the Garhwal Himalayas. Opens only for 6 months a year (Apr-Nov).',
    bestTimeToVisit: 'May to June and September to October; opens mid-April, closes mid-November',
    dressCode: 'Traditional Indian wear. Warm clothes required as temperature drops significantly.',
    entryFee: 'Free entry for all',
    aartiTimings: 'Maha Abhishek: 4:30 AM | Darshan: 7:00 AM - 12:00 PM & 3:00 PM - 6:00 PM | Shayan Aarti: 8:30 PM',
    openingHours: '6:00 AM - 9:00 PM (during open season only, Apr-Nov)',
    duration: '3-5 days (as part of Char Dham)',
    howToReach: {
      flight: 'Nearest airport: Dehradun (DED) - 317 km',
      train: 'Nearest railway: Haridwar (HW) - 315 km',
      road: 'Buses/taxis from Haridwar, Rishikesh (12-14 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'GMVN Guest House / Dharamshala', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Sarovar Portico / Hotel Badri', price: '\u20B92,000 - \u20B94,500/night' },
      { type: 'Luxury', name: 'TGM Badrinath / Himalayan options', price: '\u20B95,000 - \u20B910,000/night' }
    ],
    estimatedBudget: '\u20B912,000 - \u20B925,000 per person (3-5 days, Char Dham)',
    howToReach: {
      flight: 'Dehradun (DED) - 317 km, then road',
      train: 'Haridwar (HW) - 315 km, then bus/taxi',
      road: 'Rishikesh to Badrinath (12-14 hrs, 325 km)'
    },
    tips: [
      'Carry warm layers - temperature can drop to 0°C even in summer',
      'Book accommodation well in advance during Char Dham yatra season',
      'Combine with Kedarnath for complete Chota Char Dham',
      'Altitude sickness possible - carry basic medicines',
      'Roads can be blocked by landslides in monsoon - check conditions'
    ]
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath Temple',
    location: 'Kedarnath, Uttarakhand',
    deity: 'Lord Shiva (Kedarnath - Lord of Kedara)',
    architecture: 'Ancient stone temple (Pandava-era)',
    significance: 'One of the 12 Jyotirlingas and part of Chota Char Dham. Located at 3,583 m altitude. The temple was rebuilt after the 2013 floods. Trek of 16 km from Gaurikund.',
    bestTimeToVisit: 'May to June and September to October; opens early May, closes late October',
    dressCode: 'Traditional wear + heavy warm clothes (sub-zero temperatures possible)',
    entryFee: 'Free entry',
    aartiTimings: 'Morning Aarti: 6:00 AM | Darshan: 7:00 AM - 6:00 PM | Evening Aarti: 6:00 PM',
    openingHours: '6:00 AM - 6:00 PM (during open season only)',
    duration: '3-5 days (as part of Char Dham)',
    howToReach: {
      flight: 'Dehradun (DED) - 250 km to Gaurikund',
      train: 'Haridwar (HW) - 250 km to Gaurikund',
      road: 'Drive to Gaurikund, then 16 km trek or helicopter service'
    },
    whereToStay: [
      { type: 'Budget', name: 'GMVN Rest House / Camps', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'JKTDC Guest House', price: '\u20B91,500 - \u20B93,000/night' },
      { type: 'Luxury', name: 'Limited options - basic stays only', price: 'N/A' }
    ],
    estimatedBudget: '\u20B910,000 - \u20B920,000 per person (3-5 days)',
    tips: [
      'Start trek from Gaurikund early morning (4-5 AM)',
      'Helicopter service available from Phata/Sersi (book in advance)',
      'Carry essential medicines, warm clothes, and rain gear',
      ' Pony and palki services available for the trek',
      'Carry cash - no ATMs at Kedarnath',
      'Registration required at Gaurikund for the trek'
    ]
  },
  {
    id: 'rameshwaram',
    name: 'Ramanathaswamy Temple',
    location: 'Rameshwaram, Tamil Nadu',
    deity: 'Lord Shiva (Ramanathaswamy)',
    architecture: 'Dravidian (longest corridor in the world)',
    significance: 'One of the Char Dham pilgrimage sites. The temple has the longest corridor among all Hindu temples in the world (1,220 meters). Believed to be where Lord Rama worshipped Shiva.',
    bestTimeToVisit: 'October to April (winter); avoid monsoon (Jul-Sep)',
    dressCode: 'Traditional Indian wear. Modest clothing required.',
    entryFee: 'Free entry | Special darshan: \u20B950',
    aartiTimings: 'Pooja: 5:00 AM | Darshan: 6:00 AM - 12:00 PM & 3:00 PM - 8:30 PM',
    openingHours: '5:00 AM - 1:00 PM & 3:00 PM - 9:00 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Nearest airport: Madurai (IXM) - 170 km',
      train: 'Rameshwaram (RMM) - direct trains from Chennai, Madurai',
      road: 'Drive from Madurai (3 hrs), connected by Pamban Bridge'
    },
    whereToStay: [
      { type: 'Budget', name: 'Dharamshala / Temple Trust Guest House', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Hotel TamilNadu / JKR Resort', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Triton Hotel / Daiwik Hotels', price: '\u20B94,000 - \u20B98,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B910,000 per person (1-2 days)',
    tips: [
      'Perform holy dip at Agni Theertham (sea) before temple visit',
      'Collect sacred water from 22 theerthams (holy wells) inside the temple',
      'The Pamban Bridge connecting to the island is scenic',
      'Visit Dhanushkodi (ghost town) at the tip of the island',
      'Try fresh seafood from local restaurants',
      'Carry a change of clothes for holy bath'
    ]
  },
  {
    id: 'somnath',
    name: 'Somnath Temple',
    location: 'Prabhas Patan, Gujarat',
    deity: 'Lord Shiva (Somnath - Lord of the Moon)',
    architecture: 'Chalukya style (Kailash Mahameroo Prasad)',
    significance: 'First among the 12 Jyotirlingas. The temple has been destroyed and rebuilt 6 times. The current structure was rebuilt in 1951. A sacred site since ancient times.',
    bestTimeToVisit: 'October to March (winter); avoid summer (extreme heat)',
    dressCode: 'Traditional Indian wear. Modest clothing required.',
    entryFee: 'Free entry',
    aartiTimings: 'Darbar Aarti: 7:00 AM | Bhog Aarti: 12:00 PM | Sandhya Aarti: 7:00 PM | Shringar Aarti: 9:00 PM',
    openingHours: '6:00 AM - 9:00 PM (daily)',
    duration: '1-2 days',
    howToReach: {
      flight: 'Nearest airport: Diu (DIU) - 85 km or Rajkot (RAJ) - 190 km',
      train: 'Veraval (VER) - 7 km, or Somnath station',
      road: 'GSRTC buses from Rajkot (4 hrs), Ahmedabad (7 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'SRT Temple Trust Guest House', price: '\u20B9300 - \u20B9800/night' },
      { type: 'Mid-Range', name: 'Hotel Somnath / The Grand Bhagwati', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Tulsi Hotel / Limited luxury options', price: '\u20B93,000 - \u20B96,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B98,000 per person (1-2 days)',
    tips: [
      'The Sound and Light show (8 PM) at the temple is spectacular',
      'Visit Triveni Sangam (confluence of 3 rivers) nearby',
      'The evening aarti at the temple facing the sea is mesmerizing',
      'Combine with Dwarka (235 km) for complete Somnath-Dwarka yatra',
      'Diya lighting ceremony at the temple in the evening'
    ]
  },
  {
    id: 'dwarka',
    name: 'Dwarkadhish Temple',
    location: 'Dwarka, Gujarat',
    deity: 'Lord Krishna (Dwarkadhish - King of Dwarka)',
    architecture: 'Chalukya style (solanki architecture)',
    significance: 'One of the Char Dham pilgrimage sites and one of the Sapta Puris (seven holy cities). Built over 2,500 years ago. The submerged city of Dwarka is believed to be Lord Krishna\'s kingdom.',
    bestTimeToVisit: 'October to March (winter)',
    dressCode: 'Traditional Indian wear preferred. Modest clothing required.',
    entryFee: 'Free entry',
    aartiTimings: 'Mangla Aarti: 6:30 AM | Bhog Aarti: 12:00 PM | Sandhya Aarti: 7:30 PM | Shayan Aarti: 9:30 PM',
    openingHours: '6:30 AM - 1:00 PM & 5:00 PM - 9:30 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Nearest airport: Jamnagar (JGA) - 137 km',
      train: 'Dwarka (DWK) - connected to Ahmedabad, Rajkot',
      road: 'GSRTC buses from Rajkot (4 hrs), Ahmedabad (7 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Temple Trust Guest House / Dharamshala', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Hotel Rukmini / The Fern Reef Resort', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Welcomhotel by ITC / Limited options', price: '\u20B94,000 - \u20B98,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B98,000 per person (1-2 days)',
    tips: [
      'The evening aarti at Dwarkadhish temple is divine',
      'Visit Bet Dwarka (island) by boat - believed to be Krishna\'s residence',
      'Rukmini Temple (2 km) is a must-visit',
      'Combine with Somnath (235 km) for complete yatra',
      'Try Gujarati thali at local restaurants'
    ]
  },
  {
    id: 'ayodhya-ram-temple',
    name: 'Shri Ram Janmabhoomi Temple',
    location: 'Ayodhya, Uttar Pradesh',
    deity: 'Lord Ram (Ram Lalla - infant form)',
    architecture: 'Nagara style (modern grand temple)',
    significance: 'Built at the birthplace of Lord Ram. The newly constructed grand temple (consecrated in Jan 2024) is one of the largest Hindu temples in the world. A historic and deeply significant pilgrimage site.',
    bestTimeToVisit: 'October to March (winter); Ram Navami (Mar/Apr) is the biggest celebration',
    dressCode: 'Traditional Indian wear preferred. Modest clothing required.',
    entryFee: 'Free entry',
    aartiTimings: 'Mangla Aarti: 4:00 AM | Bhog Aarti: 12:00 PM | Sandhya Aarti: 7:00 PM | Shayan Aarti: 10:00 PM',
    openingHours: '7:00 AM - 11:30 AM & 2:00 PM - 7:00 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Maharishi Valmiki International Airport (AYJ) - 22 km (newly built)',
      train: 'Ayodhya Dham Junction (AY) - direct trains from Delhi, Mumbai',
      road: 'Buses from Lucknow (3 hrs), Varanasi (5 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Ram Seva Trust Guest House', price: '\u20B9300 - \u20B9800/night' },
      { type: 'Mid-Range', name: 'Hotel Saket / Paakeezah Residency', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Ramada by Wyndham / Limited options', price: '\u20B94,000 - \u20B98,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B910,000 per person (1-2 days)',
    tips: [
      'Book darshan through official website - limited slots daily',
      'Visit Hanuman Garhi (fortress temple) nearby',
      'Saryu River aarti in the evening is beautiful',
      'Try Ayodhya\'s famous pedha and chaat',
      'Combine with Varanasi (3 hrs) for a spiritual trip',
      'Accommodation gets fully booked during Ram Navami - plan well in advance'
    ]
  },
  {
    id: 'shirdi',
    name: 'Sai Baba Temple',
    location: 'Shirdi, Maharashtra',
    deity: 'Sai Baba of Shirdi',
    architecture: 'Modern temple structure',
    significance: 'One of the most visited pilgrimage sites in India. Sai Baba lived in Shirdi for 60+ years. The temple receives 25,000-50,000 devotees daily.',
    bestTimeToVisit: 'October to March ( winter); Guru Purnima (Jul) is the biggest celebration',
    dressCode: 'No strict dress code. Modest clothing preferred.',
    entryFee: 'Free entry | Shej Aarti darshan: \u20B9200',
    aartiTimings: 'Kakad Aarti: 5:15 AM | Madhyan Aarti: 12:00 PM | Shej Aarti: 8:30 PM',
    openingHours: '5:15 AM - 10:00 PM (daily)',
    duration: '1-2 days',
    howToReach: {
      flight: 'Nearest airport: Shirdi (SAG) - 15 km',
      train: 'Sainagar Shirdi Railway Station (SNSI) - trains from Mumbai, Pune',
      road: 'MSRTC buses from Mumbai (5 hrs), Pune (4 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Sai Baba Trust Ashram / Dharamshala', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Hotel Sai Leela / Sun N Sand', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'The Temple Tree / Golf Resort', price: '\u20B94,000 - \u20B98,000/night' }
    ],
    estimatedBudget: '\u20B92,000 - \u20B98,000 per person (1-2 days)',
    tips: [
      'Online darshan booking available - reduces wait time significantly',
      'Chavdi darshan happens every alternate day (check schedule)',
      'Prasad counter closes by 12 PM - go early',
      'Shani Shingnapur (70 km) can be combined as a day trip',
      'Shani temple has no roof - believed to protect devotees',
      'Carry a small bag with essentials - large bags not allowed'
    ]
  },
  {
    id: 'tiruvannamalai',
    name: 'Arunachaleswarar Temple',
    location: 'Tiruvannamalai, Tamil Nadu',
    deity: 'Lord Shiva (Arunachaleswarar / Annamalaiyar)',
    architecture: 'Dravidian (one of the largest temples in India)',
    significance: 'One of the Pancha Bhuta Stalam (five elemental temples - represents Fire). The 11-day Karthigai Deepam festival attracts millions of devotees. The temple covers 25 acres.',
    bestTimeToVisit: 'October to March (winter); Karthigai Deepam (Nov/Dec) is the peak',
    dressCode: 'Traditional Indian wear. Men: dhoti. Women: saree/churidar.',
    entryFee: 'Free entry for main temple | Special darshan: \u20B950',
    aartiTimings: 'Thirupalli Ezhuchi: 5:00 AM | Uchikala Pooja: 12:00 PM | Arthajama Pooja: 9:00 PM',
    openingHours: '5:30 AM - 12:30 PM & 3:30 PM - 9:30 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Nearest airport: Chennai (MAA) - 200 km',
      train: 'Tiruvannamalai (TNM) - trains from Chennai',
      road: 'Buses from Chennai (4 hrs), Bangalore (4 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Temple Rest House / Dharamshala', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Hotel Paradise / Surya International', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Arunchalam Hotel / Limited luxury', price: '\u20B93,500 - \u20B97,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B98,000 per person (1-2 days)',
    tips: [
      'Girivalam (14 km circumambulation of the hill) is a sacred practice',
      'Do Girivalam barefoot early morning for spiritual experience',
      'Karthigai Deepam festival (Nov/Dec) - the hilltop beacon is spectacular',
      'Visit Ramana Ashram (2 km) - where Sage Ramana Maharshi lived',
      'Carry water and comfortable footwear for Girivalam',
      'Try local South Indian food at restaurants near the temple'
    ]
  },
  {
    id: 'srirangapatna',
    name: 'Sri Ranganathaswamy Temple',
    location: 'Srirangapatna, Karnataka',
    deity: 'Lord Vishnu (Ranganatha - reclining form)',
    architecture: 'Dravidian (Vijayanagara style)',
    significance: 'One of the most important Vishnu temples and among the Divya Desams. The temple complex is one of the largest in India. The annual 21-day festival is famous.',
    bestTimeToVisit: 'October to March (winter)',
    dressCode: 'Traditional Indian wear. Modest clothing required.',
    entryFee: 'Free entry',
    aartiTimings: 'Pooja: 6:00 AM - 12:00 PM & 4:00 PM - 8:00 PM',
    openingHours: '6:00 AM - 12:00 PM & 4:00 PM - 8:00 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Nearest airport: Mysore (MYQ) - 20 km or Bangalore (BLR) - 140 km',
      train: 'Srirangapatna (S) - on the Mysore-Bangalore line',
      road: 'Buses from Mysore (20 min), Bangalore (3 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Local lodges near temple', price: '\u20B9300 - \u20B9700/night' },
      { type: 'Mid-Range', name: 'The Gateway Hotel / Royal Orchid', price: '\u20B92,500 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Taj West End / JW Marriott Bangalore', price: '\u20B97,000 - \u20B915,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B910,000 per person (1-2 days)',
    tips: [
      'Combine with Mysore Palace and Brindavan Gardens',
      'The temple float festival (Theppotsavam) is beautiful',
      'Srirangapatna was Tipu Sultan\'s capital - visit the fort and museum',
      'Try Mysore pak and masala dosa at local eateries',
      'The 21-day annual festival (March/April) is worth attending'
    ]
  },
  {
    id: 'kamakhya',
    name: 'Kamakhya Temple',
    location: 'Guwahati, Assam',
    deity: 'Goddess Kamakhya (Shakti)',
    architecture: 'Nilachal style (unique hybrid)',
    significance: 'One of the 51 Shakti Peethas. Located on Nilachal Hill. The temple has no idol - the deity is represented by a yoni-shaped stone. The Ambubachi Mela (June) attracts tantric practitioners.',
    bestTimeToVisit: 'October to March (winter); Ambubachi Mela (June)',
    dressCode: 'Traditional Indian wear preferred. Modest clothing.',
    entryFee: 'Free entry | Special darshan: \u20B950',
    aartiTimings: 'Morning Aarti: 5:30 AM | Midday Aarti: 12:00 PM | Evening Aarti: 6:00 PM',
    openingHours: '5:30 AM - 1:30 PM & 2:30 PM - 5:30 PM',
    duration: '1-2 days',
    howToReach: {
      flight: 'Lokpriya Gopinath Bordoloi International Airport (GAU) - 25 km',
      train: 'Guwahati Railway Station (GHY) - major junction',
      road: 'Buses from Shillong (3 hrs), Kolkata (12 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Zostel Guwahati / Local guesthouses', price: '\u20B9400 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Hotel Novotel / Gateway Grandeur', price: '\u20B92,500 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Taj Vivanta / Radisson Blu', price: '\u20B96,000 - \u20B912,000/night' }
    ],
    estimatedBudget: '\u20B94,000 - \u20B912,000 per person (1-2 days)',
    tips: [
      'Climb 500+ steps to reach the temple - wear comfortable shoes',
      'Ambubachi Mela (June) - temple closes for 3 days during menstruation',
      'Carry offerings (flowers, sindoor) from local shops',
      'Visit Umananda Island (peacock island) by ferry',
      'Try Assamese thali at local restaurants',
      'Sunrise from Nilachal Hill is beautiful'
    ]
  },
  {
    id: 'siddhivinayak-pune',
    name: 'Ashtavinayak Temples',
    location: 'Maharashtra (8 temples across the state)',
    deity: 'Lord Ganesha (8 different forms)',
    architecture: 'Traditional Maharashtra temple style',
    significance: 'Eight ancient Ganesha temples in Maharashtra, each with a self-manifested (swayambhu) idol. Completing the full circuit is considered highly auspicious.',
    bestTimeToVisit: 'October to March ( winter); Ganesh Chaturthi (Aug-Sep)',
    dressCode: 'Modest clothing. Traditional wear preferred.',
    entryFee: 'Free entry at all 8 temples',
    aartiTimings: 'Varies by temple - generally 6:00 AM - 9:00 PM',
    openingHours: '5:00 AM - 9:00 PM (varies by temple)',
    duration: '3-4 days (full circuit)',
    howToReach: {
      flight: 'Pune Airport (PNQ) - starting point for the circuit',
      train: 'Pune Junction (PUNE) - then hire a car for the circuit',
      road: 'Self-drive or hired car recommended (covers 500+ km total)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Temple Dharamshalas at each stop', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Local hotels at each temple town', price: '\u20B91,200 - \u20B93,000/night' },
      { type: 'Luxury', name: 'Taj/ITC at Pune (base)', price: '\u20B95,000 - \u20B910,000/night' }
    ],
    estimatedBudget: '\u20B95,000 - \u20B912,000 per person (3-4 days)',
    tips: [
      'Best done as a road trip with a private car',
      'The 8 temples are: Morgaon, Siddhatek, Pali, Mahad, Theur, Lenyadri, Ozar, Vigneshwar',
      'Carry flowers and modak offerings for each temple',
      'Start from Morgaon (Moreshwar) and end there (circular route)',
      'Each temple has its own unique history and architecture',
      '2-3 temples can be covered per day'
    ]
  },
  {
    id: 'konark',
    name: 'Konark Sun Temple',
    location: 'Konark, Odisha',
    deity: 'Surya (Sun God)',
    architecture: 'Kalinga (designed as a massive chariot)',
    significance: 'UNESCO World Heritage Site. Built in the 13th century as a massive stone chariot with 24 wheels and 7 horses. The temple is an architectural marvel and astronomical masterpiece.',
    bestTimeToVisit: 'October to March (winter); December for Konark Dance Festival',
    dressCode: 'No strict dress code. Modest clothing preferred.',
    entryFee: 'Indians: \u20B940 | Foreigners: \u20B9600',
    aartiTimings: 'No active worship (archaeological site managed by ASI)',
    openingHours: '6:00 AM - 6:00 PM (daily)',
    duration: '1 day (combine with Puri)',
    howToReach: {
      flight: 'Bhubaneswar Airport (BBI) - 65 km',
      train: 'Konark (KON) or Puri (PURI) - 35 km',
      road: 'Buses from Bhubaneswar (1.5 hrs), Puri (1 hr)'
    },
    whereToStay: [
      { type: 'Budget', name: 'OTDC Panthanivas / Local hotels', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'ITC Fortune / Holiday Resort', price: '\u20B92,500 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Mayfair Waves / The Chariot Resort', price: '\u20B95,000 - \u20B912,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B910,000 per person (1 day)',
    tips: [
      'Hire a guide at the entrance for detailed history (ASI-approved guides available)',
      'The Konark Dance Festival (Dec) features classical dancers at the temple',
      'Combine with Puri Jagannath Temple and Chilika Lake',
      'Chandrabhaga Beach is 3 km away - worth a visit',
      'The wheel sculptures show time calculations - amazing engineering',
      'Carry water and sunscreen - limited shade inside'
    ]
  },
  {
    id: 'katra-vaishno-devi',
    name: 'Vaishno Devi Temple',
    location: 'Katra, Jammu & Kashmir',
    deity: 'Goddess Vaishno Devi (Mata)',
    architecture: 'Natural cave temple',
    significance: 'One of the most visited Hindu temples (80 lakh+ devotees annually). The cave shrine at 5,200 ft altitude houses three natural rock formations (Pindies) representing the goddess.',
    bestTimeToVisit: 'March to October; avoid winter (heavy snowfall, difficult trek)',
    dressCode: 'Comfortable trekking clothes. Traditional wear not mandatory but modest clothing.',
    entryFee: 'Free entry | Ponny/Palki: \u20B91,100 - \u20B92,500',
    aartiTimings: 'Morning Aarti: 6:00 AM | Evening Aarti: 7:00 PM',
    openingHours: '24 hours (trek starts at 4:00 AM from Katra)',
    duration: '1-2 days',
    howToReach: {
      flight: 'Jammu Airport (IXJ) - 50 km from Katra',
      train: 'Katra Railway Station (SVDK) - direct trains from Delhi',
      road: 'Buses from Jammu (2 hrs), Delhi (12 hrs)'
    },
    whereToStay: [
      { type: 'Budget', name: 'Shri Mata Vaishno Devi Shrine Board Guest House', price: '\u20B9200 - \u20B9600/night' },
      { type: 'Mid-Range', name: 'Hotel Hari View / The Residency', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'The White Hotels / Country Inn', price: '\u20B94,000 - \u20B98,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B910,000 per person (1-2 days)',
    tips: [
      'Register at the official website before starting the trek',
      'The 12 km trek from Katra takes 4-6 hours',
      'Ponies, Palki, and battery cars available for elderly/disabled',
      'Carry water, snacks, and basic medicines',
      'The cave shrine has natural hot springs - carry a change of clothes',
      'Bhairavnath Temple (2.5 km from main shrine) offers great views'
    ]
  }
];

const destinations = [
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    region: 'North India',
    icon: Mountain,
    color: '#3b82f6',
    seasons: ['summer', 'winter'],
    groupTypes: ['family', 'couples', 'friends', 'solo-male', 'solo-female'],
    budget: 'budget',
    description: 'A stunning hill station nestled in the Kullu Valley, surrounded by towering snow-capped peaks, lush valleys, and the Beas River. Perfect for adventure lovers and nature enthusiasts.',
    bestTimeToVisit: 'March to June (summer) for pleasant weather; December to February for snowfall',
    duration: '3-5 days',
    placesToVisit: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali', 'Jogini Waterfall', 'Manu Temple', 'Vashisht Hot Springs', 'Mall Road'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Manali / Hosteller', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Hotel Beas / Snow Valley Resorts', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'The Himalayan / Snowcrest Resort', price: '\u20B96,000 - \u20B915,000/night' }
    ],
    estimatedBudget: '\u20B98,000 - \u20B925,000 per person (3-5 days)',
    howToReach: {
      flight: 'Nearest airport: Bhuntar (KUU) - 50 km from Manali',
      train: 'Nearest railway: Joginder Nagar (160 km) or Chandigarh (310 km)',
      road: 'Volvo buses from Delhi (12-14 hrs), self-drive or taxi from Chandigarh (8-9 hrs)'
    },
    tips: ['Carry warm clothes even in summer', 'Book Rohtang Pass permits online in advance', 'Avoid peak season (May-June) for fewer crowds', 'Try local Himachali cuisine - Siddu and Dham']
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    region: 'North India',
    icon: Mountain,
    color: '#6366f1',
    seasons: ['summer', 'winter'],
    groupTypes: ['family', 'couples', 'friends'],
    budget: 'budget',
    description: 'The former summer capital of British India, Shimla charms with its colonial architecture, the iconic Mall Road, and panoramic views of the Himalayas.',
    bestTimeToVisit: 'March to June for pleasant weather; December to January for snowfall',
    duration: '2-4 days',
    placesToVisit: ['Mall Road', 'Ridge', 'Jakhoo Temple', 'Christ Church', 'Kufri', 'Chadwick Falls', 'Toy Train Ride', 'Naldehra'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Shimla / Backpacker Inn', price: '\u20B9500 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Hotel Combermere / Willow Banks', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Wildflower Hall / Radisson Hotel', price: '\u20B98,000 - \u20B925,000/night' }
    ],
    estimatedBudget: '\u20B96,000 - \u20B920,000 per person (2-4 days)',
    howToReach: {
      flight: 'Nearest airport: Jubbarhatti (SHL) - 23 km',
      train: 'Kalka-Shimla Toy Train (UNESCO heritage, 5-6 hrs from Kalka)',
      road: 'HRTC Volvo buses from Delhi (8-10 hrs), 370 km via Chandigarh'
    },
    tips: ['Walk the Mall Road in the evening for the best experience', 'Book Toy Train tickets well in advance', 'Kufri is a short 16 km drive - great for day trip', 'Carry an umbrella in monsoon season']
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    region: 'West India',
    icon: Waves,
    color: '#f59e0b',
    seasons: ['winter', 'autumn'],
    groupTypes: ['friends', 'couples', 'solo-male', 'solo-female'],
    budget: 'budget',
    description: 'India\'s smallest state is a vibrant beach paradise with Portuguese colonial heritage, electrifying nightlife, water sports, and a laid-back vibe that attracts travelers worldwide.',
    bestTimeToVisit: 'November to February (winter) for best weather',
    duration: '3-5 days',
    placesToVisit: ['Baga Beach', 'Calangute Beach', 'Anjuna Flea Market', 'Basilica of Bom Jesus', 'Fort Aguada', 'Dudhsagar Falls', 'Chapora Fort', 'Palolem Beach'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Goa / Hostel World', price: '\u20B9400 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Resort Rio / Acacia Palms', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Taj Exotica / The Leela', price: '\u20B910,000 - \u20B935,000/night' }
    ],
    estimatedBudget: '\u20B98,000 - \u20B925,000 per person (3-5 days)',
    howToReach: {
      flight: 'Dabolim Airport (GOI) or Manohar Parrikar Airport (GOX) - direct flights from all major cities',
      train: 'Madgaon (MAO) or Thivim (THVM) - well connected',
      road: 'NH66 from Mumbai (10-12 hrs), self-drive or buses available'
    },
    tips: ['Rent a scooter to explore Goa cheaply', 'Visit Old Goa for churches and heritage', 'Anjuna flea market is every Wednesday', 'South Goa is quieter and less crowded']
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North India',
    icon: Landmark,
    color: '#ec4899',
    seasons: ['winter', 'monsoon'],
    groupTypes: ['family', 'couples', 'friends', 'solo-male', 'solo-female'],
    budget: 'budget',
    description: 'The "Pink City" of India is a royal feast of majestic forts, palaces, vibrant bazaars, and rich Rajasthani culture. Part of the Golden Triangle tourist circuit.',
    bestTimeToVisit: 'October to March (winter) for pleasant weather',
    duration: '2-3 days',
    placesToVisit: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Jal Mahal', 'Albert Hall Museum', 'Birla Mandir'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Jaipur / Moustache Hostel', price: '\u20B9400 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Hotel Pearl Palace / Holiday Inn', price: '\u20B91,500 - \u20B94,000/night' },
      { type: 'Luxury', name: 'Rambagh Palace / Samode Haveli', price: '\u20B98,000 - \u20B930,000/night' }
    ],
    estimatedBudget: '\u20B96,000 - \u20B920,000 per person (2-3 days)',
    howToReach: {
      flight: 'Jaipur International Airport (JAI) - direct flights from all major cities',
      train: 'Jaipur Junction (JP) - Shatabdi, Rajdhani, and many express trains',
      road: 'NH48 from Delhi (5-6 hrs, 280 km), frequent buses'
    },
    tips: ['Visit Amber Fort early morning to avoid crowds', 'Shop for block print textiles and blue pottery', 'Eat at Lassiwala on MI Road for the best lassi', 'Combine with Jaisalmer and Udaipur for a full Rajasthan trip']
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North India',
    icon: Landmark,
    color: '#eab308',
    seasons: ['winter', 'autumn'],
    groupTypes: ['solo-male', 'solo-female', 'family', 'friends'],
    budget: 'budget',
    description: 'One of the oldest continuously inhabited cities in the world, Varanasi is the spiritual heart of India. The Ganga Aarti at Dashashwamedh Ghat is an unforgettable experience.',
    bestTimeToVisit: 'October to March (winter); avoid summer (extreme heat)',
    duration: '2-3 days',
    placesToVisit: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Assi Ghat', 'Manikarnika Ghat', 'Sarnath', 'Ramnagar Fort', 'BHU Campus', 'Ganga Boat Ride'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Varanasi / Ganpati Guest House', price: '\u20B9300 - \u20B9800/night' },
      { type: 'Mid-Range', name: 'Hotel Ganges / Ramada Plaza', price: '\u20B91,500 - \u20B94,000/night' },
      { type: 'Luxury', name: 'Taj Nadesar Palace / BrijRama Palace', price: '\u20B98,000 - \u20B925,000/night' }
    ],
    estimatedBudget: '\u20B94,000 - \u20B915,000 per person (2-3 days)',
    howToReach: {
      flight: 'Lal Bahadur Shastri Airport (VNS) - flights from Delhi, Mumbai',
      train: 'Varanasi Junction (BSB) or Deen Dayal Upadhyaya Junction (DDU, 18 km)',
      road: 'Buses from Delhi (12-14 hrs), Prayagraj (3 hrs)'
    },
    tips: ['Witness the Ganga Aarti at Dashashwamedh Ghat (6:30 PM daily)', 'Take an early morning boat ride for the best experience', 'Visit Sarnath where Buddha gave his first sermon', 'Try the famous Banarasi paan and kachori']
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    region: 'North India',
    icon: Compass,
    color: '#06b6d4',
    seasons: ['summer', 'winter', 'autumn'],
    groupTypes: ['friends', 'solo-male', 'solo-female', 'family'],
    budget: 'budget',
    description: 'The "Yoga Capital of the World" sits at the foothills of the Himalayas where the Ganges emerges from the mountains. Adventure sports, temples, and spiritual retreats abound.',
    bestTimeToVisit: 'September to November (autumn) and February to May (summer)',
    duration: '2-4 days',
    placesToVisit: ['Laxman Jhula', 'Ram Jhula', 'Triveni Ghat', 'Beatles Ashram', 'Neer Garh Waterfall', 'River Rafting', 'Cliff Jumping', 'Kunjapuri Temple'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Rishikesh / GoStops', price: '\u20B9400 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Hotel Ganga Kinare / Aloha', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Taj Rishikesh Resort / JW Marriott', price: '\u20B98,000 - \u20B920,000/night' }
    ],
    estimatedBudget: '\u20B95,000 - \u20B918,000 per person (2-4 days)',
    howToReach: {
      flight: 'Nearest airport: Dehradun (DED) - 35 km',
      train: 'Haridwar Junction (HW) - 25 km, then taxi/bus',
      road: 'Buses from Delhi (6-7 hrs, 240 km)'
    },
    tips: ['Try river rafting (Grade 1-3 rapids) for thrill', 'Visit Beatles Ashram for a unique experience', 'Attend Ganga Aarti at Parmarth Niketan', 'Book yoga courses in advance for best prices']
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    state: 'Jammu & Kashmir / Ladakh UT',
    region: 'North India',
    icon: Mountain,
    color: '#0ea5e9',
    seasons: ['summer'],
    groupTypes: ['friends', 'solo-male', 'couples'],
    budget: 'mid',
    description: 'The "Land of High Passes" offers breathtaking landscapes, ancient monasteries, crystal-clear lakes, and some of the world\'s highest motorable roads.',
    bestTimeToVisit: 'June to September (summer); avoid winter as roads close',
    duration: '5-8 days',
    placesToVisit: ['Pangong Lake', 'Nubra Valley', 'Khardung La', 'Leh Palace', 'Thiksey Monastery', 'Magnetic Hill', 'Zanskar Valley', 'Shanti Stupa'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Leh / Hosteller Ladakh', price: '\u20B9800 - \u20B91,500/night' },
      { type: 'Mid-Range', name: 'Hotel Ladakh Palace / Grand Dragon', price: '\u20B93,000 - \u20B96,000/night' },
      { type: 'Luxury', name: 'The Grand Dragon / Orient', price: '\u20B98,000 - \u20B918,000/night' }
    ],
    estimatedBudget: '\u20B920,000 - \u20B950,000 per person (5-8 days)',
    howToReach: {
      flight: 'Direct flights to Kushok Bakula Rimpochee Airport (IXL) from Delhi, Mumbai, Srinagar',
      train: 'Nearest railway: Jammu Tawi (700 km)',
      road: 'Manali-Leh Highway (474 km, 2 days) or Srinagar-Leh Highway (434 km)'
    },
    tips: ['Acclimatize for 1-2 days in Leh before going to higher altitudes', 'Carry medicines for altitude sickness', 'Inner Line Permit required for Nubra/Pangong - apply online', 'Rent a Royal Enfield for the ultimate Ladakh experience']
  },
  {
    id: 'kashmir',
    name: 'Kashmir (Gulmarg & Pahalgam)',
    state: 'Jammu & Kashmir',
    region: 'North India',
    icon: Mountain,
    color: '#0ea5e9',
    seasons: ['summer', 'winter'],
    groupTypes: ['family', 'couples', 'friends'],
    budget: 'mid',
    description: 'Paradise on Earth with snow-capped mountains, serene valleys, Mughal gardens, and the famous Gulmarg gondola. Every season offers a different magic.',
    bestTimeToVisit: 'March to October (summer for gardens); December to February (winter for skiing)',
    duration: '4-6 days',
    placesToVisit: ['Gulmarg Gondola', 'Dal Lake Shikara', 'Pahalgam Valley', 'Sonamarg', 'Nishat Garden', 'Shalimar Bagh', 'Betaab Valley', 'Aru Valley'],
    whereToStay: [
      { type: 'Budget', name: 'Houseboats on Dal Lake', price: '\u20B91,000 - \u20B92,500/night' },
      { type: 'Mid-Range', name: 'Hotel Heevan / Jamal Resort', price: '\u20B93,000 - \u20B96,000/night' },
      { type: 'Luxury', name: 'The Lalit Grand Palace / Khyber Himalayan', price: '\u20B910,000 - \u20B930,000/night' }
    ],
    estimatedBudget: '\u20B912,000 - \u20B935,000 per person (4-6 days)',
    howToReach: {
      flight: 'Sheikh ul-Alam Airport (SXR) in Srinagar - direct flights from Delhi, Mumbai',
      train: 'Srinagar (SINA) - Vande Bharat from Delhi',
      road: 'Delhi to Srinagar via NH44 (850 km, 13-14 hrs)'
    },
    tips: ['Stay in a houseboat for a unique experience', 'Gulmarg gondola is Asia\'s highest - book early', 'Carry warm clothes even in summer', 'Try Kashmiri Wazwan cuisine and kahwa tea']
  },
  {
    id: 'andaman',
    name: 'Andaman Islands',
    state: 'Andaman & Nicobar Islands',
    region: 'Islands',
    icon: Waves,
    color: '#0ea5e9',
    seasons: ['winter', 'autumn'],
    groupTypes: ['couples', 'friends', 'family'],
    budget: 'premium',
    description: 'A tropical paradise with pristine white-sand beaches, crystal-clear turquoise waters, vibrant coral reefs, and a dark history at the Cellular Jail.',
    bestTimeToVisit: 'October to May (winter and summer); avoid monsoon (June-September)',
    duration: '4-6 days',
    placesToVisit: ['Radhanagar Beach', 'Cellular Jail', 'Ross Island', 'Havelock Island', 'Elephant Beach', 'Baratang Island', 'Neil Island', 'Mahatma Gandhi Marine National Park'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Andaman / SeaShell Hostel', price: '\u20B9800 - \u20B91,500/night' },
      { type: 'Mid-Range', name: 'SeaShell Resort / Silver Sands', price: '\u20B93,000 - \u20B97,000/night' },
      { type: 'Luxury', name: 'Taj Exotica / Jalakara', price: '\u20B910,000 - \u20B930,000/night' }
    ],
    estimatedBudget: '\u20B915,000 - \u20B940,000 per person (4-6 days)',
    howToReach: {
      flight: 'Veer Savarkar Airport (IXZ) in Port Blair - flights from Delhi, Chennai, Kolkata',
      train: 'No railway connectivity',
      road: 'Ferries between islands (book via Makruzz or Green Ocean)'
    },
    tips: ['Book flights and ferries 2-3 months in advance', 'Carry cash - ATMs are limited on islands', 'Try scuba diving at Havelock for coral reefs', 'Carry sunscreen and mosquito repellent']
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    state: 'Meghalaya',
    region: 'East India',
    icon: TreePalm,
    color: '#22c55e',
    seasons: ['summer', 'autumn'],
    groupTypes: ['friends', 'solo-male', 'solo-female', 'family'],
    budget: 'budget',
    description: 'The "Abode of Clouds" offers living root bridges, crystal-clear rivers, spectacular waterfalls, and the wettest place on Earth - Cherrapunji.',
    bestTimeToVisit: 'October to May; March to May for pleasant weather',
    duration: '4-6 days',
    placesToVisit: ['Living Root Bridges', 'Dawki River', 'Cherrapunji', 'Mawsmai Cave', 'Nohkalikai Falls', 'Elephant Falls', 'Shillong Peak', 'Mawlynnong Village'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Shillong / Hotel Centre Point', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Hotel Quintaira / Ri Kynjai', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Ri Kynjai / Welcomhotel by ITC', price: '\u20B96,000 - \u20B915,000/night' }
    ],
    estimatedBudget: '\u20B910,000 - \u20B925,000 per person (4-6 days)',
    howToReach: {
      flight: 'Shillong Airport (SHL) - limited flights; Guwahati Airport (GAU) - 3 hours drive',
      train: 'Guwahati (GHY) - major junction, then 3 hrs by road',
      road: 'Buses from Guwahati (3-4 hrs)'
    },
    tips: ['Carry rain gear at all times - weather is unpredictable', 'Try local Khasi food - Jadoh and Tungrymbai', 'Dawki river boat ride is a must', 'Hire a local guide for living root bridge treks']
  },
  {
    id: 'ooty',
    name: 'Ooty',
    state: 'Tamil Nadu',
    region: 'South India',
    icon: TreePalm,
    color: '#10b981',
    seasons: ['summer', 'spring'],
    groupTypes: ['family', 'couples', 'friends'],
    budget: 'budget',
    description: 'The "Queen of Hill Stations" in the Nilgiri Hills is known for its tea plantations, botanical gardens, the iconic Nilgiri Mountain Railway, and pleasant weather year-round.',
    bestTimeToVisit: 'October to June; avoid monsoon (July-September)',
    duration: '2-4 days',
    placesToVisit: ['Botanical Garden', 'Ooty Lake', 'Nilgiri Mountain Railway', 'Doddabetta Peak', 'Rose Garden', 'Tea Museum', 'Pykara Falls', 'Coonoor'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Ooty / Garden Manor', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Sterling Ooty / Gem Park', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'Savoy Hotel / Fortune Resort Sullivan', price: '\u20B96,000 - \u20B915,000/night' }
    ],
    estimatedBudget: '\u20B96,000 - \u20B918,000 per person (2-4 days)',
    howToReach: {
      flight: 'Nearest airport: Coimbatore (CJB) - 88 km',
      train: 'Mettupalayam station (35 km), then Nilgiri Mountain Railway',
      road: 'Buses from Coimbatore (4-5 hrs), Chennai (10 hrs)'
    },
    tips: ['Take the Nilgiri Mountain Railway - a UNESCO World Heritage site', 'Try homemade chocolates and fresh tea from local shops', 'Visit Coonoor as a day trip for quieter experience', 'Book well in advance during summer (April-May)']
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    region: 'South India',
    icon: TreePalm,
    color: '#14b8a6',
    seasons: ['summer', 'winter'],
    groupTypes: ['family', 'couples', 'friends'],
    budget: 'budget',
    description: 'A serene hill station in the Western Ghats, famous for its vast tea plantations, misty hills, waterfalls, and the rare Neelakurinji flowers that bloom once in 12 years.',
    bestTimeToVisit: 'September to March (post-monsoon and winter)',
    duration: '2-4 days',
    placesToVisit: ['Eravikulam National Park', 'Tea Museum', 'Top Station', 'Mattupetty Dam', 'Attukal Waterfalls', 'Echo Point', 'Kundala Lake', 'Anamudi Peak'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Munnar / Backpacker\'s Inn', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Blanket Hotel / KTDC Tea Valley', price: '\u20B92,000 - \u20B95,000/night' },
      { type: 'Luxury', name: 'SpiceTree / Chandy\'s Windy Woods', price: '\u20B96,000 - \u20B915,000/night' }
    ],
    estimatedBudget: '\u20B97,000 - \u20B920,000 per person (2-4 days)',
    howToReach: {
      flight: 'Nearest airport: Kochi (COK) - 110 km or Madurai (IXM) - 140 km',
      train: 'Nearest station: Aluva (110 km) or Theni (60 km)',
      road: 'KSRTC buses from Kochi (4-5 hrs), Madurai (4 hrs)'
    },
    tips: ['Visit Eravikulam early morning to spot Nilgiri Tahr', 'Stay in a tea estate cottage for the best experience', 'Carry light warm clothes as evenings can be cool', 'Try fresh cardamom and pepper from local markets']
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    region: 'South India',
    icon: Landmark,
    color: '#f59e0b',
    seasons: ['winter', 'autumn'],
    groupTypes: ['solo-male', 'solo-female', 'friends', 'couples'],
    budget: 'budget',
    description: 'A UNESCO World Heritage Site with surreal boulder-strewn landscapes and the magnificent ruins of the Vijayanagara Empire. A backpacker\'s paradise.',
    bestTimeToVisit: 'October to February (winter); avoid summer (extreme heat)',
    duration: '2-3 days',
    placesToVisit: ['Virupaksha Temple', 'Vittala Temple (Stone Chariot)', 'Hampi Bazaar', 'Matanga Hill', 'Hippie Island', 'Coracle Ride', 'Royal Enclosure', 'Lotus Mahal'],
    whereToStay: [
      { type: 'Budget', name: 'Goan Corner / Gopi Guest House (Hippie Island)', price: '\u20B9300 - \u20B9800/night' },
      { type: 'Mid-Range', name: 'Heritage Resort / Clarks Inn', price: '\u20B91,500 - \u20B94,000/night' },
      { type: 'Luxury', name: 'Evolve Back Hampi (formerly Orange County)', price: '\u20B915,000 - \u20B940,000/night' }
    ],
    estimatedBudget: '\u20B94,000 - \u20B912,000 per person (2-3 days)',
    howToReach: {
      flight: 'Nearest airport: Hubli (HBX) - 150 km or Belgaum (IXG) - 190 km',
      train: 'Hospet Junction (HPT) - 13 km from Hampi',
      road: 'Bus from Bangalore (7-8 hrs, 350 km) or Goa (4-5 hrs)'
    },
    tips: ['Rent a bicycle or moped to explore ruins', 'Sunset from Matanga Hill is unforgettable', 'Take a coracle ride on the Tungabhadra River', 'Stay on Hippie Island for a laid-back vibe']
  },
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    region: 'South India',
    icon: TreePalm,
    color: '#14b8a6',
    seasons: ['monsoon', 'winter', 'summer'],
    groupTypes: ['family', 'couples', 'friends'],
    budget: 'budget',
    description: 'The "Scotland of India" is a misty hill district known for its coffee plantations, lush forests, orange groves, and warm Kodava hospitality.',
    bestTimeToVisit: 'October to May; monsoon (June-September) for waterfalls',
    duration: '2-4 days',
    placesToVisit: ['Abbey Falls', 'Raja\'s Seat', 'Dubare Elephant Camp', 'Talacauvery', 'Namdroling Monastery', 'Iruppu Falls', 'Madikeri Fort', 'Coffee Plantation Tour'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Coorg / Backpacker\'s Nest', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Coorg Wilderness Resort / Tamara', price: '\u20B92,500 - \u20B96,000/night' },
      { type: 'Luxury', name: 'Tamara Coorg / Evolve Back', price: '\u20B98,000 - \u20B925,000/night' }
    ],
    estimatedBudget: '\u20B96,000 - \u20B920,000 per person (2-4 days)',
    howToReach: {
      flight: 'Nearest airport: Mangalore (IXE) - 160 km or Bangalore (BLR) - 260 km',
      train: 'Nearest station: Mysore (MYS) - 120 km',
      road: 'Buses from Bangalore (5-6 hrs), self-drive recommended'
    },
    tips: ['Stay in a coffee plantation homestay for authentic experience', 'Try Kodava-style pork curry and akki roti', 'Namdroling Monastery (Golden Temple) is stunning', 'Best explored by self-drive car']
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    state: 'Himachal Pradesh',
    region: 'North India',
    icon: Mountain,
    color: '#6366f1',
    seasons: ['summer'],
    groupTypes: ['friends', 'solo-male', 'solo-female'],
    budget: 'mid',
    description: 'A cold desert mountain valley high in the Himalayas, Spiti is a remote paradise with ancient monasteries, turquoise lakes, and the world\'s highest village.',
    bestTimeToVisit: 'June to September (summer); roads close in winter',
    duration: '7-10 days',
    placesToVisit: ['Key Monastery', 'Chandratal Lake', 'Kibber Village', 'Dhankar Monastery', 'Langza Village', 'Hikkim (Highest Post Office)', 'Kunzum Pass', 'Pin Valley'],
    whereToStay: [
      { type: 'Budget', name: 'Homestays in Kibber/Langza', price: '\u20B9500 - \u20B91,200/night (with meals)' },
      { type: 'Mid-Range', name: 'Hotel Deyzor / Spiti Village Resort', price: '\u20B91,500 - \u20B93,500/night' },
      { type: 'Luxury', name: 'Limited options - mostly homestays', price: 'N/A' }
    ],
    estimatedBudget: '\u20B915,000 - \u20B930,000 per person (7-10 days)',
    howToReach: {
      flight: 'Nearest airport: Bhuntar (KUU) - 200 km',
      train: 'Nearest railway: Joginder Nagar or Chandigarh',
      road: 'Manali-Kaza road (8-10 hrs, 200 km) - only in summer'
    },
    tips: ['Inner Line Permit required - apply online', 'Carry warm layers - temperatures drop below 0\u00B0C', 'ATMs are rare - carry enough cash', 'Respect local culture and photography rules at monasteries']
  },
  {
    id: 'valley-of-flowers',
    name: 'Valley of Flowers',
    state: 'Uttarakhand',
    region: 'North India',
    icon: TreePalm,
    color: '#ec4899',
    seasons: ['monsoon'],
    groupTypes: ['friends', 'solo-male', 'solo-female'],
    budget: 'mid',
    description: 'A UNESCO World Heritage Site that blooms with hundreds of species of alpine flowers during monsoon. A breathtaking trek through one of nature\'s most beautiful creations.',
    bestTimeToVisit: 'July to September (monsoon - only time flowers bloom)',
    duration: '4-6 days (including trek)',
    placesToVisit: ['Valley of Flowers Trek', 'Hemkund Sahib', 'Ghangaria', 'Badrinath', 'Mana Village', 'Joshimath', 'Auli', 'Govind Ghat'],
    whereToStay: [
      { type: 'Budget', name: 'Guesthouses in Ghangaria', price: '\u20B9500 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'GMVN Tourist Rest House', price: '\u20B91,500 - \u20B93,000/night' },
      { type: 'Luxury', name: 'Limited options - mostly basic stays', price: 'N/A' }
    ],
    estimatedBudget: '\u20B910,000 - \u20B920,000 per person (4-6 days)',
    howToReach: {
      flight: 'Nearest airport: Dehradun (DED) - 300 km',
      train: 'Haridwar (HW) - 320 km, then road to Govind Ghat',
      road: 'Drive/bus to Govind Ghat (14 hrs from Haridwar)'
    },
    tips: ['Trek from Ghangaria to valley is 17 km round trip', 'Entry permits required - book at Forest Check Post', 'Carry rain gear and trekking shoes', 'Combine with Hemkund Sahib and Badrinath']
  },
  {
    id: 'lonavala',
    name: 'Lonavala & Khandala',
    state: 'Maharashtra',
    region: 'West India',
    icon: Mountain,
    color: '#10b981',
    seasons: ['monsoon', 'winter'],
    groupTypes: ['family', 'friends', 'couples'],
    budget: 'budget',
    description: 'Twin hill stations in the Sahyadri mountains, famous for their lush green valleys during monsoon, ancient caves, and the iconic chikki (sweet snack).',
    bestTimeToVisit: 'July to September (monsoon for green landscapes) and October to May',
    duration: '1-2 days',
    placesToVisit: ['Bhushi Dam', 'Tiger\'s Leap', 'Karla Caves', 'Bhaja Caves', 'Lohagad Fort', 'Rajmachi Point', 'Valvan Dam', 'Duke\'s Nose'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Lonavala / Backpacker Panda', price: '\u20B9500 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Fariyas Resort / Della Resort', price: '\u20B93,000 - \u20B97,000/night' },
      { type: 'Luxury', name: 'The Machan / Della Adventure Resort', price: '\u20B98,000 - \u20B920,000/night' }
    ],
    estimatedBudget: '\u20B93,000 - \u20B912,000 per person (1-2 days)',
    howToReach: {
      flight: 'Nearest airport: Pune (PNQ) - 65 km or Mumbai (BOM) - 100 km',
      train: 'Lonavala (LNL) - trains from Mumbai (Pune-Mumbai line)',
      road: 'Mumbai-Pune Expressway (1.5-2 hrs from either city)'
    },
    tips: ['Monsoon is the best time - everything turns green', 'Try the famous Lonavala chikki from Chikki Mahal', 'Bhushi Dam is crowded on weekends - go on weekdays', 'Carry a raincoat during monsoon visits']
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    region: 'South India',
    icon: TreePalm,
    color: '#22c55e',
    seasons: ['monsoon', 'winter', 'summer'],
    groupTypes: ['family', 'couples', 'friends'],
    budget: 'budget',
    description: 'A lush green hill district in Kerala with spice plantations, wildlife sanctuaries, caves, and stunning viewpoints. Perfect for nature lovers.',
    bestTimeToVisit: 'October to May; monsoon (June-September) for lush greenery',
    duration: '2-4 days',
    placesToVisit: ['Edakkal Caves', 'Banasura Sagar Dam', 'Chembra Peak', 'Wayanad Wildlife Sanctuary', 'Soochipara Falls', 'Pookode Lake', 'Lakkidi Viewpoint', 'Kuruva Island'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Wayanad / Backpacker\'s Inn', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'Windflower Resort / The Windwood', price: '\u20B92,500 - \u20B96,000/night' },
      { type: 'Luxury', name: 'Vythiri Village Resort / Chateau Woods', price: '\u20B97,000 - \u20B918,000/night' }
    ],
    estimatedBudget: '\u20B96,000 - \u20B918,000 per person (2-4 days)',
    howToReach: {
      flight: 'Nearest airport: Calicut (CCJ) - 100 km',
      train: 'Kozhikode (CLT) - 110 km, then bus/taxi',
      road: 'Buses from Bangalore (5-6 hrs, 280 km), Kochi (4 hrs)'
    },
    tips: ['Edakkal Caves require a steep climb - wear good shoes', 'Try Kerala-style biryani and puttu with kadala curry', 'Chembra Peak trek needs prior permission', 'Carry leech socks during monsoon treks']
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry',
    state: 'Tamil Nadu',
    region: 'South India',
    icon: Waves,
    color: '#3b82f6',
    seasons: ['winter', 'autumn'],
    groupTypes: ['friends', 'couples', 'solo-male', 'solo-female'],
    budget: 'budget',
    description: 'A charming French colonial town with tree-lined boulevards, pastel-colored buildings, serene beaches, and the spiritual haven of Auroville.',
    bestTimeToVisit: 'October to March (winter); avoid monsoon (June-September)',
    duration: '2-3 days',
    placesToVisit: ['Promenade Beach', 'Auroville', 'French Quarter', 'Paradise Beach', 'Aurobindo Ashram', 'Rock Beach', 'Chunnambar Backwaters', 'French War Memorial'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Pondicherry / Villa Shanti Hostel', price: '\u20B9400 - \u20B91,000/night' },
      { type: 'Mid-Range', name: 'Palais de Mahe / Villa Shanti', price: '\u20B92,500 - \u20B96,000/night' },
      { type: 'Luxury', name: 'The Promenade / Le Pondy', price: '\u20B97,000 - \u20B918,000/night' }
    ],
    estimatedBudget: '\u20B95,000 - \u20B915,000 per person (2-3 days)',
    howToReach: {
      flight: 'Nearest airport: Chennai (MAA) - 150 km',
      train: 'Pondicherry (PDY) - trains from Chennai, Bangalore',
      road: 'Buses from Chennai (3-4 hrs), Bangalore (7-8 hrs)'
    },
    tips: ['Rent a scooter to explore the French Quarter', 'Try French-Tamil fusion cuisine at local cafes', 'Visit Auroville early morning for peace', 'Beach road closes to traffic in the evening - great for walking']
  },
  {
    id: 'jim-corbett',
    name: 'Jim Corbett National Park',
    state: 'Uttarakhand',
    region: 'North India',
    icon: Compass,
    color: '#22c55e',
    seasons: ['winter', 'summer'],
    groupTypes: ['family', 'friends', 'couples'],
    budget: 'mid',
    description: 'India\'s oldest national park, famous for its Bengal tigers, diverse wildlife, and the opportunity to stay inside the jungle in forest rest houses.',
    bestTimeToVisit: 'November to March (winter); March to June (summer for tiger sightings)',
    duration: '2-3 days',
    placesToVisit: ['Dhikala Zone Safari', 'Bijrani Zone', 'Jhirna Zone', 'Corbett Museum', 'Garjia Temple', 'Kosi River', 'Sitabani Forest', 'Dhangarhi Museum'],
    whereToStay: [
      { type: 'Budget', name: 'Zostel Corbett / Backpacker\'s Den', price: '\u20B9500 - \u20B91,200/night' },
      { type: 'Mid-Range', name: 'The Riverview Retreat / Corbett Leela', price: '\u20B93,000 - \u20B96,000/night' },
      { type: 'Luxury', name: 'Aahana The Wilderness Resort / Namah', price: '\u20B98,000 - \u20B920,000/night' }
    ],
    estimatedBudget: '\u20B98,000 - \u20B925,000 per person (2-3 days)',
    howToReach: {
      flight: 'Nearest airport: Pantnagar (PGH) - 80 km',
      train: 'Ramnagar (RMR) - direct trains from Delhi',
      road: 'Delhi to Ramnagar (260 km, 6-7 hrs)'
    },
    tips: ['Dhikala Zone is the best but requires overnight stay', 'Book safari through official Corbett website only', 'Carry binoculars, camera with zoom lens, and earth-toned clothes', 'Elephant safari is available in some zones']
  }
];

const seasons = [
  { id: 'summer', label: 'Summer', icon: Sun, color: '#f59e0b', months: 'March - June', description: 'Escape the heat with cool hill stations and pleasant weather destinations' },
  { id: 'winter', label: 'Winter', icon: Snowflake, color: '#3b82f6', months: 'October - February', description: 'Perfect weather for beaches, deserts, heritage sites, and wildlife safaris' },
  { id: 'monsoon', label: 'Monsoon', icon: CloudRain, color: '#10b981', months: 'July - September', description: 'Lush green landscapes, stunning waterfalls, and misty hills come alive' }
];

const groupTypes = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'couples', label: 'Couples', icon: Heart },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'solo-male', label: 'Solo Male', icon: User },
  { id: 'solo-female', label: 'Solo Female', icon: User }
];

const categories = [
  { id: 'destinations', label: 'Destinations', icon: Compass },
  { id: 'temples', label: 'Temples', icon: Landmark }
];

const budgetLabels = {
  budget: { label: 'Budget-Friendly', color: '#10b981' },
  mid: { label: 'Mid-Range', color: '#f59e0b' },
  premium: { label: 'Premium', color: '#ef4444' }
};

function TourGuide() {
  const [activeCategory, setActiveCategory] = useState('destinations');
  const [activeSeason, setActiveSeason] = useState('winter');
  const [activeGroup, setActiveGroup] = useState('all');
  const [selectedDest, setSelectedDest] = useState(null);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchesSeason = dest.seasons.includes(activeSeason);
      const matchesGroup = activeGroup === 'all' || dest.groupTypes.includes(activeGroup);
      const matchesSearch = searchQuery === '' ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.region.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeason && matchesGroup && matchesSearch;
    });
  }, [activeSeason, activeGroup, searchQuery]);

  const filteredTemples = useMemo(() => {
    return temples.filter(temple => {
      const matchesSearch = searchQuery === '' ||
        temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.deity.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedDest(null);
      setSelectedTemple(null);
    }
  };

  return (
    <div className="tour-page">
      <div className="tour-header">
        <h1 className="tour-hero-title">
          <Compass size={28} /> Tour Guide - India
        </h1>
        <p className="tour-hero-desc">
          Plan your perfect Indian vacation. Discover destinations, temples, and spiritual places.
          From Himalayan peaks to ancient temples, find where to go, when to visit, and where to stay.
        </p>
      </div>

      <div className="tour-category-tabs">
        {categories.map(c => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              className={`tour-category-tab ${activeCategory === c.id ? 'active' : ''}`}
              onClick={() => { setActiveCategory(c.id); setSearchQuery(''); }}
            >
              <Icon size={16} />
              {c.label}
            </button>
          );
        })}
      </div>

      {activeCategory === 'destinations' && (
        <>
          <div className="tour-season-tabs">
            {seasons.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  className={`tour-season-tab ${activeSeason === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSeason(s.id)}
                  style={activeSeason === s.id ? { borderColor: s.color, color: s.color } : {}}
                >
                  <Icon size={16} />
                  <span>{s.label}</span>
                  <span className="season-months">{s.months}</span>
                </button>
              );
            })}
          </div>
          <p className="season-desc">{seasons.find(s => s.id === activeSeason)?.description}</p>

          <div className="tour-filters">
            <div className="tour-group-pills">
              {groupTypes.map(g => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.id}
                    className={`tour-pill ${activeGroup === g.id ? 'active' : ''}`}
                    onClick={() => setActiveGroup(g.id)}
                  >
                    <Icon size={14} />
                    {g.label}
                  </button>
                );
              })}
            </div>
            <div className="tour-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, state, region..."
                className="tour-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="tour-no-results">
              <Camera size={40} />
              <p>No destinations found for this combination.</p>
              <p className="tour-no-results-hint">Try changing the season, group type, or search query.</p>
            </div>
          ) : (
            <div className="tour-grid">
              {filteredDestinations.map(dest => {
                const Icon = dest.icon;
                const budgetInfo = budgetLabels[dest.budget];
                return (
                  <button
                    key={dest.id}
                    className="tour-card"
                    onClick={() => setSelectedDest(dest)}
                  >
                    <div className="tour-card-top">
                      <div className="tour-card-icon" style={{ background: `${dest.color}20`, color: dest.color }}>
                        <Icon size={22} />
                      </div>
                      <span className="tour-budget-badge" style={{ color: budgetInfo.color, background: `${budgetInfo.color}18` }}>
                        <Wallet size={12} /> {budgetInfo.label}
                      </span>
                    </div>
                    <h3 className="tour-card-name">{dest.name}</h3>
                    <p className="tour-card-state">{dest.state} &bull; {dest.region}</p>
                    <p className="tour-card-desc">{dest.description.slice(0, 100)}...</p>
                    <div className="tour-card-meta">
                      <span><Clock size={13} /> {dest.duration}</span>
                      <span><IndianRupee size={13} /> {dest.estimatedBudget.split('(')[0].trim()}</span>
                    </div>
                    <div className="tour-card-seasons">
                      {dest.seasons.map(seasonId => {
                        const seasonData = seasons.find(s => s.id === seasonId);
                        return (
                          <span key={seasonId} className="tour-card-season-tag" style={{ color: seasonData?.color }}>
                            {seasonData && <seasonData.icon size={11} />} {seasonData?.label}
                          </span>
                        );
                      })}
                    </div>
                    <span className="tour-card-cta">View Details <ChevronRight size={14} /></span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeCategory === 'temples' && (
        <>
          <div className="tour-temple-header">
            <p className="tour-temple-desc">
              Explore {temples.length} of India's most sacred temples. Find deity details, dress code, aarti timings, entry fees, and travel tips.
            </p>
            <div className="tour-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by temple, location, deity..."
                className="tour-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredTemples.length === 0 ? (
            <div className="tour-no-results">
              <Landmark size={40} />
              <p>No temples found matching your search.</p>
              <p className="tour-no-results-hint">Try a different search term.</p>
            </div>
          ) : (
            <div className="tour-grid">
              {filteredTemples.map(temple => (
                <button
                  key={temple.id}
                  className="tour-card tour-temple-card"
                  onClick={() => setSelectedTemple(temple)}
                >
                  <div className="tour-card-top">
                    <div className="tour-card-icon" style={{ background: '#f9731620', color: '#f97316' }}>
                      <Landmark size={22} />
                    </div>
                    <span className="tour-budget-badge temple-badge">
                      {temple.architecture}
                    </span>
                  </div>
                  <h3 className="tour-card-name">{temple.name}</h3>
                  <p className="tour-card-state">{temple.location}</p>
                  <p className="tour-temple-deity"><BookOpen size={12} /> Deity: {temple.deity}</p>
                  <p className="tour-card-desc">{temple.significance.slice(0, 120)}...</p>
                  <div className="tour-card-meta">
                    <span><Clock size={13} /> {temple.duration}</span>
                  </div>
                  <span className="tour-card-cta">View Details <ChevronRight size={14} /></span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="tour-booking-links">
        <h3>Plan & Book Your Trip</h3>
        <div className="tour-links-grid">
          <a href="https://www.makemytrip.com" target="_blank" rel="noopener noreferrer" className="tour-booking-link">
            <Plane size={16} /> MakeMyTrip
          </a>
          <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="tour-booking-link">
            <Train size={16} /> IRCTC Trains
          </a>
          <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="tour-booking-link">
            <Hotel size={16} /> Booking.com
          </a>
          <a href="https://www.cleartrip.com" target="_blank" rel="noopener noreferrer" className="tour-booking-link">
            <Car size={16} /> Cleartrip
          </a>
          <a href="https://www.yatra.com" target="_blank" rel="noopener noreferrer" className="tour-booking-link">
            <MapPin size={16} /> Yatra
          </a>
          <a href="https://www.goibibo.com" target="_blank" rel="noopener noreferrer" className="tour-booking-link">
            <Calendar size={16} /> Goibibo
          </a>
        </div>
      </div>

      {selectedDest && (
        <div className="tour-modal-overlay" onClick={handleOverlayClick}>
          <div className="tour-modal">
            <div className="tour-modal-header" style={{ borderColor: `${selectedDest.color}40` }}>
              <div className="tour-modal-header-left">
                <div className="tour-modal-icon" style={{ background: `${selectedDest.color}20`, color: selectedDest.color }}>
                  <selectedDest.icon size={22} />
                </div>
                <div>
                  <h2>{selectedDest.name}</h2>
                  <p className="tour-modal-subtitle">{selectedDest.state} &bull; {selectedDest.region}</p>
                </div>
              </div>
              <button className="tour-modal-close" onClick={() => setSelectedDest(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="tour-modal-body">
              <div className="tour-section">
                <h3><Compass size={16} /> Overview</h3>
                <p className="tour-text">{selectedDest.description}</p>
              </div>

              <div className="tour-section">
                <h3><Calendar size={16} /> Best Time to Visit</h3>
                <p className="tour-text tour-highlight-box" style={{ borderLeftColor: '#f59e0b' }}>
                  {selectedDest.bestTimeToVisit}
                </p>
              </div>

              <div className="tour-section">
                <h3><Clock size={16} /> Ideal Duration</h3>
                <p className="tour-text">{selectedDest.duration}</p>
              </div>

              <div className="tour-section">
                <h3><IndianRupee size={16} /> Estimated Budget</h3>
                <p className="tour-text tour-highlight-box" style={{ borderLeftColor: '#10b981' }}>
                  {selectedDest.estimatedBudget}
                </p>
              </div>

              <div className="tour-section">
                <h3><MapPin size={16} /> Places to Visit</h3>
                <div className="tour-places-grid">
                  {selectedDest.placesToVisit.map((place, i) => (
                    <span key={i} className="tour-place-tag">{place}</span>
                  ))}
                </div>
              </div>

              <div className="tour-section">
                <h3><Hotel size={16} /> Where to Stay</h3>
                <div className="tour-stay-list">
                  {selectedDest.whereToStay.map((stay, i) => (
                    <div key={i} className="tour-stay-row">
                      <div className="tour-stay-type">{stay.type}</div>
                      <div className="tour-stay-info">
                        <span className="tour-stay-name">{stay.name}</span>
                        <span className="tour-stay-price">{stay.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tour-section">
                <h3><Car size={16} /> How to Reach</h3>
                <div className="tour-reach-list">
                  {selectedDest.howToReach.flight && (
                    <div className="tour-reach-row">
                      <Plane size={16} className="tour-reach-icon" />
                      <div>
                        <span className="tour-reach-label">By Air:</span>
                        <span className="tour-reach-text">{selectedDest.howToReach.flight}</span>
                      </div>
                    </div>
                  )}
                  {selectedDest.howToReach.train && (
                    <div className="tour-reach-row">
                      <Train size={16} className="tour-reach-icon" />
                      <div>
                        <span className="tour-reach-label">By Train:</span>
                        <span className="tour-reach-text">{selectedDest.howToReach.train}</span>
                      </div>
                    </div>
                  )}
                  {selectedDest.howToReach.road && (
                    <div className="tour-reach-row">
                      <Car size={16} className="tour-reach-icon" />
                      <div>
                        <span className="tour-reach-label">By Road:</span>
                        <span className="tour-reach-text">{selectedDest.howToReach.road}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="tour-section">
                <h3><Shield size={16} /> Travel Tips</h3>
                <ul className="tour-tips-list">
                  {selectedDest.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTemple && (
        <div className="tour-modal-overlay" onClick={handleOverlayClick}>
          <div className="tour-modal">
            <div className="tour-modal-header" style={{ borderColor: '#f9731640' }}>
              <div className="tour-modal-header-left">
                <div className="tour-modal-icon" style={{ background: '#f9731620', color: '#f97316' }}>
                  <Landmark size={22} />
                </div>
                <div>
                  <h2>{selectedTemple.name}</h2>
                  <p className="tour-modal-subtitle">{selectedTemple.location}</p>
                </div>
              </div>
              <button className="tour-modal-close" onClick={() => setSelectedTemple(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="tour-modal-body">
              <div className="tour-section">
                <h3><BookOpen size={16} /> Deity</h3>
                <p className="tour-text">{selectedTemple.deity}</p>
              </div>

              <div className="tour-section">
                <h3><Landmark size={16} /> Architecture</h3>
                <p className="tour-text">{selectedTemple.architecture}</p>
              </div>

              <div className="tour-section">
                <h3><Star size={16} /> Significance</h3>
                <p className="tour-text">{selectedTemple.significance}</p>
              </div>

              <div className="tour-section">
                <h3><Calendar size={16} /> Best Time to Visit</h3>
                <p className="tour-text tour-highlight-box" style={{ borderLeftColor: '#f59e0b' }}>
                  {selectedTemple.bestTimeToVisit}
                </p>
              </div>

              <div className="tour-section">
                <h3><Clock size={16} /> Duration</h3>
                <p className="tour-text">{selectedTemple.duration}</p>
              </div>

              <div className="tour-section">
                <h3><IndianRupee size={16} /> Estimated Budget</h3>
                <p className="tour-text tour-highlight-box" style={{ borderLeftColor: '#10b981' }}>
                  {selectedTemple.estimatedBudget}
                </p>
              </div>

              <div className="tour-section">
                <h3><Shirt size={16} /> Dress Code</h3>
                <p className="tour-text tour-highlight-box" style={{ borderLeftColor: '#8b5cf6' }}>
                  {selectedTemple.dressCode}
                </p>
              </div>

              <div className="tour-section">
                <h3><Ticket size={16} /> Entry Fee</h3>
                <p className="tour-text">{selectedTemple.entryFee}</p>
              </div>

              <div className="tour-section">
                <h3><Bell size={16} /> Aarti / Darshan Timings</h3>
                <p className="tour-text" style={{ whiteSpace: 'pre-line' }}>{selectedTemple.aartiTimings}</p>
              </div>

              <div className="tour-section">
                <h3><Clock size={16} /> Opening Hours</h3>
                <p className="tour-text">{selectedTemple.openingHours}</p>
              </div>

              <div className="tour-section">
                <h3><Hotel size={16} /> Where to Stay</h3>
                <div className="tour-stay-list">
                  {selectedTemple.whereToStay.map((stay, i) => (
                    <div key={i} className="tour-stay-row">
                      <div className="tour-stay-type">{stay.type}</div>
                      <div className="tour-stay-info">
                        <span className="tour-stay-name">{stay.name}</span>
                        <span className="tour-stay-price">{stay.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tour-section">
                <h3><Car size={16} /> How to Reach</h3>
                <div className="tour-reach-list">
                  {selectedTemple.howToReach.flight && (
                    <div className="tour-reach-row">
                      <Plane size={16} className="tour-reach-icon" />
                      <div>
                        <span className="tour-reach-label">By Air:</span>
                        <span className="tour-reach-text">{selectedTemple.howToReach.flight}</span>
                      </div>
                    </div>
                  )}
                  {selectedTemple.howToReach.train && (
                    <div className="tour-reach-row">
                      <Train size={16} className="tour-reach-icon" />
                      <div>
                        <span className="tour-reach-label">By Train:</span>
                        <span className="tour-reach-text">{selectedTemple.howToReach.train}</span>
                      </div>
                    </div>
                  )}
                  {selectedTemple.howToReach.road && (
                    <div className="tour-reach-row">
                      <Car size={16} className="tour-reach-icon" />
                      <div>
                        <span className="tour-reach-label">By Road:</span>
                        <span className="tour-reach-text">{selectedTemple.howToReach.road}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="tour-section">
                <h3><Shield size={16} /> Tips</h3>
                <ul className="tour-tips-list">
                  {selectedTemple.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tour-disclaimer">
        <p>
          <strong>Note:</strong> Budget estimates are approximate and may vary based on season, booking time, and personal preferences.
          Prices are indicative for Indian travelers. Always check current rates on booking platforms before traveling.
        </p>
      </div>
    </div>
  );
}

export default TourGuide;
