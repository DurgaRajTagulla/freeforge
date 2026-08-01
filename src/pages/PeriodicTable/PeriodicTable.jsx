import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Atom, ArrowLeft } from 'lucide-react';
import './PeriodicTable.css';

const ELEMENTS = [
  [1,'H','Hydrogen',1.008,'Non-metal','1s¹',13.6,-252.9,'Gas',0.0899,1772],
  [2,'He','Helium',4.003,'Noble Gas','1s²',24.6,-269,'Gas',0.1785,0],
  [3,'Li','Lithium',6.94,'Alkali Metal','[He]2s¹',5.39,1342,'Solid',0.534,181],
  [4,'Be','Beryllium',9.012,'Alkaline Earth','[He]2s²',9.32,2470,'Solid',1.85,128],
  [5,'B','Boron',10.81,'Metalloid','[He]2s²2p¹',8.3,4000,'Solid',2.34,84],
  [6,'C','Carbon',12.011,'Non-metal','[He]2s²2p²',11.26,4827,'Solid',2.267,77],
  [7,'N','Nitrogen',14.007,'Non-metal','[He]2s²2p³',14.53,-196,'Gas',1.251,75],
  [8,'O','Oxygen',15.999,'Non-metal','[He]2s²2p⁴',13.62,-183,'Gas',1.429,73],
  [9,'F','Fluorine',18.998,'Halogen','[He]2s²2p⁵',17.42,-188,'Gas',1.696,71],
  [10,'Ne','Neon',20.180,'Noble Gas','[He]2s²2p⁶',21.56,-246,'Gas',0.9002,38],
  [11,'Na','Sodium',22.990,'Alkali Metal','[Ne]3s¹',5.14,883,'Solid',0.968,190],
  [12,'Mg','Magnesium',24.305,'Alkaline Earth','[Ne]3s²',7.65,1090,'Solid',1.738,145],
  [13,'Al','Aluminium',26.982,'Other Metal','[Ne]3s²3p¹',5.99,2519,'Solid',2.698,118],
  [14,'Si','Silicon',28.085,'Metalloid','[Ne]3s²3p²',8.15,3265,'Solid',2.33,111],
  [15,'P','Phosphorus',30.974,'Non-metal','[Ne]3s²3p³',10.49,280,'Solid',1.823,98],
  [16,'S','Sulfur',32.06,'Non-metal','[Ne]3s²3p⁴',10.36,445,'Solid',2.067,88],
  [17,'Cl','Chlorine',35.45,'Halogen','[Ne]3s²3p⁵',12.97,-34,'Gas',3.214,79],
  [18,'Ar','Argon',39.948,'Noble Gas','[Ne]3s²3p⁶',15.76,-186,'Gas',1.784,71],
  [19,'K','Potassium',39.098,'Alkali Metal','[Ar]4s¹',4.34,759,'Solid',0.856,243],
  [20,'Ca','Calcium',40.078,'Alkaline Earth','[Ar]4s²',6.11,1484,'Solid',1.55,194],
  [21,'Sc','Scandium',44.956,'Transition Metal','[Ar]3d¹4s²',6.56,2836,'Solid',2.985,184],
  [22,'Ti','Titanium',47.867,'Transition Metal','[Ar]3d²4s²',6.83,3287,'Solid',4.506,176],
  [23,'V','Vanadium',50.942,'Transition Metal','[Ar]3d³4s²',6.75,3407,'Solid',6.11,171],
  [24,'Cr','Chromium',51.996,'Transition Metal','[Ar]3d⁵4s¹',6.77,2671,'Solid',7.15,166],
  [25,'Mn','Manganese',54.938,'Transition Metal','[Ar]3d⁵4s²',7.43,2061,'Solid',7.47,161],
  [26,'Fe','Iron',55.845,'Transition Metal','[Ar]3d⁶4s²',7.9,2861,'Solid',7.874,156],
  [27,'Co','Cobalt',58.933,'Transition Metal','[Ar]3d⁷4s²',7.88,2927,'Solid',8.9,152],
  [28,'Ni','Nickel',58.693,'Transition Metal','[Ar]3d⁸4s²',7.64,2913,'Solid',8.908,149],
  [29,'Cu','Copper',63.546,'Transition Metal','[Ar]3d¹⁰4s¹',7.73,2927,'Solid',8.96,145],
  [30,'Zn','Zinc',65.38,'Transition Metal','[Ar]3d¹⁰4s²',9.39,907,'Solid',7.14,142],
  [31,'Ga','Gallium',69.723,'Other Metal','[Ar]3d¹⁰4s²4p¹',6.0,2400,'Solid',5.904,136],
  [32,'Ge','Germanium',72.630,'Metalloid','[Ar]3d¹⁰4s²4p²',7.9,2833,'Solid',5.323,125],
  [33,'As','Arsenic',74.922,'Metalloid','[Ar]3d¹⁰4s²4p³',9.79,614,'Solid',5.727,114],
  [34,'Se','Selenium',78.971,'Non-metal','[Ar]3d¹⁰4s²4p⁴',9.75,685,'Solid',4.809,103],
  [35,'Br','Bromine',79.904,'Halogen','[Ar]3d¹⁰4s²4p⁵',11.81,59,'Liquid',3.102,94],
  [36,'Kr','Krypton',83.798,'Noble Gas','[Ar]3d¹⁰4s²4p⁶',14.0,-153,'Gas',3.749,84],
  [37,'Rb','Rubidium',85.468,'Alkali Metal','[Kr]5s¹',4.18,688,'Solid',1.532,265],
  [38,'Sr','Strontium',87.62,'Alkaline Earth','[Kr]5s²',5.69,1382,'Solid',2.64,219],
  [39,'Y','Yttrium',88.906,'Transition Metal','[Kr]4d¹5s²',6.22,3345,'Solid',4.472,212],
  [40,'Zr','Zirconium',91.224,'Transition Metal','[Kr]4d²5s²',6.63,4409,'Solid',6.52,206],
  [41,'Nb','Niobium',92.906,'Transition Metal','[Kr]4d⁴5s¹',6.76,4744,'Solid',8.57,198],
  [42,'Mo','Molybdenum',95.95,'Transition Metal','[Kr]4d⁵5s¹',7.09,4912,'Solid',10.22,190],
  [43,'Tc','Technetium',98,'Transition Metal','[Kr]4d⁵5s²',7.28,4265,'Solid',11.5,183],
  [44,'Ru','Ruthenium',101.07,'Transition Metal','[Kr]4d⁷5s¹',7.37,4150,'Solid',12.41,178],
  [45,'Rh','Rhodium',102.91,'Transition Metal','[Kr]4d⁸5s¹',7.46,3727,'Solid',12.41,173],
  [46,'Pd','Palladium',106.42,'Transition Metal','[Kr]4d¹⁰',8.34,2963,'Solid',12.02,169],
  [47,'Ag','Silver',107.87,'Transition Metal','[Kr]4d¹⁰5s¹',7.58,2162,'Solid',10.501,165],
  [48,'Cd','Cadmium',112.41,'Transition Metal','[Kr]4d¹⁰5s²',8.99,767,'Solid',8.65,161],
  [49,'In','Indium',114.82,'Other Metal','[Kr]4d¹⁰5s²5p¹',5.79,2072,'Solid',7.31,156],
  [50,'Sn','Tin',118.71,'Other Metal','[Kr]4d¹⁰5s²5p²',7.34,2602,'Solid',7.287,145],
  [51,'Sb','Antimony',121.76,'Metalloid','[Kr]4d¹⁰5s²5p³',8.64,1587,'Solid',6.697,133],
  [52,'Te','Tellurium',127.60,'Metalloid','[Kr]4d¹⁰5s²5p⁴',9.01,988,'Solid',6.24,123],
  [53,'I','Iodine',126.90,'Halogen','[Kr]4d¹⁰5s²5p⁵',10.45,184,'Solid',4.93,115],
  [54,'Xe','Xenon',131.29,'Noble Gas','[Kr]4d¹⁰5s²5p⁶',12.13,-108,'Gas',5.894,102],
  [55,'Cs','Caesium',132.91,'Alkali Metal','[Xe]6s¹',3.89,671,'Solid',1.879,298],
  [56,'Ba','Barium',137.33,'Alkaline Earth','[Xe]6s²',5.21,1870,'Solid',3.594,253],
  [57,'La','Lanthanum',138.91,'Lanthanide','[Xe]5d¹6s²',5.58,3464,'Solid',6.146,207],
  [58,'Ce','Cerium',140.12,'Lanthanide','[Xe]4f¹5d¹6s²',5.54,3443,'Solid',6.77,205],
  [59,'Pr','Praseodymium',140.91,'Lanthanide','[Xe]4f³6s²',5.47,3520,'Solid',6.77,202],
  [60,'Nd','Neodymium',144.24,'Lanthanide','[Xe]4f⁴6s²',5.53,3074,'Solid',7.01,201],
  [61,'Pm','Promethium',145,'Lanthanide','[Xe]4f⁵6s²',5.58,3000,'Solid',7.26,199],
  [62,'Sm','Samarium',150.36,'Lanthanide','[Xe]4f⁶6s²',5.64,1794,'Solid',7.52,198],
  [63,'Eu','Europium',151.96,'Lanthanide','[Xe]4f⁷6s²',5.67,1529,'Solid',5.244,198],
  [64,'Gd','Gadolinium',157.25,'Lanthanide','[Xe]4f⁷5d¹6s²',6.15,3273,'Solid',7.9,196],
  [65,'Tb','Terbium',158.93,'Lanthanide','[Xe]4f⁹6s²',5.86,3230,'Solid',8.23,194],
  [66,'Dy','Dysprosium',162.50,'Lanthanide','[Xe]4f¹⁰6s²',5.94,2567,'Solid',8.55,192],
  [67,'Ho','Holmium',164.93,'Lanthanide','[Xe]4f¹¹6s²',6.02,2700,'Solid',8.8,192],
  [68,'Er','Erbium',167.26,'Lanthanide','[Xe]4f¹²6s²',6.1,2868,'Solid',9.07,189],
  [69,'Tm','Thulium',168.93,'Lanthanide','[Xe]4f¹³6s²',6.18,1950,'Solid',9.32,190],
  [70,'Yb','Ytterbium',173.05,'Lanthanide','[Xe]4f¹⁴6s²',6.25,1196,'Solid',6.9,187],
  [71,'Lu','Lutetium',174.97,'Lanthanide','[Xe]4f¹⁴5d¹6s²',5.43,3402,'Solid',9.84,187],
  [72,'Hf','Hafnium',178.49,'Transition Metal','[Xe]4f¹⁴5d²6s²',6.83,4603,'Solid',13.31,187],
  [73,'Ta','Tantalum',180.95,'Transition Metal','[Xe]4f¹⁴5d³6s²',7.55,5458,'Solid',16.69,186],
  [74,'W','Tungsten',183.84,'Transition Metal','[Xe]4f¹⁴5d⁴6s²',7.86,5930,'Solid',19.25,187],
  [75,'Re','Rhenium',186.21,'Transition Metal','[Xe]4f¹⁴5d⁵6s²',7.83,5596,'Solid',21.02,188],
  [76,'Os','Osmium',190.23,'Transition Metal','[Xe]4f¹⁴5d⁶6s²',8.44,5027,'Solid',22.59,185],
  [77,'Ir','Iridium',192.22,'Transition Metal','[Xe]4f¹⁴5d⁷6s²',8.97,4428,'Solid',22.56,180],
  [78,'Pt','Platinum',195.08,'Transition Metal','[Xe]4f¹⁴5d⁹6s¹',8.96,3825,'Solid',21.45,177],
  [79,'Au','Gold',196.97,'Transition Metal','[Xe]4f¹⁴5d¹⁰6s¹',9.23,2970,'Solid',19.282,174],
  [80,'Hg','Mercury',200.59,'Transition Metal','[Xe]4f¹⁴5d¹⁰6s²',10.44,357,'Liquid',13.534,171],
  [81,'Tl','Thallium',204.38,'Other Metal','[Xe]4f¹⁴5d¹⁰6s²6p¹',6.11,1473,'Solid',11.85,156],
  [82,'Pb','Lead',207.2,'Other Metal','[Xe]4f¹⁴5d¹⁰6s²6p²',7.42,1749,'Solid',11.342,146],
  [83,'Bi','Bismuth',208.98,'Other Metal','[Xe]4f¹⁴5d¹⁰6s²6p³',7.29,1564,'Solid',9.78,143],
  [84,'Po','Polonium',209,'Metalloid','[Xe]4f¹⁴5d¹⁰6s²6p⁴',8.42,962,'Solid',9.196,135],
  [85,'At','Astatine',210,'Halogen','[Xe]4f¹⁴5d¹⁰6s²6p⁵',9.3,337,'Solid',7,127],
  [86,'Rn','Radon',222,'Noble Gas','[Xe]4f¹⁴5d¹⁰6s²6p⁶',10.75,-62,'Gas',9.73,120],
  [87,'Fr','Francium',223,'Alkali Metal','[Rn]7s¹',4.07,677,'Solid',1.87,348],
  [88,'Ra','Radium',226,'Alkaline Earth','[Rn]7s²',5.28,1737,'Solid',5.5,283],
  [89,'Ac','Actinium',227,'Actinide','[Rn]6d¹7s²',5.17,3198,'Solid',10.07,215],
  [90,'Th','Thorium',232.04,'Actinide','[Rn]6d²7s²',6.08,5061,'Solid',11.72,206],
  [91,'Pa','Protactinium',231.04,'Actinide','[Rn]5f²6d¹7s²',5.89,4300,'Solid',15.37,200],
  [92,'U','Uranium',238.03,'Actinide','[Rn]5f³6d¹7s²',6.19,4131,'Solid',18.95,175],
  [93,'Np','Neptunium',237,'Actinide','[Rn]5f⁴6d¹7s²',6.27,4000,'Solid',20.45,175],
  [94,'Pu','Plutonium',244,'Actinide','[Rn]5f⁶7s²',6.06,3228,'Solid',19.84,169],
  [95,'Am','Americium',243,'Actinide','[Rn]5f⁷7s²',5.99,2607,'Solid',13.69,166],
  [96,'Cm','Curium',247,'Actinide','[Rn]5f⁷6d¹7s²',6.02,3110,'Solid',13.51,166],
  [97,'Bk','Berkelium',247,'Actinide','[Rn]5f⁹7s²',6.23,2900,'Solid',14.78,165],
  [98,'Cf','Californium',251,'Actinide','[Rn]5f¹⁰7s²',6.3,1470,'Solid',15.1,163],
  [99,'Es','Einsteinium',252,'Actinide','[Rn]5f¹¹7s²',6.42,997,'Solid',13.5,161],
  [100,'Fm','Fermium',257,'Actinide','[Rn]5f¹²7s²',6.5,1527,'Solid',0,159],
  [101,'Md','Mendelevium',258,'Actinide','[Rn]5f¹³7s²',6.58,1412,'Solid',0,158],
  [102,'No','Nobelium',259,'Actinide','[Rn]5f¹⁴7s²',6.65,883,'Solid',0,157],
  [103,'Lr','Lawrencium',262,'Actinide','[Rn]5f¹⁴7s²7p¹',4.9,1430,'Solid',0,156],
  [104,'Rf','Rutherfordium',267,'Transition Metal','[Rn]5f¹⁴6d²7s²',6.01,5800,'Solid',23.2,155],
  [105,'Db','Dubnium',268,'Transition Metal','[Rn]5f¹⁴6d³7s²',6.0,0,'Solid',29.3,154],
  [106,'Sg','Seaborgium',269,'Transition Metal','[Rn]5f¹⁴6d⁴7s²',7.0,0,'Solid',35.0,152],
  [107,'Bh','Bohrium',270,'Transition Metal','[Rn]5f¹⁴6d⁵7s²',7.0,0,'Solid',37.0,151],
  [108,'Hs','Hassium',269,'Transition Metal','[Rn]5f¹⁴6d⁶7s²',7.0,0,'Solid',40.0,150],
  [109,'Mt','Meitnerium',278,'Transition Metal','[Rn]5f¹⁴6d⁷7s²',7.0,0,'Solid',37.4,149],
  [110,'Ds','Darmstadtium',281,'Transition Metal','[Rn]5f¹⁴6d⁸7s²',0,0,'Solid',34.8,148],
  [111,'Rg','Roentgenium',282,'Transition Metal','[Rn]5f¹⁴6d¹⁰7s¹',0,0,'Solid',28.7,147],
  [112,'Cn','Copernicium',285,'Transition Metal','[Rn]5f¹⁴6d¹⁰7s²',0,0,'Gas',23.7,146],
  [113,'Nh','Nihonium',286,'Other Metal','[Rn]5f¹⁴6d¹⁰7s²7p¹',0,0,'Solid',16,145],
  [114,'Fl','Flerovium',289,'Other Metal','[Rn]5f¹⁴6d¹⁰7s²7p²',0,0,'Solid',14,144],
  [115,'Mc','Moscovium',290,'Other Metal','[Rn]5f¹⁴6d¹⁰7s²7p³',0,0,'Solid',13.5,143],
  [116,'Lv','Livermorium',293,'Other Metal','[Rn]5f¹⁴6d¹⁰7s²7p⁴',0,0,'Solid',12.9,142],
  [117,'Ts','Tennessine',294,'Halogen','[Rn]5f¹⁴6d¹⁰7s²7p⁵',0,0,'Solid',7.2,141],
  [118,'Og','Oganesson',294,'Noble Gas','[Rn]5f¹⁴6d¹⁰7s²7p⁶',0,0,'Gas',5.0,140],
];

