import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, GraduationCap, IndianRupee, Clock, Search,
  BookOpen, Target, Trophy, ExternalLink, Play,
  ArrowLeft, Building2, Landmark, HeartPulse,
  Code, Scale, Tractor, Shield, X
} from 'lucide-react';
import './CareerGuide.css';

const careers = [
  {
    id: 'after-10th',
    title: 'After 10th - Stream Selection Guide',
    icon: GraduationCap,
    color: '#0ea5e9',
    whatToStudy: 'Choose one of 3 main streams in Class 11-12: MPC (Maths-Physics-Chemistry), BPC (Biology-Physics-Chemistry), or Commerce/Arts. This decision shapes your entire career path.',
    minCost: 'Govt College: \u20B90 - \u20B910,000/year | Private College: \u20B920,000 - \u20B92,00,000/year | Coaching: \u20B920,000 - \u20B92,00,000/year',
    jobSectors: [],
    streamGuide: [
      {
        stream: 'MPC (Maths, Physics, Chemistry)',
        careers: [
          { career: 'Software Engineer / IT', path: 'MPC \u2192 B.Tech CSE/IT \u2192 IT Companies' },
          { career: 'Core Engineer (Civil/Mech/Electrical)', path: 'MPC \u2192 B.Tech CSE/ME/CE/EE \u2192 PSU/Core Companies' },
          { career: 'Doctor (MBBS/BDS)', path: 'MPC \u2192 NEET \u2192 MBBS/BDS/BAMS/BHMS' },
          { career: 'Architecture', path: 'MPC \u2192 NATA/JEE Paper 2 \u2192 B.Arch' },
          { career: 'Merchant Navy', path: 'MPC \u2192 IMU CET \u2192 B.Sc Nautical Science' },
          { career: 'Pilot', path: 'MPC \u2192 12th with PCM \u2192 DGCA exams \u2192 CPL' },
          { career: 'Data Scientist / AI Engineer', path: 'MPC \u2192 B.Tech/B.Sc Statistics \u2192 Data Science' },
          { career: 'Government Jobs (SSC/Banking)', path: 'MPC \u2192 Any Graduation \u2192 SSC/Banking/Railway exams' }
        ]
      },
      {
        stream: 'BPC (Biology, Physics, Chemistry)',
        careers: [
          { career: 'Doctor (MBBS)', path: 'BPC \u2192 NEET \u2192 MBBS (5.5 years)' },
          { career: 'Dentist (BDS)', path: 'BPC \u2192 NEET \u2192 BDS (5 years)' },
          { career: 'Ayurveda / Homeopathy', path: 'BPC \u2192 NEET \u2192 BAMS/BHMS' },
          { career: 'Nursing', path: 'BPC \u2192 NEET/State Entrance \u2192 B.Sc Nursing' },
          { career: 'Pharmacy', path: 'BPC \u2192 GPAT/State Entrance \u2192 B.Pharm' },
          { career: 'Biotechnology / Microbiology', path: 'BPC \u2192 B.Sc Biotech \u2192 Research/Industry' },
          { career: 'Agriculture', path: 'BPC \u2192 ICAR AIEEA \u2192 B.Sc Agriculture' },
          { career: 'Food Technology', path: 'BPC \u2192 B.Sc Food Tech \u2192 Food Industry' }
        ]
      },
      {
        stream: 'Commerce (with/without Maths)',
        careers: [
          { career: 'Chartered Accountant (CA)', path: 'Commerce \u2192 CA Foundation \u2192 CA Intermediate \u2192 CA Final' },
          { career: 'Company Secretary (CS)', path: 'Commerce \u2192 CS Foundation \u2192 CS Executive \u2192 CS Professional' },
          { career: 'Banking & Finance', path: 'Commerce \u2192 B.Com/BBA \u2192 IBPS/SBI PO/Clerk' },
          { career: 'Cost Management Accountant (CMA)', path: 'Commerce \u2192 CMA Foundation \u2192 CMA Inter/Final' },
          { career: 'Management / MBA', path: 'Commerce \u2192 BBA/B.Com \u2192 CAT/MAT \u2192 MBA' },
          { career: 'Economics / Actuarial', path: 'Commerce \u2192 B.A Economics \u2192 RBI/Actuarial' },
          { career: 'Government Jobs', path: 'Commerce \u2192 Any Graduation \u2192 SSC/Banking exams' },
          { career: 'Law (Corporate)', path: 'Commerce \u2192 BBA LLB (5yr) \u2192 Corporate Law' }
        ]
      },
      {
        stream: 'Arts / Humanities',
        careers: [
          { career: 'Civil Services (IAS/IPS)', path: 'Arts \u2192 BA (any subject) \u2192 UPSC CSE' },
          { career: 'Law', path: 'Arts \u2192 CLAT \u2192 BA LLB (5yr) \u2192 Practice/Judiciary' },
          { career: 'Teaching / Education', path: 'Arts \u2192 BA + B.Ed \u2192 CTET/TET \u2192 Govt/Private Teaching' },
          { career: 'Journalism / Mass Communication', path: 'Arts \u2192 BJMC \u2192 News/Media/Digital Content' },
          { career: 'Psychology / Counselling', path: 'Arts \u2192 BA Psychology \u2192 M.A/M.Sc Psychology \u2192 Practice' },
          { career: 'Hotel Management', path: 'Arts \u2192 NCHMCT JEE \u2192 B.Sc Hospitality \u2192 Hotels/Restaurants' },
          { career: 'Design / Fine Arts', path: 'Arts \u2192 NID/NIFT Entrance \u2192 B.Des/Fine Arts' },
          { career: 'Social Work / NGO', path: 'Arts \u2192 B.A/BSW \u2192 MSW \u2192 NGOs/Govt Schemes' }
        ]
      }
    ],
    typesOfJobs: [],
    preparationTime: 'Board exams: 2 years (Class 11-12) | Competitive exams: 6-12 months after 12th | Stream selection: Make decision in Class 10 summer vacation',
    howToPrepare: [
      'Assess your interests: Science (MPC/BPC), Commerce, or Arts',
      'Talk to seniors, teachers, and career counsellors',
      'Research career options in each stream thoroughly',
      'Check your aptitude: Maths-heavy careers need MPC, Biology careers need BPC',
      'Consider job market demand and future growth in that field',
      'Don\'t choose a stream just because friends are choosing it',
      'Join coaching if needed (IIT-JEE for MPC, NEET for BPC)',
      'Focus on Class 10 board exams first (good marks = better college options)',
      'Attend career counselling sessions (many schools and NGOs offer free ones)',
      'Remember: Your stream doesn\'t lock you forever, but it opens specific doors'
    ],
    freeResources: [
      { name: 'NCERT (Free Textbooks)', url: 'https://ncert.nic.in', type: 'website' },
      { name: 'Physics Wallah (All Streams)', url: 'https://www.youtube.com/c/physicswallah', type: 'youtube' },
      { name: 'Unacademy Foundation', url: 'https://www.youtube.com/c/unacademyfoundation', type: 'youtube' },
      { name: 'Vedantu Learning', url: 'https://www.youtube.com/c/vedantulearning', type: 'youtube' },
      { name: 'Khan Academy India', url: 'https://www.khanacademy.org', type: 'website' },
      { name: 'Doubtnut (Maths/Science)', url: 'https://www.youtube.com/c/doubtnut', type: 'youtube' },
      { name: 'BYJU\'S Free Classes', url: 'https://byjus.com', type: 'website' }
    ]
  },
  {
    id: 'after-12th',
    title: 'After 12th - Course & Career Guide',
    icon: Briefcase,
    color: '#d946ef',
    whatToStudy: 'Based on your 12th stream, pick the right course and entrance exam. This guide maps your 12th stream to the best graduation options and career paths.',
    minCost: 'Govt College: \u20B95,000 - \u20B91,00,000/year | Private College: \u20B950,000 - \u20B920,00,000/year | Professional courses: varies widely',
    jobSectors: [],
    after12thGuide: [
      {
        stream: 'After 12th MPC (Maths, Physics, Chemistry)',
        options: [
          { course: 'B.Tech / B.E. (4 years)', entrance: 'JEE Main, JEE Advanced, state CETs', cost: '\u20B920,000 - \u20B915,00,000/year', careers: 'Software, Core Engineering, PSU, ISRO, DRDO', salary: '\u20B94L - \u20B940L+ p.a.' },
          { course: 'B.Arch (5 years)', entrance: 'JEE Paper 2, NATA', cost: '\u20B930,000 - \u20B98,00,000/year', careers: 'Architecture firms, Urban Planning, Government', salary: '\u20B93L - \u20B915L+ p.a.' },
          { course: 'BCA (3 years)', entrance: 'Direct admission / merit', cost: '\u20B920,000 - \u20B93,00,000/year', careers: 'Software Developer, IT Support, Web Developer', salary: '\u20B93L - \u20B912L+ p.a.' },
          { course: 'B.Sc Data Science / AI', entrance: 'University entrance / direct', cost: '\u20B920,000 - \u20B96,00,000/year', careers: 'Data Analyst, ML Engineer, AI Research', salary: '\u20B95L - \u20B930L+ p.a.' },
          { course: 'NDA (Defence)', entrance: 'UPSC NDA', cost: 'Free (Govt trained)', careers: 'Army/Navy/Air Force Officer', salary: '\u20B956,100 + Military Allowances' },
          { course: 'B.Sc (3 years)', entrance: 'University entrance / direct', cost: '\u20B95,000 - \u20B92,00,000/year', careers: 'Research, Teaching, Banking, Government jobs', salary: '\u20B93L - \u20B915L+ p.a.' },
          { course: 'Merchant Navy', entrance: 'IMU CET', cost: '\u20B91,50,000 - \u20B98,00,000 (total)', careers: 'Deck Officer, Engine Officer, Chief Officer', salary: '\u20B98L - \u20B940L+ p.a.' },
          { course: 'Pilot (CPL)', entrance: 'DGCA exams', cost: '\u20B940,00,000 - \u20B980,00,000', careers: 'Commercial Pilot, Airline Captain', salary: '\u20B910L - \u20B91Cr+ p.a.' }
        ]
      },
      {
        stream: 'After 12th BPC (Biology, Physics, Chemistry)',
        options: [
          { course: 'MBBS (5.5 years)', entrance: 'NEET-UG', cost: '\u20B910,000 - \u20B91,00,00,000', careers: 'Doctor (Govt/Private Hospital)', salary: '\u20B96L - \u20B930L+ p.a.' },
          { course: 'BDS (5 years)', entrance: 'NEET-UG', cost: '\u20B910,000 - \u20B930,00,000', careers: 'Dentist (Private Clinic/Hospital)', salary: '\u20B94L - \u20B920L+ p.a.' },
          { course: 'BAMS (5.5 years)', entrance: 'NEET-UG', cost: '\u20B910,000 - \u20B925,00,000', careers: 'Ayurvedic Doctor, Government Hospital', salary: '\u20B95L - \u20B915L+ p.a.' },
          { course: 'B.Sc Nursing (4 years)', entrance: 'NEET/State Entrance', cost: '\u20B950,000 - \u20B95,00,000', careers: 'Staff Nurse (Govt/Private Hospital)', salary: '\u20B93L - \u20B98L+ p.a.' },
          { course: 'B.Pharm (4 years)', entrance: 'State Entrance / GPAT (for M.Pharm)', cost: '\u20B950,000 - \u20B98,00,000', careers: 'Pharmacist, Drug Inspector, Pharma Industry', salary: '\u20B93L - \u20B912L+ p.a.' },
          { course: 'B.Sc Agriculture (4 years)', entrance: 'ICAR AIEEA', cost: '\u20B910,000 - \u20B91,50,000', careers: 'Agriculture Officer, Bank AO, Research', salary: '\u20B93L - \u20B912L+ p.a.' },
          { course: 'B.Sc Biotechnology', entrance: 'University entrance', cost: '\u20B920,000 - \u20B94,00,000', careers: 'Research Scientist, Pharma Industry, Biotech Firms', salary: '\u20B93L - \u20B915L+ p.a.' },
          { course: 'B.V.Sc (5.5 years)', entrance: 'NEET / State Entrance', cost: '\u20B910,000 - \u20B95,00,000', careers: 'Veterinary Doctor, Animal Husbandry', salary: '\u20B95L - \u20B915L+ p.a.' }
        ]
      },
      {
        stream: 'After 12th Commerce',
        options: [
          { course: 'CA (Chartered Accountant)', entrance: 'ICAI CA Foundation', cost: '\u20B920,000 - \u20B93,00,000 (total)', careers: 'CA in firm, Corporate, Practice', salary: '\u20B97L - \u20B950L+ p.a.' },
          { course: 'CS (Company Secretary)', entrance: 'ICSI CS Foundation', cost: '\u20B915,000 - \u20B92,00,000 (total)', careers: 'Company Secretary, Compliance Officer', salary: '\u20B95L - \u20B930L+ p.a.' },
          { course: 'B.Com (3 years)', entrance: 'Direct / merit', cost: '\u20B95,000 - \u20B92,00,000/year', careers: 'Accountant, Banking, Tax Consultant', salary: '\u20B93L - \u20B910L+ p.a.' },
          { course: 'BBA (3 years)', entrance: 'Direct / entrance exams', cost: '\u20B930,000 - \u20B98,00,000/year', careers: 'Management Trainee, Business Analyst, Startup', salary: '\u20B93L - \u20B912L+ p.a.' },
          { course: 'CMA (Cost Management Accountant)', entrance: 'ICMAI CMA Foundation', cost: '\u20B920,000 - \u20B92,50,000 (total)', careers: 'Cost Accountant, Financial Analyst, Corporate', salary: '\u20B95L - \u20B925L+ p.a.' },
          { course: 'BBA LLB (5 years)', entrance: 'CLAT / LSAT', cost: '\u20B930,000 - \u20B915,00,000/year', careers: 'Corporate Lawyer, Legal Advisor', salary: '\u20B95L - \u20B930L+ p.a.' },
          { course: 'Actuarial Science', entrance: 'IAI ACET', cost: '\u20B920,000 - \u20B91,00,000 (exams)', careers: 'Actuary (Insurance, Finance, Risk)', salary: '\u20B98L - \u20B980L+ p.a.' },
          { course: 'Banking exams (after graduation)', entrance: 'IBPS PO/Clerk, SBI PO/Clerk', cost: '\u20B90 - \u20B950,000 (prep)', careers: 'Bank PO, Clerk, Officer', salary: '\u20B94L - \u20B98L+ p.a.' }
        ]
      },
      {
        stream: 'After 12th Arts / Humanities',
        options: [
          { course: 'BA (3 years)', entrance: 'Direct / merit / CUET', cost: '\u20B95,000 - \u20B92,00,000/year', careers: 'Civil Services, Teaching, Journalism, Research', salary: '\u20B93L - \u20B950L+ (IAS)' },
          { course: 'BA LLB (5 years)', entrance: 'CLAT, AILET, LSAT', cost: '\u20B920,000 - \u20B915,00,000/year', careers: 'Lawyer, Judicial Services, Corporate Law', salary: '\u20B95L - \u20B950L+ p.a.' },
          { course: 'BJMC (3 years)', entrance: 'University entrance', cost: '\u20B920,000 - \u20B95,00,000/year', careers: 'Journalist, Content Writer, PR, Media', salary: '\u20B93L - \u20B915L+ p.a.' },
          { course: 'B.Ed (2 years after graduation)', entrance: 'CTET / State TET', cost: '\u20B920,000 - \u20B92,00,000', careers: 'Teacher (Govt/Private School)', salary: '\u20B93L - \u20B910L+ p.a.' },
          { course: 'BA Psychology (3 years)', entrance: 'Direct / merit', cost: '\u20B910,000 - \u20B93,00,000/year', careers: 'Counsellor, HR, Therapist, Research', salary: '\u20B93L - \u20B915L+ p.a.' },
          { course: 'Hotel Management', entrance: 'NCHMCT JEE', cost: '\u20B950,000 - \u20B98,00,000', careers: 'Hotel Manager, Restaurant Manager, Cruise', salary: '\u20B93L - \u20B912L+ p.a.' },
          { course: 'B.Des / NID / NIFT', entrance: 'NID/NIFT Entrance', cost: '\u20B950,000 - \u20B98,00,000/year', careers: 'Designer, Fashion Designer, Product Design', salary: '\u20B94L - \u20B930L+ p.a.' },
          { course: 'Civil Services (UPSC)', entrance: 'UPSC CSE', cost: '\u20B90 - \u20B93,00,000 (coaching)', careers: 'IAS, IPS, IFS, IRS Officer', salary: '\u20B956,100 - \u20B92,50,000' }
        ]
      }
    ],
    typesOfJobs: [],
    preparationTime: 'Entrance exams: 6-12 months (after 12th board) | Professional courses: 3-6 years | Job placement: During/after course completion',
    howToPrepare: [
      'Review your 12th stream and available options carefully',
      'Shortlist 3-5 courses that match your interest and aptitude',
      'Check entrance exam dates and eligibility for each course',
      'Prepare a study timetable for entrance exam preparation',
      'Take mock tests regularly for JEE/NEET/CLAT/CA Foundation etc.',
      'Apply for multiple entrance exams to keep options open',
      'Research college rankings, placement records, and fees',
      'Apply for scholarships and fee waivers (SC/ST/OBC/EWS categories)',
      'Visit college campuses if possible before making final choice',
      'Don\'t rush - take guidance from teachers, seniors, and family',
      'Keep backup options ready (e.g., if NEET doesn\'t work, B.Sc is also good)',
      'Focus on skill development alongside degree (coding, communication, etc.)'
    ],
    freeResources: [
      { name: 'CUET Official (NTA)', url: 'https://cuet.nta.nic.in', type: 'website' },
      { name: 'JEE Main (NTA)', url: 'https://jeemain.nta.nic.in', type: 'website' },
      { name: 'NEET Official (NTA)', url: 'https://neet.nta.nic.in', type: 'website' },
      { name: 'CLAT Official', url: 'https://consortiumofnlus.ac.in', type: 'website' },
      { name: 'ICAI (CA)', url: 'https://www.icai.org', type: 'website' },
      { name: 'Physics Wallah (All Exams)', url: 'https://www.youtube.com/c/physicswallah', type: 'youtube' },
      { name: 'Unacademy Foundation', url: 'https://www.youtube.com/c/unacademyfoundation', type: 'youtube' },
      { name: 'Vedantu', url: 'https://www.youtube.com/c/vedantulearning', type: 'youtube' },
      { name: 'Aglasem (College Info)', url: 'https://www.aglasem.com', type: 'website' },
      { name: 'CollegeDekho', url: 'https://www.collegedekho.com', type: 'website' }
    ]
  },
  {
    id: 'upsc-civil-services',
    title: 'UPSC Civil Services (IAS/IPS/IFS)',
    icon: Landmark,
    color: '#3b82f6',
    whatToStudy: 'Any graduation degree (mandatory). Popular optional subjects: Public Administration, Geography, History, Political Science, Sociology. Post-graduation not required but helpful.',
    minCost: '\u20B90 - \u20B950,000 (self-study) | \u20B950,000 - \u20B93,00,000 (coaching at Delhi/online)',
    jobSectors: ['IAS - District Administration / Central Govt', 'IPS - Indian Police Service', 'IFS - Indian Foreign Service', 'IRS - Income Tax / Customs', 'IFS - Indian Forest Service', 'State PCS (similar roles at state level)'],
    typesOfJobs: [
      { post: 'IAS (Indian Administrative Service)', salary: '\u20B956,100 - \u20B92,50,000 (Pay Level 10-17)' },
      { post: 'IPS (Indian Police Service)', salary: '\u20B956,100 - \u20B92,50,000 (Pay Level 10-17)' },
      { post: 'IFS (Indian Foreign Service)', salary: '\u20B956,100 - \u20B92,50,000 + Foreign Allowance' },
      { post: 'IRS (Income Tax)', salary: '\u20B947,600 - \u20B92,11,400 (Pay Level 8-13)' },
      { post: 'State PCS Officer', salary: '\u20B935,400 - \u20B91,12,400 (varies by state)' }
    ],
    preparationTime: '1 - 3 years (average 2 attempts) | Prelims to Mains: 5 months | Interview: 1 month',
    howToPrepare: [
      'Start with NCERT books (Class 6-12) for foundational knowledge',
      'Read The Hindu / Indian Express newspaper daily',
      'Complete optional subject coaching or self-study',
      'Practice previous year papers (20 years minimum)',
      'Write answer practice daily (mains is descriptive)',
      'Take mock tests regularly (Prelims + Mains + Interview)',
      'Current affairs: Monthly magazines (Yojana, Kurukshetra)',
      'Make short notes for revision',
      'Join test series (online or offline)',
      'Focus on answer writing skills (structure, content, presentation)'
    ],
    freeResources: [
      { name: 'UPSC Official Website', url: 'https://www.upsc.gov.in', type: 'website' },
      { name: 'Unacademy Free UPSC Lessons', url: 'https://www.youtube.com/unacademy', type: 'youtube' },
      { name: 'Study IQ Education', url: 'https://www.youtube.com/c/StudyIQeducation', type: 'youtube' },
      { name: 'Drishti IAS Free Videos', url: 'https://www.youtube.com/c/drishtiias', type: 'youtube' },
      { name: 'NCERT Official (Free Textbooks)', url: 'https://ncert.nic.in', type: 'website' },
      { name: 'Mrunal Patel Free Lectures', url: 'https://www.youtube.com/user/MrunalOrg', type: 'youtube' },
      { name: 'ClearIAS Free Study Material', url: 'https://www.clearias.com', type: 'website' },
      { name: 'BYJU\'S Free UPSC Prep', url: 'https://byjus.com/free-ias-prep', type: 'website' }
    ]
  },
  {
    id: 'ssc-cgl',
    title: 'SSC CGL / CHSL / MTS',
    icon: Building2,
    color: '#8b5cf6',
    whatToStudy: 'Graduation (any stream) for CGL. Class 12 for CHSL. Class 10 for MTS. Focus on Quantitative Aptitude, English, General Awareness, Reasoning.',
    minCost: '\u20B90 - \u20B930,000 (self-study) | \u20B915,000 - \u20B980,000 (coaching)',
    jobSectors: ['Central Government Ministries / Departments', 'Central Public Sector Undertakings', 'CBI, NIA, ED, CAG offices', 'Tax departments (Income Tax, Customs, GST)', 'Various Ministries under Govt of India'],
    typesOfJobs: [
      { post: 'Inspector (Income Tax / Central Excise / GST)', salary: '\u20B944,900 - \u20B91,42,400 (Pay Level 7)' },
      { post: 'Assistant Section Officer (ASO)', salary: '\u20B944,900 - \u20B91,42,400 (Pay Level 7)' },
      { post: 'Sub Inspector (CBI / NIA)', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6)' },
      { post: 'Auditor / Accountant', salary: '\u20B925,500 - \u20B981,100 (Pay Level 5)' },
      { post: 'Tax Assistant', salary: '\u20B919,900 - \u20B963,200 (Pay Level 4)' },
      { post: 'Junior Secretariat Assistant', salary: '\u20B919,900 - \u20B963,200 (Pay Level 2)' }
    ],
    preparationTime: '6 - 12 months | Tier 1 (MCQ): 1 hour | Tier 2 (Descriptive + MCQ): 2 hours | Tier 3 (DEST/CPT): qualifying',
    howToPrepare: [
      'Cover NCERT Maths (Class 6-10) for quantitative basics',
      'Practice previous year SSC papers (last 10 years)',
      'Learn short tricks for Quantitative Aptitude',
      'Read newspaper daily for Current Affairs / GK',
'Practice English comprehension, cloze test, sentence correction',
      'Solve Reasoning puzzles daily (puzzles, syllogisms, coding-decoding)',
      'Take full-length mock tests weekly',
      'Analyze mock test mistakes and revise weak areas',
      'Use SSC-specific apps for daily practice',
      'Join online test series for real exam simulation'
    ],
    freeResources: [
      { name: 'SSC Official Website', url: 'https://ssc.nic.in', type: 'website' },
      { name: 'Rakesh Yadav Readers Club', url: 'https://www.youtube.com/c/RakeshYadavReadersClub', type: 'youtube' },
      { name: 'Adda247 SSC', url: 'https://www.youtube.com/c/adda247', type: 'youtube' },
      { name: 'wifistudy', url: 'https://www.youtube.com/c/wifistudy', type: 'youtube' },
      { name: 'Testbook Free Mocks', url: 'https://testbook.com', type: 'website' },
      { name: 'Oliveboard Free Study Material', url: 'https://www.oliveboard.in', type: 'website' },
      { name: 'Khan Sir Official (GK)', url: 'https://www.youtube.com/c/khansirofficial', type: 'youtube' }
    ]
  },
  {
    id: 'banking-po-clerk',
    title: 'Banking (IBPS PO / Clerk / SBI)',
    icon: Landmark,
    color: '#10b981',
    whatToStudy: 'Graduation (any stream). Focus on Quantitative Aptitude, Reasoning Ability, English Language, General / Banking / Financial Awareness.',
    minCost: '\u20B90 - \u20B925,000 (self-study) | \u20B910,000 - \u20B960,000 (coaching)',
    jobSectors: ['Public Sector Banks (SBI, PNB, BOB, etc.)', 'Regional Rural Banks (RRBs)', 'IDBI Bank', 'NABARD, NHB, SIDBI', 'Insurance Companies (LIC, NIACL, etc.)'],
    typesOfJobs: [
      { post: 'PO (Probationary Officer)', salary: '\u20B936,000 - \u20B967,000 (starting in-hand ~\u20B942,000)' },
      { post: 'Clerk (Junior Associate)', salary: '\u20B919,900 - \u20B947,900 (starting in-hand ~\u20B926,000)' },
      { post: 'Specialist Officer (SO)', salary: '\u20B936,000 - \u20B967,000 (varies by scale)' },
      { post: 'RRB Officer Scale I', salary: '\u20B936,000 - \u20B967,000' },
      { post: 'RRB Office Assistant', salary: '\u20B919,900 - \u20B947,900' }
    ],
    preparationTime: '4 - 8 months | Prelims: 1 hour (100 questions) | Mains: 3 hours (objective + descriptive) | Interview (PO only): 15-20 minutes',
    howToPrepare: [
      'Clear basics of Quant from NCERT (Class 6-10)',
      'Practice Simplification, Number Series, DI daily',
      'Solve Reasoning puzzles, seating arrangements daily',
      'Read newspaper for banking / financial awareness',
      'Practice English - reading comprehension, error spotting',
      'Take mock tests (Prelims + Mains level)',
      'Analyze each mock: note accuracy and time per section',
      'Revise formulas and shortcuts weekly',
      'Practice previous year IBPS / SBI papers',
      'For interview: prepare HR questions, banking awareness, current affairs'
    ],
    freeResources: [
      { name: 'IBPS Official Website', url: 'https://www.ibps.in', type: 'website' },
      { name: 'SBI Careers', url: 'https://sbi.co.in/web/careers', type: 'website' },
      { name: 'Adda247 Banking', url: 'https://www.youtube.com/c/adda247', type: 'youtube' },
      { name: 'Oliveboard Banking Prep', url: 'https://www.oliveboard.in', type: 'website' },
      { name: 'Testbook Bank Exam', url: 'https://testbook.com', type: 'website' },
      { name: 'Study IQ Banking', url: 'https://www.youtube.com/c/StudyIQeducation', type: 'youtube' },
      { name: 'PracticeMock Free Tests', url: 'https://www.practicemock.com', type: 'website' }
    ]
  },
  {
    id: 'railway-jobs',
    title: 'Railway Jobs (RRB ALP / NTPC / Group D)',
    icon: Shield,
    color: '#ef4444',
    whatToStudy: 'Class 10 / ITI / Diploma / Graduation depending on the post. Focus on Mathematics, General Awareness, Reasoning, General Science.',
    minCost: '\u20B90 - \u20B920,000 (self-study) | \u20B98,000 - \u20B940,000 (coaching)',
    jobSectors: ['Indian Railways (Zonal Railways)', 'Metro Rail Corporations', 'Railway Recruitment Boards (RRBs)', 'Railway Production Units'],
    typesOfJobs: [
      { post: 'NTPC Graduate (Station Master, Goods Guard, etc.)', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6)' },
      { post: 'NTPC Undergraduate (Clerk, Typist, etc.)', salary: '\u20B919,900 - \u20B963,200 (Pay Level 2-5)' },
      { post: 'ALP (Assistant Loco Pilot)', salary: '\u20B919,900 - \u20B963,200 + Allowances' },
      { post: 'Technician', salary: '\u20B919,900 - \u20B963,200 (Pay Level 2-4)' },
      { post: 'Group D (Track Maintainer, Helper)', salary: '\u20B918,000 - \u20B956,900 (Pay Level 1)' }
    ],
    preparationTime: '3 - 6 months | CBT 1: 90 minutes | CBT 2: 90-120 minutes | CBAT/PET/Document Verification: varies',
    howToPrepare: [
      'Focus on Class 10 level Maths, Science, GK',
      'Practice RRB previous year papers (5+ years)',
      'Take online mock tests regularly',
      'Revise General Science (Physics, Chemistry, Biology basics)',
      'Practice Reasoning (analogies, series, coding)',
      'Current affairs - last 6 months focus',
      'For ALP: prepare Trade/Technical subjects',
      'Physical fitness preparation for Group D (running, lifting)',
      'Use RRB-specific mobile apps for daily practice',
      'Track exam notifications on RRB websites'
    ],
    freeResources: [
      { name: 'RRB Official Website', url: 'https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,554', type: 'website' },
      { name: 'RRB NTPC / Group D Notifications', url: 'https://rrbapply.gov.in', type: 'website' },
      { name: 'wifistudy Railway', url: 'https://www.youtube.com/c/wifistudy', type: 'youtube' },
      { name: 'Adda247 Railway', url: 'https://www.youtube.com/c/adda247', type: 'youtube' },
      { name: 'Testbook Railway Exams', url: 'https://testbook.com', type: 'website' },
      { name: 'RRB Free Mock Tests', url: 'https://www.rrbapply.gov.in', type: 'website' }
    ]
  },
  {
    id: 'defence-jobs',
    title: 'Defence (NDA / CDS / AFCAT / Agniveer)',
    icon: Shield,
    color: '#06b6d4',
    whatToStudy: 'NDA: Class 12 (PCM for Air Force/Navy). CDS: Graduation. AFCAT: Graduation with 60% marks. Agniveer: Class 10/12 + Physical fitness.',
    minCost: '\u20B90 - \u20B940,000 (self-study) | \u20B920,000 - \u20B91,50,000 (coaching)',
    jobSectors: ['Indian Army', 'Indian Navy', 'Indian Air Force', 'Indian Coast Guard', 'BSF, CRPF, CISF, ITBP (Paramilitary)', 'Defence Research (DRDO, ISRO)'],
    typesOfJobs: [
      { post: 'NDA Officer (Lieutenant)', salary: '\u20B956,100 + Military Allowances (in-hand ~\u20B980,000)' },
      { post: 'CDS Officer (Captain rank entry)', salary: '\u20B956,100 + Military Allowances' },
      { post: 'AFCAT Flying/Technical', salary: '\u20B956,100 + Flying Allowance + Military Pay' },
      { post: 'Agniveer (Army/Navy/Air Force)', salary: '\u20B930,000/month (4 years, then exit or rejoin)' },
      { post: 'Territorial Army Officer', salary: '\u20B956,100 (when mobilized) + Allowances' }
    ],
    preparationTime: '6 - 12 months | NDA Written: 2.5 hours | SSB Interview: 5 days | AFCAT: 2 hours | Agniveer Rally: varies',
    howToPrepare: [
      'NDA: Focus on Maths (Class 11-12 level) + General Ability Test',
      'CDS: English, General Knowledge, Elementary Mathematics',
      'AFCAT: English, General Awareness, Numerical Ability, Reasoning',
      'Physical fitness: Running (1.6km in 5-6 min), push-ups, sit-ups',
      'SSB Preparation: OLQ (Officer Like Qualities) development',
      'Practice group tasks, psych tests, interview for SSB',
      'Read newspapers, focus on defence-related current affairs',
      'Solve previous year NDA/CDS/AFCAT papers',
      'Join mock SSB sessions (offline or online)',
      'Maintain BMI and physical standards throughout preparation'
    ],
    freeResources: [
      { name: 'Join Indian Army', url: 'https://joinindianarmy.nic.in', type: 'website' },
      { name: 'Indian Navy Careers', url: 'https://www.joinindiannavy.gov.in', type: 'website' },
      { name: 'Indian Air Force Career', url: 'https://indianairforce.nic.in', type: 'website' },
      { name: 'SSBCrackExams', url: 'https://www.youtube.com/c/ssbcrackexams', type: 'youtube' },
      { name: 'Defence Direct Education', url: 'https://www.youtube.com/c/defencedirecteducation', type: 'youtube' },
      { name: 'NDA Official (UPSC)', url: 'https://www.upsc.gov.in', type: 'website' },
      { name: 'Agniveer Vayu/Army/Navy Portal', url: 'https://agnipathvayu.cdac.in', type: 'website' }
    ]
  },
  {
    id: 'engineering-gate',
    title: 'Engineering Careers (GATE / PSU / Core)',
    icon: Code,
    color: '#f59e0b',
    whatToStudy: 'B.Tech / B.E. in respective branch (CSE, ECE, ME, CE, EE, etc.). GATE covers core engineering + Maths + Aptitude.',
    minCost: '\u20B950,000 - \u20B96,00,000 (B.Tech fees, govt college much lower) | GATE coaching: \u20B930,000 - \u20B91,50,000',
    jobSectors: ['PSUs (ONGC, NTPC, BHEL, IOCL, etc.)', 'ISRO, DRDO, BARC', 'Private IT/Software companies', 'Core Engineering firms', 'Consulting / Analytics', 'Higher Studies (M.Tech/MS via GATE score)'],
    typesOfJobs: [
      { post: 'PSU Engineer (through GATE)', salary: '\u20B940,000 - \u20B980,000 (in-hand, varies by PSU)' },
      { post: 'ISRO Scientist/Engineer', salary: '\u20B956,100 - \u20B91,77,500 (Pay Level 10-13)' },
      { post: 'Software Engineer (Private)', salary: '\u20B94,00,000 - \u20B915,00,000+ p.a.' },
      { post: 'Civil/Mechanical Engineer (Core)', salary: '\u20B93,00,000 - \u20B910,00,000 p.a.' },
      { post: 'M.Tech / PhD (Higher Studies)', salary: 'Stipend \u20B937,800 (M.Tech) | Research fellowship \u20B931,000-42,000' }
    ],
    preparationTime: 'GATE: 4 - 10 months | PSU interviews: 15-30 days after GATE | Campus placement: throughout final year',
    howToPrepare: [
      'Cover B.Tech syllabus thoroughly (focus on core subjects)',
      'Solve GATE previous year papers (15+ years)',
      'Take GATE mock tests regularly',
      'Focus on high-weightage topics for each branch',
      'For PSU: GATE score + PSU-specific interview prep',
      'For campus placement: aptitude + coding + technical + HR rounds',
      'Build projects and internships for resume strength',
      'Practice aptitude (quant, reasoning, verbal) for placements',
      'Learn DSA (Data Structures & Algorithms) for IT roles',
      'Prepare a strong resume and LinkedIn profile'
    ],
    freeResources: [
      { name: 'GATE Official Website', url: 'https://gate.iitd.ac.in', type: 'website' },
      { name: 'GATE Overflow (Free PYQs)', url: 'https://gateoverflow.in', type: 'website' },
      { name: 'NPTEL (IIT Free Courses)', url: 'https://nptel.ac.in', type: 'website' },
      { name: 'Neso Academy (YouTube)', url: 'https://www.youtube.com/c/NesoAcademy', type: 'youtube' },
      { name: 'Gate Smashers (YouTube)', url: 'https://www.youtube.com/c/GateSmashers', type: 'youtube' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org', type: 'website' },
      { name: 'ISC-IIA (Free GATE lectures)', url: 'https://www.youtube.com/c/ISCIIA', type: 'youtube' },
      { name: 'Unacademy GATE', url: 'https://www.youtube.com/c/unacademygate', type: 'youtube' }
    ]
  },
  {
    id: 'it-software',
    title: 'IT / Software Engineering',
    icon: Code,
    color: '#ec4899',
    whatToStudy: 'B.Tech CS/IT or any degree + coding bootcamp. Skills: Programming (Python, Java, C++), DSA, Web/App Development, Cloud, AI/ML.',
    minCost: '\u20B90 (free online learning) to \u20B93,00,000 (coding bootcamp)',
    jobSectors: ['IT Services (TCS, Infosys, Wipro, HCL)', 'Product Companies (Google, Microsoft, Amazon)', 'Startups (Freshworks, Zoho, Flipkart)', 'MNCs with India offices', 'Freelancing / Remote work', 'Banking / FinTech IT roles'],
    typesOfJobs: [
      { post: 'Software Developer / Engineer', salary: '\u20B94,00,000 - \u20B940,00,000+ p.a.' },
      { post: 'Frontend / Backend Developer', salary: '\u20B93,50,000 - \u20B925,00,000+ p.a.' },
      { post: 'Data Scientist / Analyst', salary: '\u20B95,00,000 - \u20B930,00,000+ p.a.' },
      { post: 'DevOps / Cloud Engineer', salary: '\u20B95,00,000 - \u20B935,00,000+ p.a.' },
      { post: 'AI/ML Engineer', salary: '\u20B96,00,000 - \u20B950,00,000+ p.a.' },
      { post: 'Cybersecurity Analyst', salary: '\u20B94,00,000 - \u20B920,00,000+ p.a.' }
    ],
    preparationTime: '3 - 12 months (skill-based) | Campus placement: aptitude + 2-3 technical rounds + HR | Off-campus: varies',
    howToPrepare: [
      'Learn at least one programming language thoroughly (Python/Java/C++)',
      'Master Data Structures & Arrays, Strings, Trees, Graphs',
      'Solve 300+ LeetCode / HackerRank problems',
      'Build 3-5 portfolio projects (web apps, mobile apps, APIs)',
      'Learn one frontend framework (React/Angular) + one backend (Node/Django)',
      'Understand databases (SQL + NoSQL)',
      'Learn Git/GitHub for version control',
      'Practice system design for senior roles',
      'Apply through campus placement, Naukri, LinkedIn, referrals',
      'Prepare for aptitude (quant, reasoning, verbal) for mass recruiter tests',
      'Practice mock interviews on Pramp / InterviewBit'
    ],
    freeResources: [
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'website' },
      { name: 'CS50 (Harvard - YouTube)', url: 'https://www.youtube.com/cs50', type: 'youtube' },
      { name: 'CodeWithHarry (YouTube)', url: 'https://www.youtube.com/c/CodeWithHarry', type: 'youtube' },
      { name: 'LeetCode', url: 'https://leetcode.com', type: 'website' },
      { name: 'HackerRank', url: 'https://www.hackerrank.com', type: 'website' },
      { name: 'Apna College (YouTube)', url: 'https://www.youtube.com/c/ApnaCollegeOfficial', type: 'youtube' },
      { name: 'Take U Forward (DSA)', url: 'https://www.youtube.com/c/takeUforward', type: 'youtube' },
      { name: 'Roadmap.sh (Career Paths)', url: 'https://roadmap.sh', type: 'website' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org', type: 'website' }
    ]
  },
  {
    id: 'teaching',
    title: 'Teaching / Education',
    icon: GraduationCap,
    color: '#14b8a6',
    whatToStudy: 'B.Ed / D.El.Ed (mandatory for govt teaching). CTET / TET qualification. B.A/B.Sc/B.Com + B.Ed for school teaching. NET/SET for college/university.',
    minCost: '\u20B920,000 - \u20B92,00,000 (B.Ed fees) | CTET/TET: \u20B91,000 - \u20B95,000 (exam fee)',
    jobSectors: ['Government Schools (KVS, NVS, State Govt)', 'Central Schools (Kendriya Vidyalaya, Navodaya)', 'Private Schools (CBSE, ICSE, State Board)', 'Colleges / Universities', 'Coaching Institutes', 'Online Teaching Platforms'],
    typesOfJobs: [
      { post: 'Primary Teacher (PRT)', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6)' },
      { post: 'Trained Graduate Teacher (TGT)', salary: '\u20B944,900 - \u20B91,42,400 (Pay Level 7)' },
      { post: 'Post Graduate Teacher (PGT)', salary: '\u20B947,600 - \u20B91,51,100 (Pay Level 8)' },
      { post: 'Assistant Professor (College)', salary: '\u20B957,700 - \u20B91,82,400 (Pay Level 10)' },
      { post: 'KVS / NVS PGT/TGT', salary: '\u20B944,900 - \u20B91,42,400 + Government benefits' },
      { post: 'Private School Teacher', salary: '\u20B915,000 - \u20B960,000/month (varies widely)' }
    ],
    preparationTime: 'CTET: 3-6 months | KVS/NVS: 4-8 months | NET/SET: 6-12 months | B.Ed: 2 years',
    howToPrepare: [
      'Complete B.Ed / D.El.Ed from a recognized institution',
      'Clear CTET (Central Teacher Eligibility Test) - Paper 1 (PRT) / Paper 2 (TGT)',
      'Appear for State TET for state govt teaching jobs',
      'For KVS/NVS: prepare general awareness, teaching aptitude, language',
      'For NET/SET: appear for UGC NET in your subject (for college teaching)',
      'Practice CTET previous year papers (10+ years)',
      'Focus on child development, pedagogy, learning principles',
      'Prepare current affairs and general knowledge',
      'Practice mock tests regularly',
      'Build teaching demo lessons for interview rounds'
    ],
    freeResources: [
      { name: 'CTET Official (CBSE)', url: 'https://ctet.nic.in', type: 'website' },
      { name: 'UGC NET Official', url: 'https://ugcnet.nta.nic.in', type: 'website' },
      { name: 'KVS Recruitment', url: 'https://kvs.ac.in', type: 'website' },
      { name: 'Adda247 Teaching', url: 'https://www.youtube.com/c/adda247', type: 'youtube' },
      { name: 'wifistudy Teaching', url: 'https://www.youtube.com/c/wifistudy', type: 'youtube' },
      { name: 'Study IQ Education', url: 'https://www.youtube.com/c/StudyIQeducation', type: 'youtube' },
      { name: 'Teachmint (Online Teaching)', url: 'https://teachmint.com', type: 'website' }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare (Doctor / Nurse / Pharma)',
    icon: HeartPulse,
    color: '#f97316',
    whatToStudy: 'MBBS (5.5 years) for Doctors. B.Sc Nursing (4 years). B.Pharm / D.Pharm for Pharmacy. NEET qualification mandatory for MBBS/BDS/BAMS/BHMS.',
    minCost: '\u20B910,000 - \u20B91,00,000 (Govt medical college) | \u20B950,00,000 - \u20B92,00,00,000 (Private medical college) | Nursing: \u20B950,000 - \u20B95,00,000',
    jobSectors: ['Government Hospitals (AIIMS, District, State)', 'Private Hospitals (Apollo, Fortis, Max)', 'Primary Health Centres (PHC/CHC)', 'Pharmaceutical Companies', 'Medical Research / Labs', 'Defence Medical Services (Army/Navy/Air Force)'],
    typesOfJobs: [
      { post: 'Doctor (MBBS - Govt)', salary: '\u20B956,100 - \u20B92,00,000+ (Pay Level 10-14)' },
      { post: 'Doctor (MBBS - Private)', salary: '\u20B96,00,000 - \u20B930,00,000+ p.a.' },
      { post: 'Nurse (Govt)', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6-8)' },
      { post: 'Pharmacist (Govt)', salary: '\u20B929,200 - \u20B992,300 (Pay Level 5)' },
      { post: 'Specialist Doctor (MD/MS)', salary: '\u20B967,700 - \u20B92,00,000+ (Pay Level 11-14)' },
      { post: 'Medical Officer (PHC)', salary: '\u20B956,100 - \u20B91,77,500 + Rural allowances' }
    ],
    preparationTime: 'NEET: 1-2 years prep | MBBS: 5.5 years (4.5 + 1 yr internship) | PG (MD/MS): 3 years | Nursing: 4 years | Pharmacist exam: 3-6 months',
    howToPrepare: [
      'For MBBS: Clear NEET (Class 11-12 Physics, Chemistry, Biology)',
      'Study NCERT Biology thoroughly (most NEET questions from NCERT)',
      'Practice NEET previous year papers (15+ years)',
      'Take NEET mock tests weekly',
      'For Nursing: appear for NEET or state-level nursing entrance',
      'For Pharmacy: GPAT for M.Pharm, state entrance for B.Pharm',
      'For govt medical jobs: appear for AIIMS/PGIMER/State entrance exams',
      'Focus on practical knowledge and clinical skills during education',
      'Prepare for NEET PG (after MBBS) for specialization',
      'Maintain good academic record throughout'
    ],
    freeResources: [
      { name: 'NEET Official (NTA)', url: 'https://neet.nta.nic.in', type: 'website' },
      { name: 'AIIMS Exam', url: 'https://www.aiimsexams.ac.in', type: 'website' },
      { name: 'Physics Wallah (YouTube)', url: 'https://www.youtube.com/c/physicswallah', type: 'youtube' },
      { name: 'Unacademy NEET', url: 'https://www.youtube.com/c/unacademyneet', type: 'youtube' },
      { name: 'Khan Academy Biology', url: 'https://www.youtube.com/khanacademyscience', type: 'youtube' },
      { name: 'NCERT Official (Free Books)', url: 'https://ncert.nic.in', type: 'website' },
      { name: 'Marrow (Medical App)', url: 'https://marrow.com', type: 'website' }
    ]
  },
  {
    id: 'police-jobs',
    title: 'Police / Law Enforcement',
    icon: Shield,
    color: '#6366f1',
    whatToStudy: 'Class 12 / Graduation depending on the post. Physical fitness is critical. Focus on General Knowledge, Reasoning, Quantitative Aptitude.',
    minCost: '\u20B90 - \u20B920,000 (self-study) | \u20B910,000 - \u20B950,000 (coaching + physical training)',
    jobSectors: ['State Police (Constable, SI, DSP)', 'Central Armed Police Forces (CRPF, BSF, CISF, ITBP, SSB)', 'CBI / NIA / IB / RAW', 'Delhi Police', 'Railway Protection Force (RPF)'],
    typesOfJobs: [
      { post: 'Constable (State Police)', salary: '\u20B921,700 - \u20B969,100 (Pay Level 3-4)' },
      { post: 'Sub Inspector (State Police)', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6)' },
      { post: 'DSP / Deputy SP', salary: '\u20B956,100 - \u20B91,77,500 (Pay Level 10)' },
      { post: 'CRPF/BSF/CISF Sub Inspector', salary: '\u20B935,400 - \u20B91,12,400 + Force allowances' },
      { post: 'CBI Officer', salary: '\u20B944,900 - \u20B91,42,400 (Pay Level 7)' },
      { post: 'Constable (Delhi Police)', salary: '\u20B925,500 - \u20B981,100 (Pay Level 5)' }
    ],
    preparationTime: '3 - 8 months | Written exam: 2-3 hours | Physical test: 1-2 days | Medical: 1 day | Documentation: 1 day',
    howToPrepare: [
      'Start physical fitness training early (running, push-ups, sit-ups, high jump)',
      'Meet height and chest requirements (varies by state and category)',
      'Study GK, Current Affairs, Reasoning, Quant (Class 10 level)',
      'Solve previous year police exam papers',
      'Practice running 1.6km in required time (varies: 5-7 minutes)',
      'Take mock written tests regularly',
      'Prepare for physical endurance test (PST/PET)',
      'Maintain medical fitness (eyesight, no tattoos on visible areas)',
      'Apply for state police + central forces simultaneously',
      'Keep all documents ready (age, education, caste, domicile certificates)'
    ],
    freeResources: [
      { name: 'State Police Recruitment Portals', url: 'https://www.police recruiting.gov.in', type: 'website' },
      { name: 'SSC (CAPF Recruitment)', url: 'https://ssc.nic.in', type: 'website' },
      { name: 'Adda247 Defence', url: 'https://www.youtube.com/c/adda247', type: 'youtube' },
      { name: 'Khan Sir Police Prep', url: 'https://www.youtube.com/c/khansirofficial', type: 'youtube' },
      { name: 'SSBCrackExams', url: 'https://www.youtube.com/c/ssbcrackexams', type: 'youtube' },
      { name: 'Testbook Police Exams', url: 'https://testbook.com', type: 'website' }
    ]
  },
  {
    id: 'agriculture',
    title: 'Agriculture / Rural Development',
    icon: Tractor,
    color: '#22c55e',
    whatToStudy: 'B.Sc Agriculture (4 years), B.Sc Horticulture, B.F.Sc (Fisheries), B.V.Sc (Veterinary). ICAR AIEEA entrance for admission.',
    minCost: '\u20B910,000 - \u20B91,50,000 (Govt colleges) | \u20B92,00,000 - \u20B910,00,000 (Private colleges)',
    jobSectors: ['Agricultural Research (ICAR, State Agri Universities)', 'Government Agriculture Department', 'Banking (Agricultural Officers)', 'Food Processing Industries', 'Agri-Tech Startups', 'NGOs / Rural Development Organizations'],
    typesOfJobs: [
      { post: 'Agricultural Officer (State)', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6)' },
      { post: 'Bank Agricultural Officer', salary: '\u20B936,000 - \u20B967,000' },
      { post: 'ICAR Scientist', salary: '\u20B956,100 - \u20B91,77,500 (Pay Level 10)' },
      { post: 'Block Agriculture Officer', salary: '\u20B929,200 - \u20B992,300 (Pay Level 5)' },
      { post: 'Food Safety Officer', salary: '\u20B935,400 - \u20B91,12,400 (Pay Level 6)' },
      { post: 'Agricultural Research Scientist', salary: '\u20B956,100 - \u20B91,77,500' }
    ],
    preparationTime: 'ICAR AIEEA: 3-6 months | State Agriculture Dept exams: 3-6 months | Banking (AO): 4-8 months',
    howToPrepare: [
      'Complete B.Sc Agriculture from ICAR-recognized university',
      'Prepare for ICAR AIEEA (UG/PG) for admission',
      'For Agriculture Officer: prepare GK, Agriculture subjects, Current Affairs',
      'Study soil science, crop production, plant pathology basics',
      'Learn about government agriculture schemes (PM-KISAN, etc.)',
      'Practice previous year ICAR and state agriculture exam papers',
      'For banking AO: prepare Quant, Reasoning, English + Agriculture awareness',
      'Stay updated with agricultural news and policies',
      'Take online mock tests for competitive exams',
      'Build practical knowledge through field visits and internships'
    ],
    freeResources: [
      { name: 'ICAR Official', url: 'https://icar.org.in', type: 'website' },
      { name: 'Agriculture Information', url: 'https://agricoop.nic.in', type: 'website' },
      { name: 'Krishi Vigyan Kendra', url: 'https://kvk.icar.gov.in', type: 'website' },
      { name: 'Un Agricultural Science', url: 'https://www.youtube.com/c/unacademy', type: 'youtube' },
      { name: 'Agriculture Wale (YouTube)', url: 'https://www.youtube.com/c/AgricultureWale', type: 'youtube' },
      { name: 'PM-KISAN Portal', url: 'https://pmkisan.gov.in', type: 'website' },
      { name: 'Agriculture Job Updates', url: 'https://www.agrigater.com', type: 'website' }
    ]
  },
  {
    id: 'law-legal',
    title: 'Law / Legal Careers',
    icon: Scale,
    color: '#a855f7',
    whatToStudy: 'BA LLB (5 years after Class 12) or LLB (3 years after graduation). CLAT / AILET / LSAT for top NLUs. AIBE for practice license.',
    minCost: '\u20B910,000 - \u20B92,00,000 (Govt NLUs) | \u20B95,00,000 - \u20B925,00,000 (Private law colleges)',
    jobSectors: ['Courts (District, High Court, Supreme Court)', 'Law Firms (Cyril Amarchand, AZB, Khaitan)', 'Corporate Legal Departments', 'Government Legal Services', 'Judiciary (Judicial Services Exam)', 'Legal Aid / NGOs'],
    typesOfJobs: [
      { post: 'Judicial Magistrate / Civil Judge', salary: '\u20B977,840 - \u20B91,36,500 (entry level, varies by state)' },
      { post: 'High Court Judge', salary: '\u20B92,25,000 - \u20B92,80,000' },
      { post: 'Corporate Lawyer (Law Firm)', salary: '\u20B98,00,000 - \u20B950,00,000+ p.a.' },
      { post: 'Government Lawyer (Public Prosecutor)', salary: '\u20B944,900 - \u20B91,42,400 + practice fees' },
      { post: 'Legal Advisor (Corporate)', salary: '\u20B95,00,000 - \u20B925,00,000+ p.a.' },
      { post: 'Junior Advocate (Under Senior)', salary: '\u20B910,000 - \u20B930,000/month (stipend)' }
    ],
    preparationTime: 'CLAT: 6-12 months | LLB: 3 years | Judicial Services: 1-3 years of practice + exam | AIBE: qualifying exam',
    howToPrepare: [
      'For 5-year integrated law: crack CLAT/AILET/LSAT',
      'CLAT preparation: English, Current Affairs, GK, Legal Reasoning, Quant',
      'Read The Hindu / Indian Express for current affairs daily',
      'Practice legal reasoning and logical reasoning questions',
      'Solve CLAT previous year papers (10+ years)',
      'For LLB (3-year): prepare for university entrance exams',
      'After graduation: prepare for Judicial Services exam',
      'Build reading habit: read landmark judgments and legal journals',
      'Intern at law firms, courts, or legal aid organizations',
      'Prepare for AIBE (All India Bar Examination) to start practice',
      'Develop mooting and advocacy skills during law school'
    ],
    freeResources: [
      { name: 'CLAT Official (Consortium)', url: 'https://consortiumofnlus.ac.in', type: 'website' },
      { name: 'AIBE Official (BCI)', url: 'https://www.barindia.org', type: 'website' },
      { name: 'Legal Bites (YouTube)', url: 'https://www.youtube.com/c/LegalBites', type: 'youtube' },
      { name: 'Law School 101', url: 'https://www.youtube.com/c/lawschool101', type: 'youtube' },
      { name: 'Live Law', url: 'https://www.livelaw.in', type: 'website' },
      { name: 'SCC Online (Free)', url: 'https://www.scconline.com', type: 'website' },
      { name: 'NLUD Free Resources', url: 'https://nludelhi.ac.in', type: 'website' }
    ]
  }
];

function CareerModal({ career, onClose }) {
  if (!career) return null;
  const Icon = career.icon;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="career-modal-overlay" onClick={handleOverlayClick}>
      <div className="career-modal">
        <div className="career-modal-header" style={{ borderColor: `${career.color}40` }}>
          <div className="modal-header-left">
            <div className="career-icon" style={{ background: `${career.color}20`, color: career.color }}>
              <Icon size={22} />
            </div>
            <h2>{career.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="career-modal-body">
          <div className="career-section">
            <h3><BookOpen size={16} /> What to Study</h3>
            <p className="career-text">{career.whatToStudy}</p>
          </div>

          <div className="career-section">
            <h3><IndianRupee size={16} /> Minimum Cost</h3>
            <p className="career-text cost-highlight">{career.minCost}</p>
          </div>

          {career.streamGuide && (
            <div className="career-section">
              <h3><Search size={16} /> Stream-wise Career Paths</h3>
              {career.streamGuide.map((stream, si) => (
                <div key={si} className="stream-block">
                  <h4 className="stream-title">{stream.stream}</h4>
                  <div className="stream-careers">
                    {stream.careers.map((c, ci) => (
                      <div key={ci} className="stream-career-row">
                        <span className="stream-career-name">{c.career}</span>
                        <span className="stream-career-path">{c.path}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {career.after12thGuide && (
            <div className="career-section">
              <h3><GraduationCap size={16} /> Course Options</h3>
              {career.after12thGuide.map((group, gi) => (
                <div key={gi} className="stream-block">
                  <h4 className="stream-title">{group.stream}</h4>
                  <div className="course-cards">
                    {group.options.map((opt, oi) => (
                      <div key={oi} className="course-card">
                        <div className="course-card-header">
                          <span className="course-name">{opt.course}</span>
                          <span className="course-salary">{opt.salary}</span>
                        </div>
                        <div className="course-details">
                          <div className="course-detail">
                            <span className="course-detail-label">Entrance:</span>
                            <span>{opt.entrance}</span>
                          </div>
                          <div className="course-detail">
                            <span className="course-detail-label">Cost:</span>
                            <span>{opt.cost}</span>
                          </div>
                          <div className="course-detail">
                            <span className="course-detail-label">Careers:</span>
                            <span>{opt.careers}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {career.jobSectors && career.jobSectors.length > 0 && (
            <div className="career-section">
              <h3><Search size={16} /> Job Sectors</h3>
              <ul className="career-list">
                {career.jobSectors.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {career.typesOfJobs && career.typesOfJobs.length > 0 && (
            <div className="career-section">
              <h3><Briefcase size={16} /> Types of Jobs & Salary</h3>
              <div className="salary-table">
                {career.typesOfJobs.map((job, i) => (
                  <div key={i} className="salary-row">
                    <span className="salary-post">{job.post}</span>
                    <span className="salary-amount">{job.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="career-section">
            <h3><Clock size={16} /> Preparation Timeline</h3>
            <p className="career-text timeline-box">{career.preparationTime}</p>
          </div>

          <div className="career-section">
            <h3><Target size={16} /> How to Prepare</h3>
            <ol className="career-steps">
              {career.howToPrepare.map((step, i) => (
                <li key={i}>
                  <span className="step-number">{i + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="career-section">
            <h3><Trophy size={16} /> Free Resources</h3>
            <div className="resource-links">
              {career.freeResources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`resource-link ${res.type === 'youtube' ? 'youtube' : 'website'}`}
                >
                  {res.type === 'youtube' ? <Play size={14} /> : <ExternalLink size={14} />}
                  <span>{res.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareerGuide() {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCareers = careers.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.whatToStudy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobSectors.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.howToPrepare.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="career-page">
      <div className="career-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Back to Home
        </button>
        <div className="career-hero">
          <h1>Career Guide</h1>
          <p>Explore detailed career paths in India. Find out what to study, costs, salaries, preparation strategies, and free resources to crack any exam.</p>
        </div>

        <div className="career-controls">
          <input
            type="text"
            placeholder="Search careers (e.g. banking, UPSC, IT, doctor)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="career-search"
          />
        </div>
      </div>

      <div className="career-grid">
        {filteredCareers.map(career => {
          const Icon = career.icon;
          return (
            <button
              key={career.id}
              className="career-card"
              onClick={() => setSelectedCareer(career)}
            >
              <div className="career-card-icon" style={{ background: `${career.color}20`, color: career.color }}>
                <Icon size={28} />
              </div>
              <h3 className="career-card-title">{career.title}</h3>
              <p className="career-card-meta">{career.howToPrepare.length} preparation steps &middot; {career.freeResources.length} free resources</p>
            </button>
          );
        })}
        {filteredCareers.length === 0 && (
          <div className="no-results">
            <p>No careers found for &quot;{searchQuery}&quot;</p>
            <button className="action-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
        )}
      </div>

      {selectedCareer && (
        <CareerModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
        />
      )}

      <div className="career-disclaimer">
        <p><strong>Note:</strong> Salaries are approximate and may vary by city, experience, and employer. Costs are indicative and subject to change. Always verify current exam patterns and syllabi from official websites.</p>
      </div>
    </div>
  );
}
