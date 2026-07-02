import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CreditCard, Building2, Scale, GraduationCap,
  Landmark, HeartPulse, Building, ShieldAlert, AlertTriangle,
  Users, Wifi, Baby, Phone as PhoneIcon, LandPlot, Briefcase,
  ArrowLeft, ExternalLink, Phone, Clock, DollarSign, CheckCircle2, X
} from 'lucide-react';
import './HelpPage.css';

const categories = [
  {
    id: 'tax-filing',
    title: 'Tax Filing (Income Tax)',
    icon: FileText,
    color: '#3b82f6',
    whoToContact: [
      'Income Tax Department of India (CBDT)',
      'Chartered Accountant (CA) or tax consultant',
      'CSC (Common Service Centres) for rural areas',
      'Online through Income Tax e-Filing portal',
      'TRACES (for TDS-related queries)'
    ],
    requiredDocuments: [
      'PAN (Permanent Account Number)',
      'Aadhaar Card (linked to PAN)',
      'Form 16 (from employer for salaried individuals)',
      'Form 16A / Form 26AS (TDS certificates)',
      'Bank statements and interest certificates',
      'Investment proofs (LIC, PPF, ELSS, NSC, etc.)',
      'Rent receipts (for HRA exemption)',
      'Home loan interest certificate',
      'Capital gains statements (if applicable)',
      'Previous year ITR acknowledgement',
      'Digital Signature Certificate (for online filing, optional)'
    ],
    estimatedCost: {
      selfFiling: 'Free (via Income Tax portal)',
      caOrConsultant: '\u20B9500 - \u20B95,000 (based on complexity)',
      nriTaxFiling: '\u20B92,000 - \u20B910,000',
      businessReturns: '\u20B93,000 - \u20B925,000+'
    },
    timeline: 'E-filing refund: 20-45 days | Paper filing: 3-6 months | Filing deadline: July 31 (individuals), October 31 (audited cases)',
    steps: [
      'Collect all Form 16, Form 26AS, and investment proofs',
      'Log in to the Income Tax e-Filing portal (incometax.gov.in)',
      'Select the appropriate ITR form (ITR-1 to ITR-7 based on income type)',
      'Enter salary income, interest income, capital gains, and other income details',
      'Claim deductions under Section 80C, 80D, 80E, 80G, etc.',
      'Claim HRA, LTA, and other exemptions',
      'Verify Form 26AS and Annual Information Statement (AIS) for TDS accuracy',
      'Compute tax liability and check for any tax due or refund',
      'Pay any outstanding tax via Challan 280 before filing',
      'Submit the ITR online and verify within 30 days (via Aadhaar OTP, net banking, or physical ITR-V)',
      'Download and save the ITR acknowledgement (ITR-V)'
    ],
    websites: [
      { name: 'Income Tax e-Filing Portal', url: 'https://incometax.gov.in' },
      { name: 'TRACES (TDS)', url: 'https://www.tdscpc.gov.in' },
      { name: 'Form 26AS / AIS', url: 'https://www.tdscpc.gov.in/app/login.xhtml' },
      { name: 'Tax Calendar & Deadlines', url: 'https://www.incometaxindia.gov.in/charts%20%20tables/tax%20calendar.htm' },
      { name: 'Income Tax India (Official)', url: 'https://www.incometaxindia.gov.in' }
    ]
  },
  {
    id: 'passport',
    title: 'Passport Application',
    icon: CreditCard,
    color: '#8b5cf6',
    whoToContact: [
      'Passport Seva Kendra (PSK) / Regional Passport Office (RPO)',
      'Post Office Passport Seva Kendra (POPSK)',
      'Tatkaal Passport Seva Kendra (for urgent needs)',
      'Passport Seva Helpline: 1800-258-1800 (Toll Free)',
      'VFS Global (for overseas applicants)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'PAN Card',
      'Birth Certificate (proof of date of birth)',
      'Address proof (Aadhaar, utility bills, bank statement)',
      'Educational qualifications certificates',
      'Old passport (for renewal)',
      'Marriage certificate (if applicable)',
      'Annexure H (for minors, with parents\' consent)',
      'Passport-size photographs (white background)',
      'Self-declaration for any name change or address change'
    ],
    estimatedCost: {
      freshPassport36Pages: '\u20B91,500 (36 pages, normal)',
      freshPassport60Pages: '\u20B92,000 (60 pages, normal)',
      tatkaal36Pages: '\u20B93,500 (36 pages, Tatkaal)',
      tatkaal60Pages: '\u20B94,000 (60 pages, Tatkaal)',
      minorPassport: '\u20B91,000 (normal)',
      policeVerification: 'Free (included in fees)'
    },
    timeline: 'Normal: 7-15 working days | Tatkaal: 1-3 working days | Police verification: 2-5 working days | Re-issue: 7-15 working days',
    steps: [
      'Register on the Passport Seva portal (passportindia.gov.in)',
      'Fill the online application form and upload documents',
      'Pay the fee online via net banking, UPI, or debit/credit card',
      'Schedule an appointment at the nearest PSK or POPSK',
      'Carry all original documents and photocopies to the appointment',
      'Biometrics and photograph captured at the PSK',
      'Application processed and sent for police verification (if required)',
      'Police verification completed at your address',
      'Passport dispatched via Speed Post',
      'Track status online using the file number'
    ],
    websites: [
      { name: 'Passport Seva Portal', url: 'https://www.passportindia.gov.in' },
      { name: 'Track Passport Status', url: 'https://www.passportindia.gov.in/AppOnlineProject/statusTracker/trackStatusIn498' },
      { name: 'Fee Calculator', url: 'https://www.passportindia.gov.in/AppOnlineProject/misc/feeCalculator' },
      { name: 'Locate PSK/POPSK', url: 'https://www.passportindia.gov.in/AppOnlineProject/servlet/RPLocalPSK?stateCd=&distCd=&cityCd=' },
      { name: 'Passport Seva Mobile App', url: 'https://www.passportindia.gov.in/MobileApp/MobileApp.html' }
    ]
  },
  {
    id: 'starting-business',
    title: 'Starting a Business',
    icon: Building2,
    color: '#10b981',
    whoToContact: [
      'Ministry of Corporate Affairs (MCA) - Company registration',
      'Registrar of Companies (ROC)',
      'District Industries Centre (DIC) - MSME support',
      'GST Suvidha Provider (GSP) - GST registration',
      'MSME Registration Portal (Udyam)',
      'Local Municipal Corporation - Trade license',
      'CA (Chartered Accountant) for incorporation and compliance'
    ],
    requiredDocuments: [
      'PAN and Aadhaar of all directors/partners',
      'Address proof of registered office (rent agreement/ownership proof)',
      'MOA (Memorandum of Association) and AOA (Articles of Association)',
      'Director Identification Number (DIN) / Designated Partner Identification Number (DPIN)',
      'Digital Signature Certificate (DSC) for all directors',
      'Passport-size photographs of directors',
      'Board resolution for company incorporation',
      'Identity and address proof of shareholders',
      'No Objection Certificate (NOC) from property owner',
      'Business plan (for MSME loans or startup funding)'
    ],
    estimatedCost: {
      soleProprietor: '\u20B92,000 - \u20B910,000 (PAN, GST, MSME registration)',
      llp: '\u20B95,000 - \u20B915,000 (including CA fees)',
      privateLimited: '\u20B915,000 - \u20B950,000 (including DSC, DIN, ROC fees)',
      annualCompliance: '\u20B910,000 - \u20B950,000/year (CA, audit, GST returns)'
    },
    timeline: 'Udyam/MSME registration: 1-2 days (online) | GST registration: 3-7 working days | LLP registration: 10-15 working days | Private Ltd registration: 15-25 working days',
    steps: [
      'Decide on business structure (Proprietorship, Partnership, LLP, Pvt Ltd, OPC)',
      'Apply for DSC (Digital Signature Certificate) for all directors',
      'Apply for DIN (Director Identification Number)',
      'Reserve company name via MCA (RUN service or SPICe+ form)',
      'File incorporation application (SPICe+ for Pvt Ltd, FiLLiP for LLP)',
      'Obtain Certificate of Incorporation from ROC',
      'Apply for PAN and TAN for the company',
      'Open a current account in the company name',
      'Register for GST (mandatory if turnover > \u20B940 lakh)',
      'Register on Udyam portal for MSME benefits',
      'Obain trade license from local municipal authority',
      'Apply for other registrations as needed (PF, ESI, Professional Tax, Shop & Establishment)'
    ],
    websites: [
      { name: 'MCA (Ministry of Corporate Affairs)', url: 'https://www.mca.gov.in' },
      { name: 'Udyam Registration (MSME)', url: 'https://udyamregistration.gov.in' },
      { name: 'GST Portal', url: 'https://www.gst.gov.in' },
      { name: 'SPICe+ (Company Incorporation)', url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html' },
      { name: 'Startup India Registration', url: 'https://www.startupindia.gov.in' },
      { name: 'NSDL / UTIITSL (PAN/TAN)', url: 'https://www.tin-nsdl.com' }
    ]
  },
  {
    id: 'legal-help',
    title: 'Legal Help',
    icon: Scale,
    color: '#ef4444',
    whoToContact: [
      'District Legal Services Authority (DLSA) - Free legal aid',
      'State Legal Services Authority (SLSA)',
      'National Legal Services Authority (NALSA)',
      'Bar Council of India / State Bar Council',
      'Lok Adalat (for settlement of disputes)',
      'Police Station (for filing FIR / complaints)',
      'Private Advocate / Law Firm',
      'Legal Aid Clinics at Law Universities'
    ],
    requiredDocuments: [
      'Aadhaar Card and PAN Card',
      'Aadhaar card or identity proof',
      'Relevant court documents (if applicable)',
      'Written complaint or petition',
      'Evidence and supporting documents',
      'Police reports / FIR copies',
      'Property documents (for property disputes)',
      'Employment or income proof (for legal aid eligibility)',
      'Power of Attorney (if filing through a representative)',
      'Previous correspondence related to the dispute'
    ],
    estimatedCost: {
      legalAid: 'Free (for eligible individuals below poverty line)',
      lokAdalat: 'Free (no court fee)',
      privateLawyer: '\u20B95,000 - \u20B950,000+ (varies by case complexity and lawyer seniority)',
      courtFees: '\u20B9100 - \u20B95,000 (depends on case type and value)',
      arbitration: '\u20B910,000 - \u20B92,00,000+'
    },
    timeline: 'FIR registration: Immediate to 24 hours | Legal aid application: 7-15 days | Lok Adalat: 1-3 months | Court proceedings: 6 months - several years | Arbitration: 3-12 months',
    steps: [
      'Identify the type of legal help needed (civil, criminal, family, consumer, etc.)',
      'For free legal aid, check eligibility (BPL card holders, women, SC/ST, etc.)',
      'Contact DLSA or NALSA helpline (15100 / 1516) for free legal assistance',
      'Register on e-Committee portal for e-courts services',
      'File a complaint at the local police station (for criminal matters) or consumer forum',
      'For civil disputes, engage a lawyer and file a suit in the appropriate court',
      'If both parties agree, opt for Lok Adalat or mediation for faster resolution',
      'File RTI (Right to Information) if you need government records for your case',
      'Attend all court hearings as scheduled',
      'Maintain a complete record of all case documents and communications'
    ],
    websites: [
      { name: 'NALSA (Legal Services)', url: 'https://nalsa.gov.in' },
      { name: 'e-Courts Services', url: 'https://ecourts.gov.in' },
      { name: 'DLSA Directory', url: 'https://districts.nic.in' },
      { name: 'RTI Online', url: 'https://rtionline.gov.in' },
      { name: 'Consumer Helpline', url: 'https://consumerhelpline.gov.in' },
      { name: 'Bar Council of India', url: 'https://www.barcouncilofindia.org' }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    color: '#f59e0b',
    whoToContact: [
      'Ministry of Education, Government of India',
      'CBSE / ICSE / State Board (for school education)',
      'UGC (University Grants Commission) for higher education',
      'AICTE (All India Council for Technical Education)',
      'National Testing Agency (NTA) for entrance exams',
      'State Education Department',
      'School / College Admissions Office'
    ],
    requiredDocuments: [
      'Aadhaar Card (student and parent)',
      'Birth Certificate',
      'Transfer Certificate (TC) from previous school',
      'Report cards / marksheets',
      'Migration Certificate (for changing boards/universities)',
      'Passport-size photographs',
      'Caste certificate (if applicable for reservation)',
      'Income certificate (for scholarships)',
      'Domicile certificate (for state-level admissions)',
      'Entrance exam score card (JEE, NEET, CUET, etc.)',
      'Aadhaar enrollment receipt (if Aadhaar not yet received)'
    ],
    estimatedCost: {
      govtSchool: 'Free (under RTE Act for ages 6-14)',
      privateSchool: '\u20B920,000 - \u20B95,00,000+ per year',
      engineeringCollege: '\u20B950,000 - \u20B920,00,000 per year',
      medicalCollege: '\u20B910,00,000 - \u20B925,00,000+ per year',
      artsScience: '\u20B95,000 - \u20B91,00,000 per year',
      coaching: '\u20B950,000 - \u20B93,00,000+ (for competitive exam coaching)'
    },
    timeline: 'School admission: 1-2 months (March-May) | CUET/JEE/NEET registration: 2-3 months before exam | College admission: June-August | Scholarship disbursal: 1-3 months after verification',
    steps: [
      'Research courses and institutions based on career goals',
      'Check eligibility criteria and admission requirements',
      'Appear for required entrance exams (JEE, NEET, CUET, state CET, etc.)',
      'Register on central/state admission portals during application window',
      'Fill the application form and upload required documents',
      'Pay application fees (SC/ST/PwD categories often get fee waiver)',
      'Check cut-off lists and attend counselling (JoSAA, MCC, state counselling)',
      'Secure seat by paying admission fee and completing document verification',
      'Apply for scholarships (NSP, state scholarships, private scholarships)',
      'Apply for education loans if needed (SBI, bank of Baroda, etc.)',
      'Complete hostel and other admission formalities'
    ],
    websites: [
      { name: 'Ministry of Education', url: 'https://www.education.gov.in' },
      { name: 'NTA (National Testing Agency)', url: 'https://www.nta.ac.in' },
      { name: 'UGC (Higher Education)', url: 'https://www.ugc.ac.in' },
      { name: 'AICTE (Technical Education)', url: 'https://www.aicte-india.org' },
      { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
      { name: 'DigiLocker (Documents)', url: 'https://www.digilocker.gov.in' },
      { name: 'CBSE Portal', url: 'https://www.cbse.gov.in' }
    ]
  },
  {
    id: 'banking',
    title: 'Banking & Financial Services',
    icon: Landmark,
    color: '#06b6d4',
    whoToContact: [
      'SBI / HDFC / ICICI / Bank of Baroda (or your bank)',
      'RBI (Reserve Bank of India) for complaints',
      'Banking Ombudsman (for grievance redressal)',
      'SEBI (for investment and stock market queries)',
      'IRDAI (for insurance-related matters)',
      'NPCI (for UPI and digital payment issues)',
      'PFRDA (for National Pension System)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'PAN Card',
      'Passport-size photographs',
      'Address proof (utility bill, rent agreement)',
      'Income proof (salary slips, ITR)',
      'Existing bank statements (for loans)',
      'Business documents (for business loans)',
      'Form 16 / Salary certificate',
      'Collateral documents (for secured loans)',
      'KYC documents (Aadhaar + PAN mandatory)'
    ],
    estimatedCost: {
      savingsAccount: 'Free (no minimum balance for Jan Dhan accounts)',
      regularSavings: '\u20B90 - \u20B91,000/year (minimum balance penalty varies)',
      homeLoan: 'Interest rates: 8.5% - 11% p.a. | Processing fee: 0.25% - 1% of loan amount',
      personalLoan: 'Interest rates: 10% - 18% p.a. | Processing fee: 1% - 3%',
      creditCard: 'Annual fee: \u20B90 - \u20B95,000 (varies by card type)',
      dematAccount: '\u20B90 - \u20B9300/year (account maintenance)'
    },
    timeline: 'Savings account: Same day (with Aadhaar e-KYC) | Home loan approval: 7-30 days | Credit card: 7-21 days | Fixed deposit: Same day | UPI registration: Instant',
    steps: [
      'Compare banks for interest rates, fees, and services',
      'Gather KYC documents (Aadhaar, PAN, photos)',
      'Visit the bank branch or apply online via bank website/app',
      'Fill the account opening or loan application form',
      'Submit KYC documents (Aadhaar e-KYC for instant opening)',
      'Complete in-person verification (if required)',
      'Set up internet banking and mobile banking',
      'Register for UPI (Google Pay, PhonePe, Paytm, BHIM)',
      'For loans: get pre-approved offers and compare rates',
      'Review loan agreement terms, interest rates, and prepayment charges',
      'Set up auto-debit for EMI payments',
      'File complaint with Banking Ombudsman if unresolved within 30 days'
    ],
    websites: [
      { name: 'RBI (Reserve Bank of India)', url: 'https://www.rbi.org.in' },
      { name: 'RBI Banking Ombudsman', url: 'https://cms.rbi.org.in/cms/cmsindex.aspx?pageid=204' },
      { name: 'NPCI (UPI/Digital Payments)', url: 'https://www.npci.org.in' },
      { name: 'SEBI (Capital Markets)', url: 'https://www.sebi.gov.in' },
      { name: 'BankBazaar (Compare Rates)', url: 'https://www.bankbazaar.com' },
      { name: 'Paisabazaar (Loan Comparison)', url: 'https://www.paisabazaar.com' }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: HeartPulse,
    color: '#ec4899',
    whoToContact: [
      'Ministry of Health & Family Welfare',
      'Primary Health Centre (PHC) / Community Health Centre (CHC)',
      'District Hospital',
      'Ayushman Bharat (PMJAY) helpline: 14555 / 1800-111-565',
      'State Health Insurance Scheme offices',
      'CGHS / ECHS (for government employees / ex-servicemen)',
      'Pharmacy (for prescription medicines)'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Ayushman Bharat - PMJAY card (if eligible)',
      'Health insurance policy documents',
      'Prescription from registered medical practitioner',
      'Medical records and previous prescriptions',
      'Lab reports and diagnostic results',
      'Income certificate (for free treatment schemes)',
      'BPL / Ration card (for subsidized treatment)',
      'Referral letter (for treatment at higher centres)',
      'Discharge summary (for insurance claims)'
    ],
    estimatedCost: {
      govtHospital: 'Free / Highly subsidized (for BPL)',
      privateClinic: '\u20B9200 - \u20B92,000 per visit',
      privateHospital: '\u20B95,000 - \u20B950,000+ per day (varies by city and ward type)',
      healthInsurance: '\u20B95,000 - \u20B950,000+ per year (family floater)',
      ambulance: '\u20B90 (108) to \u20B95,000+ (private ambulance)',
      medicines: '20%-90% cheaper at Jan Aushadhi Kendras vs branded drugs'
    },
    timeline: 'PHC/CHC: Same day (OPD) | Specialist appointment: 1-4 weeks | Insurance claim: 7-30 days | Ayushman Bharat treatment: Immediate (at empanelled hospitals) | Elective surgery: 1-4 weeks',
    steps: [
      'For emergencies: Call 108 (ambulance) or visit nearest hospital immediately',
      'For OPD: Visit local PHC/CHC (government facilities are free/subsidized)',
      'Check eligibility for Ayushman Bharat - PMJAY (covers up to \u20B95 lakh/year)',
      'Register on Ayushman Bharat portal or call helpline to get your card',
      'For private hospitals: Check if your insurance is accepted (cashless facility)',
      'Get referral from PHC/CHC for treatment at district/state hospitals',
      'For medicines: Visit Jan Aushadhi Kendra for generic medicines at 50-90% discount',
      'Purchase health insurance if not covered by employer or government scheme',
      'Keep all medical bills and prescriptions for insurance claims',
      'For mental health: Visit District Mental Health Programme (DMHP) centres',
      'Register on CoWIN portal for vaccinations'
    ],
    websites: [
      { name: 'Ayushman Bharat - PMJAY', url: 'https://pmjay.gov.in' },
      { name: 'Ministry of Health', url: 'https://www.mohfw.gov.in' },
      { name: 'Jan Aushadhi Kendra', url: 'https://janaushadhi.gov.in' },
      { name: 'CoWIN (Vaccination)', url: 'https://www.cowin.gov.in' },
      { name: 'National Health Portal', url: 'https://www.nhp.gov.in' },
      { name: 'AIIMS Portal', url: 'https://www.aiims.edu' },
      { name: 'eSanjeevani (Telemedicine)', url: 'https://esanjeevani.mohfw.gov.in' }
    ]
  },
  {
    id: 'government-services',
    title: 'Government Services (Common)',
    icon: Building,
    color: '#14b8a6',
    whoToContact: [
      'Common Service Centres (CSCs) - for most govt services',
      'UIDAI (for Aadhaar related services)',
      'Income Tax Department (for PAN)',
      'RTO / Regional Transport Office (for driving license, vehicle registration)',
      'Municipal Corporation (for birth/death certificates, property tax)',
      'District Collector Office (for income, caste, residence certificates)',
      'Telecom Department (for mobile number linking)',
      'India Post (for postal services, passport dispatch)'
    ],
    requiredDocuments: [
      'Aadhaar Card (for most services)',
      'PAN Card',
      'Address proof (utility bill, bank statement)',
      'Age proof (birth certificate, 10th marksheet)',
      'Photographs (passport size)',
      'Ration Card (for some welfare schemes)',
      'Income certificate (for subsidies)',
      'Vehicle documents (RC, insurance, PUC for RTO services)',
      'Application form (varies by service)',
      'Fee receipt / Challan'
    ],
    estimatedCost: {
      aadhaarNew: '\u20B90 (free for children below 15)',
      aadhaarUpdate: '\u20B950 (online) | \u20B9100 (at centre)',
      panCard: '\u20B9107 (Indian address) | \u20B91,017 (foreign address)',
      panCorrection: '\u20B9107',
      drivingLicense: '\u20B9200 - \u20B91,000 (varies by state)',
      vehicleRegistration: '\u20B9600 - \u20B95,000 (varies by vehicle type)',
      birthCertificate: '\u20B90 - \u20B9100',
      rationCard: '\u20B90 - \u20B950 (varies by state)'
    },
    timeline: 'Aadhaar generation: 60-90 days | PAN card: 15-20 days | Driving license: 15-30 days | Birth certificate: 7-30 days | Ration card: 15-45 days | Income certificate: 7-15 days',
    steps: [
      'Identify the specific government service you need',
      'Visit the official portal or nearest Common Service Centre (CSC)',
      'Keep Aadhaar and PAN ready (mandatory for most services)',
      'For Aadhaar: Visit nearest Aadhaar Enrolment/Update Centre',
      'For PAN: Apply online via NSDL or UTIITSL portal',
      'For driving license: Apply on Parivahan / Sarathi portal',
      'For certificates (birth, death, income, caste): Apply at Tehsil/District office or e-District portal',
      'Pay fees online via UPI, net banking, or card',
      'Track application status using acknowledgement number',
      'Download e-documents from DigiLocker where available',
      'File grievances via CPGRAMS (pgportal.gov.in) if service is delayed'
    ],
    websites: [
      { name: 'UIDAI (Aadhaar)', url: 'https://uidai.gov.in' },
      { name: 'MyAadhaar Portal', url: 'https://myaadhaar.uidai.gov.in' },
      { name: 'NSDL (PAN)', url: 'https://www.tin-nsdl.com' },
      { name: 'Parivahan (Transport)', url: 'https://parivahan.gov.in' },
      { name: 'DigiLocker', url: 'https://www.digilocker.gov.in' },
      { name: 'e-District Portal', url: 'https://edistrict.gov.in' },
      { name: 'CPGRAMS (Grievances)', url: 'https://pgportal.gov.in' },
      { name: 'UMANG (Govt Services App)', url: 'https://web.umang.gov.in' }
    ]
  },
  {
    id: 'bribery-corruption',
    title: 'Bribery & Corruption',
    icon: ShieldAlert,
    color: '#ef4444',
    whoToContact: [
      'Central Vigilance Commission (CVC) - for central govt corruption',
      'State Anti-Corruption Bureau (ACB)',
      'Central Bureau of Investigation (CBI) - for high-level cases',
      'Lokpal / Lokayukta - for complaints against public servants',
      'Vigilance Commissioner (state level)',
      'District Magistrate / Collector',
      'Police - anti-corruption cell'
    ],
    requiredDocuments: [
      'Written complaint with date, time, place of incident',
      'Name and designation of the officer demanding bribe',
      'Details of work/permission being delayed',
      'Evidence: audio/video recording, screenshots, chat records',
      'Witness details (if any)',
      'Any written communication (letters, emails, messages)',
      'Proof of identity of complainant (Aadhaar)',
      'RTI replies (if obtained as evidence)'
    ],
    estimatedCost: {
      filingComplaint: 'Free',
      rtifiling: '\u20B910 per application',
      legalAid: 'Free (for eligible persons)',
      compensation: 'Varies - can claim damages'
    },
    timeline: 'CVC complaint: 3 months to 1 year | ACB inquiry: 6 months - 2 years | CBI investigation: 1-3 years | RTI: 30 days response',
    steps: [
      'Try to gather evidence before filing complaint (audio/video if safe)',
      'File RTI application to get official records of the delayed work',
      'File complaint on CPGRAMS portal (pgportal.gov.in) for central govt',
      'For state govt: file complaint with State Anti-Corruption Bureau',
      'For serious cases: file directly with CVC (cvc.gov.in) or CBI',
      'File RTI to get information about file movement and delays',
      'Report to Lokpal if complaint is against senior officials',
      'Keep all evidence safe and maintain copies',
      'Follow up regularly on complaint status',
      'If threatened, inform police and request protection',
      'You can also complain anonymously via CVC whistleblower portal'
    ],
    websites: [
      { name: 'Central Vigilance Commission (CVC)', url: 'https://cvc.gov.in' },
      { name: 'CBI Complaint Portal', url: 'https://cbi.gov.in' },
      { name: 'CPGRAMS (Grievance Portal)', url: 'https://pgportal.gov.in' },
      { name: 'RTI Online', url: 'https://rtionline.gov.in' },
      { name: 'Lokpal of India', url: 'https://lokpal.gov.in' },
      { name: 'MyGov (Report Corruption)', url: 'https://www.mygov.in' }
    ]
  },
  {
    id: 'consumer-fraud',
    title: 'Consumer Fraud & Rights',
    icon: AlertTriangle,
    color: '#f59e0b',
    whoToContact: [
      'National Consumer Helpline: 1800-11-4000 (Toll Free)',
      'Consumer Disputes Redressal Commission (District/State/National)',
      'Department of Consumer Affairs',
      'Online Complaint: e-daakhil portal',
      'Consumer Forum / NGO',
      'Police (for criminal fraud)',
      'Bank (for financial fraud - report within 3 days)'
    ],
    requiredDocuments: [
      'Invoice / bill / receipt of purchase',
      'Warranty card / guarantee card',
      'Written complaint to seller/service provider',
      'Reply from seller (if any)',
      'Screenshots of online transactions',
      'Bank statements (for payment fraud)',
      'Product details, photos of defective product',
      'Communication records (emails, messages, call recordings)',
      'Identity proof (Aadhaar / PAN)'
    ],
    estimatedCost: {
      districtForum: '\u20B9100 - \u20B9200 (filing fee)',
      stateCommission: '\u20B9200 - \u20B91,000',
      nationalCommission: '\u20B92,000 - \u20B95,000',
      edaakhil: '\u20B90 (online filing - free for claims up to \u20B95 crore)',
      legalAid: 'Free (for eligible persons)'
    },
    timeline: 'Consumer forum: 3-6 months (District), 6-12 months (State/National) | Bank fraud: 30 days for chargeback | e-daakhil: faster processing',
    steps: [
      'First, write a formal complaint to the seller/service provider',
      'Give them 15-30 days to resolve the issue',
      'If no resolution, call National Consumer Helpline: 1800-11-4000',
      'File complaint online on e-daakhil portal (edaakhil.nic.in)',
      'For claims up to \u20B91 crore: file at District Consumer Forum',
      'For claims \u20B91-10 crore: State Consumer Commission',
      'For claims above \u20B910 crore: National Consumer Commission',
      'Submit all documents and evidence with your complaint',
      'Attend hearings as scheduled (can be done via video conference)',
      'For online fraud: report to cyber crime portal (cybercrime.gov.in)',
      'For bank fraud: call bank immediately and report within 3 days'
    ],
    websites: [
      { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in' },
      { name: 'e-Daakhil (Online Complaint)', url: 'https://edaakhil.nic.in' },
      { name: 'Department of Consumer Affairs', url: 'https://consumeraffairs.nic.in' },
      { name: 'Cyber Crime Portal', url: 'https://cybercrime.gov.in' },
      { name: 'Consumer VOICE', url: 'https://www.consumervoice.in' }
    ]
  },
  {
    id: 'domestic-violence',
    title: 'Domestic Violence & Women Safety',
    icon: Users,
    color: '#ec4899',
    whoToContact: [
      'Women Helpline: 181 (Toll Free, 24x7)',
      'Police Emergency: 100',
      'NCW (National Commission for Women)',
      'District Women Protection Officer',
      'One Stop Centre (Sakhi Centre) - for shelter, legal, medical',
      'Legal Aid Services Authority',
      'Local NGO / Women\'s shelter'
    ],
    requiredDocuments: [
      'Written complaint / FIR',
      'Medical records of injuries (from government hospital)',
      'Photographs of injuries',
      'Witness statements (neighbors, family members)',
      'Threatening messages, call recordings',
      'Marriage certificate (if married)',
      'Proof of shared household',
      'Income proof of husband (for maintenance)',
      'Children\'s birth certificates (if applicable)',
      'Property documents (if property dispute)'
    ],
    estimatedCost: {
      filingFIR: 'Free',
      protectionOrder: 'Free (court fees waived for women)',
      legalAid: 'Free (for eligible women)',
      shelterHome: 'Free (government Sakhi centres)',
      compensation: 'Court can order compensation'
    },
    timeline: 'FIR: Immediate | Protection Order: 30-60 days | Maintenance case: 3-6 months | Divorce: 6 months - 2 years',
    steps: [
      'If in immediate danger: call 100 or 181 Women Helpline',
      'Go to nearest Police Station and file FIR (police cannot refuse)',
      'If police refuse: send complaint to Superintendent of Police',
      'File application for Protection Order under DV Act at Magistrate court',
      'Visit nearest One Stop Centre (Sakhi Centre) for shelter and counseling',
      'Get medical examination done at government hospital',
      'Collect all evidence - photos, messages, call recordings',
      'Apply for maintenance under Section 125 CrPC',
      'File for divorce if needed (with grounds of cruelty)',
      'Contact local women\'s NGO for support and guidance',
      'Register complaint on Women Helpline app or NCRB portal'
    ],
    websites: [
      { name: 'Women Helpline (181)', url: 'https://wcd.nic.in' },
      { name: 'National Commission for Women', url: 'https://ncw.nic.in' },
      { name: 'NCRB (Crime Data)', url: 'https://ncrb.gov.in' },
      { name: 'One Stop Centre Scheme', url: 'https://wcd.nic.in/scheme-one-stop-centre' },
      { name: 'SHe-Box (Online Complaint)', url: 'https://shebox.nic.in' },
      { name: 'Legal Services Authority (Free Aid)', url: 'https://nalsa.nic.in' }
    ]
  },
  {
    id: 'cyber-crime',
    title: 'Cyber Crime & Online Fraud',
    icon: Wifi,
    color: '#6366f1',
    whoToContact: [
      'Cyber Crime Helpline: 1930 (Toll Free)',
      'Cyber Crime Portal: cybercrime.gov.in',
      'Local Police Station (Cyber Crime Cell)',
      'National Cyber Crime Reporting Portal',
      'Bank\'s fraud department (for financial fraud)',
      'CERT-In (Indian Computer Emergency Response Team)',
      'UIDAI (for Aadhaar-related fraud)'
    ],
    requiredDocuments: [
      'Screenshots of fraudulent transaction / message / website',
      'Bank statements showing unauthorized transactions',
      'Complaint reference number from bank',
      'OTP / transaction ID details',
      'Email / phone number used by fraudster',
      'Social media profile of fraudster (if online harassment)',
      'Identity proof (Aadhaar / PAN)',
      'Written complaint with timeline of events'
    ],
    estimatedCost: {
      filingComplaint: 'Free',
      bankFraudClaim: 'Free (report within 3 days for refund)',
      legalAid: 'Free',
      compensation: 'RBI mandates refund for unauthorized transactions reported within 3 days'
    },
    timeline: 'Bank fraud: 30 days for refund (if reported within 3 days) | Cyber crime FIR: Immediate | Investigation: 1-6 months | Online harassment: 24-48 hours for urgent cases',
    steps: [
      'If bank fraud: call bank immediately and block card/account',
      'Report to cyber crime portal: cybercrime.gov.in or call 1930',
      'File complaint on National Cyber Crime Reporting Portal',
      'For UPI fraud: report on NPCI portal and your bank immediately',
      'RBI rule: report within 3 days = zero liability, report after 3 days = limited liability',
      'Save all evidence: screenshots, transaction IDs, messages',
      'File FIR at local police station (cyber crime cell)',
      'For email/social media hacking: change all passwords immediately',
      'For identity theft: inform UIDAI (for Aadhaar), CIBIL (for credit)',
      'Report to CERT-In for large-scale data breaches',
      'Check credit report regularly after identity theft'
    ],
    websites: [
      { name: 'Cyber Crime Portal', url: 'https://cybercrime.gov.in' },
      { name: 'Cyber Crime Helpline (1930)', url: 'https://cybercrime.gov.in' },
      { name: 'CERT-In', url: 'https://www.cert-in.org.in' },
      { name: 'NPCI (UPI Fraud)', url: 'https://www.npci.org.in' },
      { name: 'RBI (Banking Fraud)', url: 'https://www.rbi.org.in' },
      { name: 'CIBIL (Credit Report)', url: 'https://www.cibil.com' }
    ]
  },
  {
    id: 'property-disputes',
    title: 'Property & Land Disputes',
    icon: LandPlot,
    color: '#14b8a6',
    whoToContact: [
      'Sub-Registrar Office (for property registration)',
      'District Collector / Tehsildar (for land records)',
      'Revenue Court (for revenue matters)',
      'Civil Court (for property disputes)',
      'Legal Services Authority (for free legal aid)',
      'Real Estate Regulatory Authority (RERA)',
      'Municipal Corporation (for building approval)'
    ],
    requiredDocuments: [
      'Sale deed / conveyance deed',
      'Title deed (previous owners\' chain)',
      'Encumbrance certificate',
      'Property tax receipts',
      'Land records (7/12 extract, khata, patta)',
      'Building plan approval',
      'Possession letter / completion certificate',
      'Agreement to sell / sale agreement',
      'Stamp duty and registration receipts',
      'Court orders (if dispute is in court)'
    ],
    estimatedCost: {
      registration: '5% - 7% of property value (stamp duty + registration)',
      encumbranceCert: '\u20B950 - \u20B9200',
      legalNotice: '\u20B95,000 - \u20B925,000',
      civilCourt: '\u20B95,000 - \u20B92,00,000+ (court fees + lawyer)',
      reraComplaint: '\u20B91,000 - \u20B95,000'
    },
    timeline: 'Title search: 1-3 months | Civil suit: 3-10 years | RERA complaint: 60-90 days | Mutation: 1-3 months | Property registration: same day',
    steps: [
      'Verify property title through Sub-Registrar office',
      'Get encumbrance certificate (last 30 years)',
      'Check land records at Tehsildar/Revenue office',
      'Verify all approvals (building plan, occupation certificate)',
      'If dispute: send legal notice to other party',
      'File civil suit if no resolution (District Court)',
      'For builder disputes: file complaint with State RERA',
      'For land grabbing: file FIR and approach collector',
      'Apply for mutation of property in your name',
      'Register property at Sub-Registrar office',
      'Get title insurance for future protection',
      'Use mediation/legal aid for faster resolution'
    ],
    websites: [
      { name: 'E-Mutation Portal', url: 'https://dilrmp.gov.in' },
      { name: 'State RERA Portals', url: 'https://www.rera.in' },
      { name: 'E-Stamping (SHCIL)', url: 'https://www.shcilestamp.com' },
      { name: 'Land Records Portal', url: 'https://dilrmp.gov.in' },
      { name: 'Sub-Registrar Lookup', url: 'https://www.indiafilings.com/learn/sub-registrar' },
      { name: 'Legal Services Authority', url: 'https://nalsa.nic.in' }
    ]
  },
  {
    id: 'police-complaints',
    title: 'Police Complaints & Filing FIR',
    icon: ShieldAlert,
    color: '#8b5cf6',
    whoToContact: [
      'Local Police Station (for filing FIR)',
      'Superintendent of Police (SP) - if police refuse FIR',
      'Deputy Inspector General (DIG)',
      'Director General of Police (DGP)',
      'National/State Human Rights Commission (for police misconduct)',
      'Magistrate / Court (for direction to police)',
      'Police Complaints Authority (PCA)'
    ],
    requiredDocuments: [
      'Written complaint with incident details',
      'Name, address, and contact of accused (if known)',
      'Date, time, place of incident',
      'Witness details (if any)',
      'Evidence (photos, videos, documents)',
      'Medical report (if assault/injury)',
      'Identity proof of complainant (Aadhaar)',
      'Any previous complaints (if related)'
    ],
    estimatedCost: {
      filingFIR: 'Free',
      zeroFir: 'Free (can file at any police station)',
      legalAid: 'Free (for eligible persons)',
      privateLawyer: '\u20B95,000 - \u20B950,000+'
    },
    timeline: 'FIR registration: Immediate (by law) | Zero FIR: Immediate | Investigation: 60-90 days | Charge sheet: 90 days | Trial: 6 months - several years',
    steps: [
      'Go to nearest police station and give written complaint',
      'Police MUST register FIR for cognizable offences (IPC sections)',
      'If police refuse FIR: send complaint to SP via registered post',
      'You can file Zero FIR at any police station (will be transferred)',
      'Get FIR copy with FIR number (free of cost)',
      'For e-FIR: file online at your state police portal',
      'Track FIR status online or at police station',
      'If police not investigating: file complaint with Magistrate under Section 156(3)',
      'For police misconduct: file complaint with Police Complaints Authority',
      'For human rights violations: approach NHRC/SHRC',
      'Keep all documents and reference numbers safe'
    ],
    websites: [
      { name: 'e-FIR Portal (varies by state)', url: 'https://efir.npoliceonline.com' },
      { name: 'NCRB (Crime Statistics)', url: 'https://ncrb.gov.in' },
      { name: 'National Human Rights Commission', url: 'https://nhrc.nic.in' },
      { name: 'Police Complaints Authority', url: 'https://www.pca.gov.in' },
      { name: 'Legal Services Authority', url: 'https://nalsa.nic.in' }
    ]
  },
  {
    id: 'child-rights',
    title: 'Child Rights & Child Labour',
    icon: Baby,
    color: '#f97316',
    whoToContact: [
      'Childline India Helpline: 1098 (24x7, Toll Free)',
      'National Commission for Protection of Child Rights (NCPCR)',
      'State Commission for Protection of Child Rights',
      'District Child Protection Unit (DCPU)',
      'CWC (Child Welfare Committee)',
      'Juvenile Justice Board',
      'Labour Department (for child labour cases)',
      'Police (for abuse/exploitation cases)'
    ],
    requiredDocuments: [
      'Written complaint with child details',
      'Child\'s age proof (birth certificate, school records)',
      'Details of child\'s situation (workplace, home, etc.)',
      'Evidence of abuse/neglect (if any)',
      'Medical report (if child is injured/ill)',
      'Photographs (if safe to take)',
      'Identity proof of complainant',
      'Address of workplace/home where child is'
    ],
    estimatedCost: {
      filingComplaint: 'Free',
      childline: 'Free (1098)',
      legalAid: 'Free (for all children)',
      shelterHome: 'Free (government homes)',
      education: 'Free (under RTE Act for ages 6-14)'
    },
    timeline: 'Childline response: Immediate | CWC hearing: 7 days | Police rescue: Immediate | JJ Board trial: 3-6 months | Child labour case: 1-3 months',
    steps: [
      'If child is in immediate danger: call 1098 (Childline) or 100',
      'Report to District Child Protection Unit (DCPU)',
      'File complaint with Child Welfare Committee (CWC)',
      'For child labour: inform Labour Inspector or call 1098',
      'Police can rescue child under Section 361 IPC',
      'CWC will conduct inquiry within 7 days',
      'Child will be produced before JJ Board within 24 hours',
      'Apply for child\'s education under RTE Act',
      'For abuse: file FIR under POCSO Act',
      'Contact NGO working with children for support',
      'Report online on NCPCR portal (ncpcr.gov.in)'
    ],
    websites: [
      { name: 'Childline India (1098)', url: 'https://www.childlineindia.org' },
      { name: 'NCPCR', url: 'https://ncpcr.gov.in' },
      { name: 'POCSO e-Box', url: 'https://www.poscomebox.nic.in' },
      { name: 'National Commission for Protection of Child Rights', url: 'https://ncpcr.gov.in' },
      { name: 'Bachpan Bachao Andolan', url: 'https://www.bba.org.in' }
    ]
  },
  {
    id: 'senior-citizen-rights',
    title: 'Senior Citizen Rights',
    icon: PhoneIcon,
    color: '#0891b2',
    whoToContact: [
      'Elder Line Helpline: 14567 (Toll Free)',
      'National Council for Older Persons (NCOP)',
      'District Social Welfare Officer',
      'Maintenance Tribunal (under Maintenance and Welfare of Parents Act)',
      'Police (for elder abuse)',
      'Legal Services Authority (for free legal aid)',
      'Old Age Pension Office (state level)'
    ],
    requiredDocuments: [
      'Age proof (Aadhaar, PAN, birth certificate)',
      'Identity proof (Aadhaar, Passport)',
      'Address proof',
      'Income certificate (for pension/benefits)',
      'Bank account details (for pension)',
      'Property documents (if property dispute with children)',
      'Medical records (if medical neglect)',
      'Proof of neglect/abuse (if applicable)'
    ],
    estimatedCost: {
      maintenanceApplication: '\u20B90 - \u20B9100 (court fees)',
      legalAid: 'Free (for senior citizens)',
      pension: 'Free (government pension applies)',
      elderLine: 'Free (14567 toll free)',
      shelterHome: 'Free (government old age homes)'
    },
    timeline: 'Maintenance Tribunal: 30-90 days | Pension: 1-3 months | Police complaint: Immediate | Legal proceedings: 3-12 months',
    steps: [
      'For immediate help: call Elder Line 14567',
      'For maintenance: file application under Maintenance and Welfare of Parents Act',
      'Maintenance Tribunal can order children/relatives to pay \u20B910,000/month',
      'For abuse: file FIR at police station',
      'Apply for Old Age Pension at District Social Welfare Office',
      'Register for Senior Citizen Identity Card',
      'For property disputes: approach civil court',
      'Contact local NGO for elder care support',
      'Register on Elder Line for regular check-ins',
      'For medical neglect: complain to hospital management',
      'Know your rights: children MUST maintain parents under law'
    ],
    websites: [
      { name: 'Elder Line (14567)', url: 'https://elderline.in' },
      { name: 'National Council for Older Persons', url: 'https://ncop.nic.in' },
      { name: 'Maintenance and Welfare of Parents Act', url: 'https://legislative.gov.in' },
      { name: 'Legal Services Authority', url: 'https://nalsa.nic.in' },
      { name: 'National Portal for Senior Citizens', url: 'https://www.seniorcitizens.in' }
    ]
  },
  {
    id: 'labour-rights',
    title: 'Labour Rights & Worker Issues',
    icon: Briefcase,
    color: '#7c3aed',
    whoToContact: [
      'Labour Commissioner Office (state level)',
      'Chief Labour Commissioner (central level)',
      'Industrial Tribunal',
      'Labour Court',
      'EPFO (for PF-related issues)',
      'ESI Corporation (for medical benefits)',
      'Local Police (for exploitation/abuse)',
      'Trade Union (for collective bargaining)'
    ],
    requiredDocuments: [
      'Appointment letter / offer letter',
      'Employment contract',
      'Salary slips (last 6-12 months)',
      'Bank statements (salary credit proof)',
      'PF/ESI contribution statements',
      'Leave records',
      'Workplace correspondence (emails, messages)',
      'Medical certificate (if workplace injury)',
      'Witness statements (colleagues)',
      'Company policies (if available)'
    ],
    estimatedCost: {
      labourCourt: 'Free',
      epfoComplaint: 'Free',
      legalAid: 'Free (for workers)',
      filingComplaint: 'Free',
      privateLawyer: '\u20B95,000 - \u20B925,000'
    },
    timeline: 'PF withdrawal: 15-30 days | Labour complaint: 1-3 months | Industrial dispute: 3-12 months | Court case: 6 months - 2 years',
    steps: [
      'First, raise grievance with employer in writing',
      'If no resolution, file complaint with Labour Commissioner',
      'For PF issues: raise grievance on EPFiGMS portal',
      'For ESI issues: contact nearest ESI hospital/office',
      'File complaint for non-payment of wages at Labour Court',
      'For workplace harassment: file under POSH Act',
      'For wrongful termination: approach Industrial Tribunal',
      'Contact trade union for support',
      'File case under Labour Laws (minimum wages, overtime, etc.)',
      'For construction workers: register with BOCW Board',
      'Know your rights: EPF, ESI, Gratuity, Bonus are mandatory'
    ],
    websites: [
      { name: 'EPFO Portal', url: 'https://www.epfindia.gov.in' },
      { name: 'ESI Corporation', url: 'https://www.esic.gov.in' },
      { name: 'Chief Labour Commissioner', url: 'https://clc.nic.in' },
      { name: 'Labour Court India', url: 'https://labour.gov.in' },
      { name: 'EPFiGMS (Grievance)', url: 'https://epfigms.gov.in' },
      { name: 'Skill India Portal', url: 'https://www.skillindia.gov.in' }
    ]
  }
];

function HelpModal({ category, onClose }) {
  if (!category) return null;
  const Icon = category.icon;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="help-modal-overlay" onClick={handleOverlayClick}>
      <div className="help-modal">
        <div className="help-modal-header" style={{ borderColor: `${category.color}40` }}>
          <div className="modal-header-left">
            <div className="category-icon" style={{ background: `${category.color}20`, color: category.color }}>
              <Icon size={22} />
            </div>
            <h2>{category.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="help-modal-body">
          <div className="help-section">
            <h3><Phone size={16} /> Who to Contact</h3>
            <ul className="help-list">
              {category.whoToContact.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="help-section">
            <h3><CheckCircle2 size={16} /> Required Documents</h3>
            <ul className="help-list">
              {category.requiredDocuments.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="help-section">
            <h3><DollarSign size={16} /> Estimated Cost</h3>
            <div className="cost-grid">
              {Object.entries(category.estimatedCost).map(([key, value]) => (
                <div key={key} className="cost-item">
                  <span className="cost-label">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="cost-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="help-section">
            <h3><Clock size={16} /> Expected Timeline</h3>
            <p className="timeline-text">{category.timeline}</p>
          </div>

          <div className="help-section">
            <h3><CheckCircle2 size={16} /> Step-by-Step Process</h3>
            <ol className="help-steps">
              {category.steps.map((step, i) => (
                <li key={i}>
                  <span className="step-number">{i + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="help-section">
            <h3><ExternalLink size={16} /> Useful Websites</h3>
            <div className="website-links">
              {category.websites.map((site, i) => (
                <a
                  key={i}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  <ExternalLink size={14} />
                  <span>{site.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    cat.whoToContact.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="help-page">
      <div className="help-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Back to Home
        </button>
        <div className="help-hero">
          <h1>I Need Help</h1>
          <p>Your comprehensive guide to navigating essential services in India. Find step-by-step instructions, required documents, costs, and timelines for common tasks.</p>
        </div>

        <div className="help-controls">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="help-search"
          />
        </div>
      </div>

      <div className="help-categories">
        {filteredCategories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className="help-card"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="help-card-icon" style={{ background: `${category.color}20`, color: category.color }}>
                <Icon size={28} />
              </div>
              <h3 className="help-card-title">{category.title}</h3>
              <p className="help-card-desc">{category.steps.length} steps &middot; {category.websites.length} resources</p>
            </button>
          );
        })}
        {filteredCategories.length === 0 && (
          <div className="no-results">
            <p>No results found for &quot;{searchQuery}&quot;</p>
            <button className="action-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
        )}
      </div>

      {selectedCategory && (
        <HelpModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      <div className="help-disclaimer">
        <p><strong>Disclaimer:</strong> Information provided is for general guidance only and may vary by state. Always verify current requirements with the official government portal or authority. Costs and timelines are estimates and subject to change.</p>
      </div>
    </div>
  );
}