const GRID_COLS = 18;
const CAT_COLORS = {
  'Non-metal': { bg: '#22c55e20', border: '#22c55e', text: '#22c55e' },
  'Noble Gas': { bg: '#a78bfa20', border: '#a78bfa', text: '#a78bfa' },
  'Alkali Metal': { bg: '#f9731620', border: '#f97316', text: '#f97316' },
  'Alkaline Earth': { bg: '#fbbf2420', border: '#fbbf24', text: '#fbbf24' },
  'Metalloid': { bg: '#14b8a620', border: '#14b8a6', text: '#14b8a6' },
  'Halogen': { bg: '#06b6d420', border: '#06b6d4', text: '#06b6d4' },
  'Other Metal': { bg: '#8b5cf620', border: '#8b5cf6', text: '#8b5cf6' },
  'Transition Metal': { bg: '#3b82f620', border: '#3b82f6', text: '#60a5fa' },
  'Lanthanide': { bg: '#ec489920', border: '#ec4899', text: '#ec4899' },
  'Actinide': { bg: '#ef444420', border: '#ef4444', text: '#ef4444' },
};

const CAT_ORDER = ['Non-metal','Noble Gas','Alkali Metal','Alkaline Earth','Metalloid','Halogen','Other Metal','Transition Metal','Lanthanide','Actinide'];

