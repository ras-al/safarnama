import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ticketData = JSON.parse(readFileSync(join(__dirname, '../src/lib/ticketData.json'), 'utf-8'));
let studentData = [];
try {
  studentData = JSON.parse(readFileSync(join(__dirname, '../src/lib/studentsData.json'), 'utf-8'));
} catch (e) {
  console.log('No studentsData.json found, skipping.');
}

const data = {
  trip: {
    id: "safarnama-2026", name: "Industrial Visit 2026", totalDays: 16,
    currentDay: 1, startDate: "2026-08-22", endDate: "2026-09-06", totalParticipants: 60
  },
  emergency: {
    tripCoordinator: { name: "ExploreWorld Tour Manager", phone: "+91 9995066671", role: "Tour Manager" },
    faculty: [
      { name: "Dr. Dimple A Shajahan", phone: "9447388322", role: "Senior Advisor R5 A & B" },
      { name: "Dr. Thushara A", phone: "9447557768", role: "Senior Advisor R5 AI" },
      { name: "Anantha Padmanabhan N K", phone: "9746405594", role: "Asst. Professor CSE" },
      { name: "Febeena M", phone: "9847955792", role: "Asst. Professor CSE" },
      { name: "Priyanka N", phone: "8848854416", role: "Asst. Professor CSE" },
      { name: "K Jerusha George", phone: "7025635189", role: "Asst. Professor CSE" },
      { name: "Sherji Salim", phone: "9946209434", role: "Technical Faculty CSE" }
    ],
    studentCoordinator: { name: "Student Rep", phone: "9876543210", role: "Student Coordinator" },
    nearbyHospitals: [
      { name: "Emergency Ambulance", phone: "108" },
      { name: "Police", phone: "100" }
    ]
  },
  itinerary: [
    { id:"day1", day:1, date:"2026-08-22", title:"Departure from Ernakulam", location:"Ernakulam, Kerala", activities:[{id:"d1-a1",time:"10:30 AM",title:"Train Departure",location:"Ernakulam Jn.",type:"transport",description:"Departure to Agra by MANGALA LKDWEEP (12617)."}] },
    { id:"day2", day:2, date:"2026-08-23", title:"Journey to Agra", location:"On Train", activities:[{id:"d2-a1",time:"All Day",title:"Train Journey",location:"En Route",type:"transport",description:"Day and night travel."}] },
    { id:"day3", day:3, date:"2026-08-24", title:"Agra Sightseeing", location:"Agra, UP", activities:[{id:"d3-a1",time:"10:00 AM",title:"Arrival at Agra",location:"Agra Cantt Station",type:"transport",description:"Meet representative, transfer to hotel."},{id:"d3-a2",time:"02:00 PM",title:"Taj Mahal Visit",location:"Taj Mahal",type:"visit",description:"Battery fare and entry included."},{id:"d3-a3",time:"04:30 PM",title:"Agra Fort",location:"Agra Fort",type:"visit",description:"2.5 km from Taj Mahal."},{id:"d3-a4",time:"07:00 PM",title:"Hotel Check-in",location:"Hotel Dazzling/Crimson Palace",type:"hotel",description:"Overnight stay."}] },
    { id:"day4", day:4, date:"2026-08-25", title:"Delhi Exploration", location:"Delhi", activities:[{id:"d4-a1",time:"05:00 AM",title:"Proceed to Delhi",location:"Agra → Delhi",type:"transport",description:"Early morning checkout."},{id:"d4-a2",time:"10:00 AM",title:"Akshardham Temple",location:"Delhi",type:"visit",description:""},{id:"d4-a3",time:"02:00 PM",title:"India Gate & Rashtrapati Bhavan",location:"New Delhi",type:"visit",description:"Bus sightseeing."},{id:"d4-a4",time:"04:00 PM",title:"Qutab Minar",location:"Mehrauli",type:"visit",description:""},{id:"d4-a5",time:"07:05 PM",title:"Departure to SVDK",location:"New Delhi Station",type:"transport",description:"SHRI SHAKTI EXP (22461)."}] },
    { id:"day5", day:5, date:"2026-08-26", title:"Arrival in Srinagar", location:"Srinagar, J&K", activities:[{id:"d5-a1",time:"05:40 AM",title:"Arrival at SVDK",location:"SVDK Station",type:"transport",description:""},{id:"d5-a2",time:"08:00 AM",title:"Vande Bharat to Srinagar",location:"SVDK → Srinagar",type:"transport",description:"VANDE BHARAT EXP (26401)."},{id:"d5-a3",time:"11:05 AM",title:"Arrival at Srinagar",location:"Srinagar Station",type:"transport",description:"Transfer to Hotel Royal Batoo."},{id:"d5-a4",time:"02:00 PM",title:"Institute Visit",location:"Srinagar",type:"industry",description:""},{id:"d5-a5",time:"05:00 PM",title:"Shikara Ride",location:"Dal Lake",type:"visit",description:"1-2 hrs ride + local shopping."}] },
    { id:"day6", day:6, date:"2026-08-27", title:"Sonmarg Excursion", location:"Sonmarg, J&K", activities:[{id:"d6-a1",time:"09:00 AM",title:"Proceed to Sonmarg",location:"Sind Valley",type:"visit",description:"Horse riding to Thajiwas glacier (cost excluded)."},{id:"d6-a2",time:"06:00 PM",title:"Return to Hotel",location:"Srinagar",type:"hotel",description:"Overnight stay."}] },
    { id:"day7", day:7, date:"2026-08-28", title:"Pahalgam Trip", location:"Pahalgam, J&K", activities:[{id:"d7-a1",time:"07:30 AM",title:"Proceed to Pahalgam",location:"Pahalgam",type:"transport",description:"3 hrs journey."},{id:"d7-a2",time:"11:00 AM",title:"Valley Visits",location:"Betaab/Chandanwari/Aru",type:"visit",description:"Local transport included."},{id:"d7-a3",time:"05:00 PM",title:"Return to Srinagar",location:"Srinagar",type:"transport",description:"3 hrs return."}] },
    { id:"day8", day:8, date:"2026-08-29", title:"Journey to Amritsar", location:"Amritsar, Punjab", activities:[{id:"d8-a1",time:"08:00 AM",title:"Vande Bharat to Jammu",location:"Srinagar Station",type:"transport",description:"VANDE BHARAT (26404)."},{id:"d8-a2",time:"12:45 PM",title:"Arrival at Jammu Tawi",location:"Jammu",type:"transport",description:""},{id:"d8-a3",time:"02:20 PM",title:"Train to Amritsar",location:"Jammu → Amritsar",type:"transport",description:"JAT TATA EXP (18102)."},{id:"d8-a4",time:"07:30 PM",title:"Hotel Check-in",location:"Hotel RV Continental",type:"hotel",description:"Overnight stay."}] },
    { id:"day9", day:9, date:"2026-08-30", title:"Amritsar Sightseeing", location:"Amritsar, Punjab", activities:[{id:"d9-a1",time:"09:00 AM",title:"Golden Temple & Jallianwala Bagh",location:"Amritsar",type:"visit",description:""},{id:"d9-a2",time:"04:00 PM",title:"Wagah Border",location:"Wagah",type:"visit",description:"Beating Retreat ceremony."},{id:"d9-a3",time:"11:55 PM",title:"Departure to Delhi",location:"Amritsar Station",type:"transport",description:"HIRAKUND EXP (20808)."}] },
    { id:"day10", day:10, date:"2026-08-31", title:"Delhi Shopping", location:"Delhi", activities:[{id:"d10-a1",time:"08:30 AM",title:"Arrival in Delhi",location:"Nizamuddin Station",type:"hotel",description:"Transfer to Gagan Inn for freshen up."},{id:"d10-a2",time:"11:00 AM",title:"Shopping & Leisure",location:"Sarojini/Karol Bagh/Palika",type:"free",description:"Return by metro/auto."},{id:"d10-a3",time:"05:55 PM",title:"Departure to Jaisalmer",location:"Delhi Cantt Station",type:"transport",description:"SWARN NAGARI EXP (12249)."}] },
    { id:"day11", day:11, date:"2026-09-01", title:"Jaisalmer Desert Safari", location:"Jaisalmer, Rajasthan", activities:[{id:"d11-a1",time:"09:00 AM",title:"Arrival in Jaisalmer",location:"Jaisalmer Station",type:"transport",description:"Transfer to hotel."},{id:"d11-a2",time:"11:00 AM",title:"Jaisalmer Fort",location:"Jaisalmer",type:"visit",description:""},{id:"d11-a3",time:"02:00 PM",title:"Desert Camp Check-in",location:"Sam Sand Dunes",type:"hotel",description:"Welcome Camp."},{id:"d11-a4",time:"04:30 PM",title:"Camel Safari & Cultural Night",location:"Sam Sand Dunes",type:"visit",description:"Folk dance, cultural programs. Dinner included."}] },
    { id:"day12", day:12, date:"2026-09-02", title:"Jaisalmer to Ahmedabad", location:"Jaisalmer", activities:[{id:"d12-a1",time:"06:00 AM",title:"Sunrise Jeep Safari",location:"Sam Sand Dunes",type:"visit",description:""},{id:"d12-a2",time:"09:00 AM",title:"Kuldhara Village & Fort",location:"Jaisalmer",type:"visit",description:""},{id:"d12-a3",time:"03:30 PM",title:"Departure to Ahmedabad",location:"Jaisalmer Station",type:"transport",description:"JSM SBIB EXPRESS (20491)."}] },
    { id:"day13", day:13, date:"2026-09-03", title:"Ahmedabad Institutes", location:"Ahmedabad, Gujarat", activities:[{id:"d13-a1",time:"05:15 AM",title:"Arrival in Ahmedabad",location:"Sabarmati Bg Station",type:"hotel",description:"Hotel Luxura."},{id:"d13-a2",time:"10:00 AM",title:"IIT Gandhinagar Visit",location:"IIT Gandhinagar",type:"industry",description:""},{id:"d13-a3",time:"02:00 PM",title:"Second Institute Visit",location:"Ahmedabad",type:"industry",description:""},{id:"d13-a4",time:"05:00 PM",title:"Sabarmati Riverfront",location:"Ahmedabad",type:"visit",description:""}] },
    { id:"day14", day:14, date:"2026-09-04", title:"Ahmedabad & Departure", location:"Ahmedabad, Gujarat", activities:[{id:"d14-a1",time:"09:00 AM",title:"Adalaj Step Well & Sabarmati Ashram",location:"Ahmedabad",type:"visit",description:""},{id:"d14-a2",time:"03:25 PM",title:"Departure to Trivandrum",location:"Ahmedabad Jn.",type:"transport",description:"GIMB NCJ EXP (16335)."}] },
    { id:"day15", day:15, date:"2026-09-05", title:"Journey Home", location:"On Train", activities:[{id:"d15-a1",time:"All Day",title:"Train Journey",location:"En Route",type:"transport",description:"Day and night travel."}] },
    { id:"day16", day:16, date:"2026-09-06", title:"Arrival in Kerala", location:"Trivandrum, Kerala", activities:[{id:"d16-a1",time:"07:00 AM",title:"Arrival",location:"Trivandrum Station",type:"transport",description:"Trip ends. Welcome home!"}] }
  ],
  transport: [
    { id:"t1", type:"Train", name:"MANGALA LKDWEEP (12617)", number:"12617", from:"Ernakulam Jn.", to:"Agra Cantt", date:"2026-08-22", departure:"10:30 AM", arrival:"06:25 AM" },
    { id:"t2", type:"Train", name:"SHRI SHAKTI EXP (22461)", number:"22461", from:"New Delhi", to:"SVDK", date:"2026-08-25", departure:"07:05 PM", arrival:"08:50 AM" },
    { id:"t3", type:"Train", name:"VANDE BHARAT EXP (26401)", number:"26401", from:"SVDK", to:"Srinagar", date:"2026-08-26", departure:"08:00 AM", arrival:"11:05 AM" },
    { id:"t4", type:"Train", name:"VANDE BHARAT EXP (26404)", number:"26404", from:"Srinagar", to:"Jammu Tawi", date:"2026-08-29", departure:"08:00 AM", arrival:"12:45 PM" },
    { id:"t5", type:"Train", name:"JAT TATA EXP (18102)", number:"18102", from:"Jammu Tawi", to:"Amritsar", date:"2026-08-29", departure:"02:20 PM", arrival:"07:30 PM" },
    { id:"t6", type:"Train", name:"HIRAKUND EXP (20808)", number:"20808", from:"Amritsar", to:"Nizamuddin", date:"2026-08-30", departure:"11:55 PM", arrival:"08:30 AM" },
    { id:"t7", type:"Train", name:"SWARN NAGARI EXP (12249)", number:"12249", from:"Delhi Cantt.", to:"Jaisalmer", date:"2026-08-31", departure:"05:55 PM", arrival:"09:00 AM" },
    { id:"t8", type:"Train", name:"JSM SBIB EXPRESS (20491)", number:"20491", from:"Jaisalmer", to:"Sabarmati Bg", date:"2026-09-02", departure:"03:30 PM", arrival:"05:15 AM" },
    { id:"t9", type:"Train", name:"GIMB NCJ EXP (16335)", number:"16335", from:"Ahmedabad Jn.", to:"Trivandrum", date:"2026-09-04", departure:"03:25 PM", arrival:"07:00 AM" }
  ],
  hotels: [
    { id:"h1", name:"Hotel Dazzling / Crimson Palace", city:"Agra", rooms:"Quad Sharing", checkIn:"2026-08-24", checkOut:"2026-08-25" },
    { id:"h2", name:"Hotel Royal Batoo", city:"Srinagar", rooms:"Quad Sharing", checkIn:"2026-08-26", checkOut:"2026-08-29" },
    { id:"h3", name:"Hotel RV Continental / Welcome Inn", city:"Amritsar", rooms:"Quad Sharing", checkIn:"2026-08-29", checkOut:"2026-08-30" },
    { id:"h4", name:"Gagan Inn / Dhaka International", city:"Delhi", rooms:"Six Sharing (Freshen up)", checkIn:"2026-08-31", checkOut:"2026-08-31" },
    { id:"h5", name:"Welcome Camp", city:"Jaisalmer (Sam Sand Dunes)", rooms:"Camp Tents", checkIn:"2026-09-01", checkOut:"2026-09-02" },
    { id:"h6", name:"Hotel Luxura", city:"Ahmedabad", rooms:"Quad Sharing", checkIn:"2026-09-03", checkOut:"2026-09-04" }
  ],
  places: [
    { id:"p1", name:"Taj Mahal", city:"Agra", duration:"2-3 hrs", mustVisit:true },
    { id:"p2", name:"Agra Fort", city:"Agra", duration:"1-2 hrs", mustVisit:true },
    { id:"p3", name:"Akshardham Temple", city:"Delhi", duration:"2-3 hrs", mustVisit:true },
    { id:"p4", name:"India Gate", city:"Delhi", duration:"1 hr", mustVisit:false },
    { id:"p5", name:"Qutab Minar", city:"Delhi", duration:"1 hr", mustVisit:false },
    { id:"p6", name:"Dal Lake", city:"Srinagar", duration:"1-2 hrs", mustVisit:true },
    { id:"p7", name:"Sonmarg", city:"Sonmarg", duration:"Half Day", mustVisit:true },
    { id:"p8", name:"Betaab Valley & Aru Valley", city:"Pahalgam", duration:"Half Day", mustVisit:true },
    { id:"p9", name:"Golden Temple", city:"Amritsar", duration:"2-3 hrs", mustVisit:true },
    { id:"p10", name:"Jallianwala Bagh", city:"Amritsar", duration:"1 hr", mustVisit:true },
    { id:"p11", name:"Wagah Border", city:"Amritsar", duration:"3 hrs", mustVisit:true },
    { id:"p12", name:"Jaisalmer Fort", city:"Jaisalmer", duration:"2 hrs", mustVisit:true },
    { id:"p13", name:"Sam Sand Dunes", city:"Jaisalmer", duration:"Overnight", mustVisit:true },
    { id:"p14", name:"Kuldhara Village", city:"Jaisalmer", duration:"1 hr", mustVisit:false },
    { id:"p15", name:"Sabarmati Ashram", city:"Ahmedabad", duration:"1-2 hrs", mustVisit:true },
    { id:"p16", name:"Adalaj Step Well", city:"Ahmedabad", duration:"1 hr", mustVisit:true }
  ],
  participants: [
    { id:"u1", name:"Dr. Dimple A Shajahan", phone:"9447388322", group:"Faculty", room:"F1", coach:"S1", seat:"1" },
    { id:"u2", name:"Dr. Thushara A", phone:"9447557768", group:"Faculty", room:"F1", coach:"S1", seat:"2" },
    { id:"u3", name:"Anantha Padmanabhan N K", phone:"9746405594", group:"Faculty", room:"F2", coach:"S1", seat:"3" },
    { id:"u4", name:"Febeena M", phone:"9847955792", group:"Faculty", room:"F2", coach:"S1", seat:"4" },
    { id:"u5", name:"Priyanka N", phone:"8848854416", group:"Faculty", room:"F3", coach:"S1", seat:"5" },
    { id:"u6", name:"K Jerusha George", phone:"7025635189", group:"Faculty", room:"F3", coach:"S1", seat:"6" },
    { id:"u7", name:"Sherji Salim", phone:"9946209434", group:"Faculty", room:"F4", coach:"S1", seat:"7" },
    ...studentData
  ],
  announcements: [
    { id:"a1", title:"Welcome to Safarnama 2026", body:"Get ready for a 16-day Industrial Visit across North India. Keep your ID proofs ready!", time:"2026-08-20T10:00:00Z", priority:"important" }
  ],
  documents: [
    { id:"doc1", name:"IV Details & Itinerary", type:"Information", date:"2026-08-20", category:"official", url:"/iv details.pdf" },
    { id:"doc2", name:"Students List", type:"Information", date:"2026-08-20", category:"official", url:"/students_list.pdf" },
    ...ticketData
  ]
};

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // 1. Trip config
  console.log('  → config/trip');
  await setDoc(doc(db, 'config', 'trip'), data.trip);

  // 2. Emergency contacts
  console.log('  → emergencyContacts/main');
  await setDoc(doc(db, 'emergencyContacts', 'main'), data.emergency);

  // 3. Collections
  const collections = ['itinerary','transport','hotels','places','participants','announcements','documents'];
  for (const name of collections) {
    const items = data[name];
    console.log(`  → ${name} (${items.length} docs)`);
    for (const item of items) {
      const { id, ...rest } = item;
      await setDoc(doc(db, name, id), rest);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