function PeriodicTable() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return ELEMENTS;
    const q = search.toLowerCase();
    return ELEMENTS.filter(e => e[2].toLowerCase().includes(q) || e[1].toLowerCase().includes(q));
  }, [search]);

  const gridPos = (z) => {
    const positions = {
      1:[1,1],2:[18,1],3:[1,2],4:[2,2],5:[13,2],6:[14,2],7:[15,2],8:[16,2],9:[17,2],10:[18,2],
      11:[1,3],12:[2,3],13:[13,3],14:[14,3],15:[15,3],16:[16,3],17:[17,3],18:[18,3],
      19:[1,4],20:[2,4],21:[3,4],22:[4,4],23:[5,4],24:[6,4],25:[7,4],26:[8,4],27:[9,4],28:[10,4],29:[11,4],30:[12,4],31:[13,4],32:[14,4],33:[15,4],34:[16,4],35:[17,4],36:[18,4],
      37:[1,5],38:[2,5],39:[3,5],40:[4,5],41:[5,5],42:[6,5],43:[7,5],44:[8,5],45:[9,5],46:[10,5],47:[11,5],48:[12,5],49:[13,5],50:[14,5],51:[15,5],52:[16,5],53:[17,5],54:[18,5],
      55:[1,6],56:[2,6],57:[3,6],58:[4,6],59:[5,6],60:[6,6],61:[7,6],62:[8,6],63:[9,6],64:[10,6],65:[11,6],66:[12,6],67:[13,6],68:[14,6],69:[15,6],70:[16,6],71:[17,6],72:[4,7],73:[5,7],74:[6,7],75:[7,7],76:[8,7],77:[9,7],78:[10,7],79:[11,7],80:[12,7],81:[13,7],82:[14,7],83:[15,7],84:[16,7],85:[17,7],86:[18,7],
      87:[1,8],88:[2,8],89:[3,8],90:[4,8],91:[5,8],92:[6,8],93:[7,8],94:[8,8],95:[9,8],96:[10,8],97:[11,8],98:[12,8],99:[13,8],100:[14,8],101:[15,8],102:[16,8],103:[17,8],104:[4,9],105:[5,9],106:[6,9],107:[7,9],108:[8,9],109:[9,9],110:[10,9],111:[11,9],112:[12,9],113:[13,9],114:[14,9],115:[15,9],116:[16,9],117:[17,9],118:[18,9],
    };
    return positions[z] || [0,0];
  };

  return (
    <div className="pt-page">
      <div className="pt-header">
        <button className="pt-back" onClick={() => navigate('/students-hub')}><ArrowLeft size={20} /></button>
        <div className="pt-header-content">
          <Atom size={40} className="pt-header-icon" />
          <h1 className="pt-header-title">Periodic Table</h1>
          <p className="pt-header-subtitle">Interactive periodic table of 118 elements — click for details. Ideal for NEET, JEE & board exams.</p>
        </div>
      </div>

      <div className="pt-search-section">
        <div className="pt-search-wrap">
          <Search size={18} className="pt-search-icon" />
          <input type="text" className="pt-search" placeholder="Search element by name or symbol..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="pt-legend">
          {CAT_ORDER.map(cat => {
            const c = CAT_COLORS[cat];
            return (
              <div key={cat} className="pt-legend-item">
                <span className="pt-legend-swatch" style={{ background: c.border }} />
                <span className="pt-legend-label">{cat === 'Transition Metal' ? 'Transition' : cat}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-content">
        <div className="pt-table-wrap">
          <div className="pt-grid" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
            {filtered.map(el => {
              const [z,sym,name,am,cat,conf,ie,bp,state,den,rad] = el;
              const [col, row] = gridPos(z);
              const colors = CAT_COLORS[cat] || { bg: '#1e293b', border: '#334155', text: '#94a3b8' };
              const isSel = selected && selected[0] === z;
              return (
                <button key={z} className={`pt-element ${isSel ? 'selected' : ''}`}
                  style={{
                    gridColumn: col, gridRow: row,
                    background: isSel ? colors.border : colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                  onClick={() => setSelected(isSel ? null : el)}
                  title={name}
                >
                  <span className="pt-el-num">{z}</span>
                  <span className="pt-el-sym">{sym}</span>
                  <span className="pt-el-name">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-lanthanide-row">
          <span className="pt-row-label">Lanthanides</span>
          <div className="pt-row-grid">
            {ELEMENTS.filter(e => e[4] === 'Lanthanide').map(el => {
              const [z,sym,name] = el; const colors = CAT_COLORS['Lanthanide'];
              const isSel = selected && selected[0] === z;
              return (
                <button key={z} className={`pt-element mini ${isSel ? 'selected' : ''}`}
                  style={{ background: isSel ? colors.border : colors.bg, borderColor: colors.border, color: colors.text }}
                  onClick={() => setSelected(isSel ? null : el)}
                  title={name}
                >
                  <span className="pt-el-num">{z}</span>
                  <span className="pt-el-sym">{sym}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-lanthanide-row">
          <span className="pt-row-label">Actinides</span>
          <div className="pt-row-grid">
            {ELEMENTS.filter(e => e[4] === 'Actinide').map(el => {
              const [z,sym,name] = el; const colors = CAT_COLORS['Actinide'];
              const isSel = selected && selected[0] === z;
              return (
                <button key={z} className={`pt-element mini ${isSel ? 'selected' : ''}`}
                  style={{ background: isSel ? colors.border : colors.bg, borderColor: colors.border, color: colors.text }}
                  onClick={() => setSelected(isSel ? null : el)}
                  title={name}
                >
                  <span className="pt-el-num">{z}</span>
                  <span className="pt-el-sym">{sym}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selected && (() => {
          const [z,sym,name,am,cat,conf,ie,bp,state,den,rad] = selected;
          const colors = CAT_COLORS[cat] || { text: '#94a3b8' };
          return (
            <div className="pt-detail" onClick={() => setSelected(null)}>
              <div className="pt-detail-card" onClick={e => e.stopPropagation()}>
                <button className="pt-detail-close" onClick={() => setSelected(null)}><X size={20} /></button>
                <div className="pt-detail-header" style={{ borderColor: colors.border }}>
                  <div className="pt-detail-symbol" style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}>
                    <span className="pt-detail-sym-text">{sym}</span>
                    <span className="pt-detail-num-text">{z}</span>
                  </div>
                  <div>
                    <h2 className="pt-detail-name">{name}</h2>
                    <p className="pt-detail-cat" style={{ color: colors.text }}>{cat}</p>
                  </div>
                </div>
                <div className="pt-detail-grid">
                  {[
                    ['Atomic Mass', am + ' u'],
                    ['Electron Config', conf],
                    ['Ionization Energy', ie ? ie + ' eV' : '—'],
                    ['State at STP', state],
                    ['Boiling Point', bp && bp !== '0' ? bp + '°C' : bp === '0' ? '—' : '—'],
                    ['Density', den ? den + ' g/cm³' : '—'],
                    ['Atomic Radius', rad && rad !== '0' ? rad + ' pm' : '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="pt-detail-field">
                      <span className="pt-detail-label">{label}</span>
                      <span className="pt-detail-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default PeriodicTable;
