import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock, Target, Zap } from 'lucide-react';

const WORDS = [
  'the','be','to','of','and','a','in','that','have','I','it','for','not','on','with','he','as','you','do','at',
  'this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there',
  'their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no',
  'just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then',
  'now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well',
  'way','even','new','want','because','any','these','give','day','most','us','great','between','need','large','often',
  'along','close','turn','both','long','ask','hard','lead','light','mean','set','run','own','under','read','right',
  'same','should','show','side','small','still','start','such','tell','three','try','hand','high','might','important',
  'world','eye','never','last','let','found','keep','life','must','place','point','black','white','big','bring','call',
  'city','country','cut','develop','earth','eat','enough','face','family','father','feet','fire','food','form','free',
  'game','girl','god','group','head','hear','home','house','idea','indian','inside','king','land','laugh','learn',
  'letter','line','list','lose','love','low','machine','man','many','market','matter','member','message','money',
  'month','mother','move','music','name','nation','nature','number','oil','open','page','paper','part','party',
  'picture','plan','plant','play','power','press','price','problem','product','program','question','reason','record',
  'region','report','result','road','room','school','science','sea','season','second','section','service','ship',
  'sign','space','sport','street','study','table','team','term','test','third','top','town','travel','trouble',
  'university','value','view','wall','water','watch','week','weight','western','wheel','window','winter','woman','yellow',
  'young','above','add','ago','agree','air','allow','almost','alone','already','also','although','always','america',
  'amount','animal','another','answer','appear','apple','area','arm','arrive','art','article','attack','attention',
  'away','baby','back','ball','bank','base','battle','bear','beat','beauty','become','bed','before','begin','behavior',
  'behind','believe','benefit','best','better','beyond','bill','bird','bit','blood','blow','board','boat','body',
  'bone','book','born','bottom','brain','break','bridge','brown','build','burn','business','buy','camera','canada',
  'capital','captain','car','care','career','carry','case','cat','catch','cattle','cause','cell','center','century',
  'chance','change','character','charge','check','chief','child','choice','choose','church','circle','claim','class',
  'clear','climb','close','coast','cold','college','color','column','come','comfort','committee','common','community',
  'company','compare','complete','computer','concern','condition','conference','congress','connect','consider',
  'contain','content','continue','control','conversation','cool','corner','correct','cost','could','cover','crack',
  'create','crime','crisis','cross','crowd','culture','current','customer','dark','data','daughter','dead','deal',
  'death','debate','decade','decide','decision','deep','defense','degree','democrat','democratic','describe','design',
  'desk','determine','develop','development','die','diet','dinner','direction','director','discover','discuss',
  'discussion','disease','doctor','dog','door','down','draw','dream','drive','drop','drug','during','duty','dynamic',
  'each','edge','effect','effort','eight','either','election','else','employee','energy','engine','enjoy','enough',
  'enter','entire','environment','equal','equipment','escape','especially','establish','evening','event','ever','every',
  'evidence','exactly','examine','example','exchange','executive','exercise','exist','expect','expense','experience',
  'explain','explore','express','extend','external','extra','extreme','eye','face','fact','factor','fail','fair',
  'faith','fall','familiar','fan','fast','fat','fault','fear','feature','federal','feed','feel','female','field',
  'fight','figure','fill','film','final','financial','finger','finish','firm','first','fish','fit','fix','floor',
  'fly','focus','follow','foot','force','foreign','forest','forget','form','former','forward','four','free','friend',
  'front','fuel','full','fun','function','fund','future','gain','garden','gas','general','generation','gentleman',
  'gift','give','glass','global','goal','gold','golden','golf','good','government','governor','grab','grade','grand',
  'grass','green','grocery','gross','ground','group','grow','growth','guard','guess','guest','guide','gun','habitat',
  'half','hall','hand','handle','hang','happen','happy','hard','harm','hat','hate','have','head','health','hear',
  'heart','heat','heavy','help','here','herself','high','highway','hill','himself','history','hit','hold','hole',
  'home','honor','hope','hospital','hotel','hour','house','household','huge','human','hundred','hunt','hunter',
  'hurt','husband','idea','identify','ignore','image','imagine','immediate','impact','imply','import','important',
  'impose','improve','in','include','income','incorporate','increase','indeed','indicate','individual','industry',
  'inflation','influence','inform','information','initial','initiative','injury','inner','input','institution',
  'insurance','intellectual','intelligence','intend','intense','intention','interaction','interest','internal',
  'international','internet','interview','into','introduce','invasion','invest','investigate','investment','investor',
  'involve','island','issue','item','itself','job','join','joint','journal','journey','judge','jump','jury','just',
  'justice','justify','keep','key','kick','kid','kill','kind','kitchen','knee','knife','knock','know','knowledge',
  'laboratory','lack','lady','land','landscape','language','large','last','late','later','latter','laugh','launch',
  'law','lawyer','lay','layer','lead','leader','leadership','leading','leaf','league','lean','learn','learning',
  'least','leather','leave','left','leg','legal','lesson','let','letter','level','library','license','lie','life',
  'lift','light','like','likely','limit','limited','line','link','lion','lip','list','listen','literature','little',
  'live','load','loan','local','locate','location','lock','long','look','lord','lose','loss','lost','lot','loud',
  'love','lovely','low','lower','luck','lunch','lung','machine','magazine','main','maintain','maintenance','major',
  'majority','make','maker','male','manage','management','manager','manner','manufacturer','many','map','march',
  'margin','mark','market','marketing','marriage','married','marry','mass','master','match','material','matter',
  'may','maybe','mayor','meal','mean','measure','meat','mechanism','media','medical','medicine','medium','meet',
  'meeting','member','membership','memory','mental','mention','menu','mere','merely','message','metal','method',
  'middle','might','mile','military','milk','mind','mine','minor','minority','minute','miracle','mirror','missile',
  'mission','mistake','mix','mixture','mobile','model','moderate','modern','modest','mom','moment','money','monitor',
  'month','moon','moral','more','morning','most','mostly','mother','motion','motor','mountain','mouse','mouth','move',
  'movement','movie','much','murder','muscle','museum','music','musical','musician','mutual','myself','mystery',
  'myth','name','narrow','nation','national','native','natural','naturally','nature','near','nearly','necessary',
  'neck','need','negative','neighbor','neighborhood','neither','nerve','network','never','nevertheless','new','news'
];

function getWords(count) {
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function TypingSpeedTool() {
  const [words, setWords] = useState(() => getWords(50));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [typedWords, setTypedWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [wrongChars, setWrongChars] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [mode, setMode] = useState('words');
  const [wordCount, setWordCount] = useState(50);
  const [remainingTime, setRemainingTime] = useState(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const wordsEndRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (wordsEndRef.current) {
      wordsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!startTime || finished) return;
    if (mode === 'timed') {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = timeLimit - elapsed;
        if (remaining <= 0) {
          setFinished(true);
          clearInterval(timerRef.current);
          const m = timeLimit / 60;
          if (m > 0) setWpm(Math.round(currentIndex / m));
          setAccuracy(totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100);
        } else {
          setRemainingTime(Math.ceil(remaining));
        }
      }, 200);
      return () => clearInterval(timerRef.current);
    }
  }, [startTime, finished, mode, timeLimit, currentIndex, totalKeystrokes, correctKeystrokes]);

  const handleInput = (e) => {
    const value = e.target.value;
    if (finished) return;

    if (!startTime) {
      setStartTime(Date.now());
      if (mode === 'timed') setRemainingTime(timeLimit);
    }

    if (value.length > 0 && value[value.length - 1] === ' ') {
      const typedWord = value.trim();
      const expectedWord = words[currentIndex];

      setTotalKeystrokes(k => k + typedWord.length + 1);

      let correct = 0;
      for (let i = 0; i < Math.max(typedWord.length, expectedWord.length); i++) {
        if (typedWord[i] === expectedWord[i]) correct++;
      }
      setCorrectKeystrokes(c => c + correct);
      setWrongChars(w => w + (Math.max(typedWord.length, expectedWord.length) - correct));

      setTypedWords(prev => [...prev, typedWord]);
      setCurrentIndex(i => i + 1);
      setInput('');

      if (mode === 'words' && currentIndex + 1 >= wordCount) {
        setFinished(true);
        clearInterval(timerRef.current);
        const elapsed = (Date.now() - startTime) / 1000 / 60;
        if (elapsed > 0) setWpm(Math.round((currentIndex + 1) / elapsed));
        if (totalKeystrokes > 0) setAccuracy(Math.round((correctKeystrokes / totalKeystrokes) * 100));
      }
    } else {
      setInput(value);
      setTotalKeystrokes(k => k + 1);
      const expectedChar = words[currentIndex]?.[value.length - 1];
      if (value[value.length - 1] === expectedChar) {
        setCorrectKeystrokes(c => c + 1);
      } else {
        setWrongChars(w => w + 1);
      }
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    const count = mode === 'words' ? wordCount : 50;
    setWords(getWords(count));
    setCurrentIndex(0);
    setInput('');
    setTypedWords([]);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setWrongChars(0);
    setFinished(false);
    setRemainingTime(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  return (
    <div className="utility-tool">
      <div className="tool-options">
        <h3 className="options-title">
          <Target size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Typing Speed Test
        </h3>
        <div className="options-grid">
          <div className="option-item">
            <label>Mode</label>
            <select className="option-input" value={mode} onChange={e => { setMode(e.target.value); reset(); }}>
              <option value="words">Fixed Words</option>
              <option value="timed">Timed</option>
            </select>
          </div>
          {mode === 'words' ? (
            <div className="option-item">
              <label>Word Count</label>
              <select className="option-input" value={wordCount} onChange={e => { setWordCount(Number(e.target.value)); reset(); }}>
                <option value={25}>25 words</option>
                <option value={50}>50 words</option>
                <option value={100}>100 words</option>
              </select>
            </div>
          ) : (
            <div className="option-item">
              <label>Time Limit</label>
              <select className="option-input" value={timeLimit} onChange={e => { setTimeLimit(Number(e.target.value)); reset(); }}>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="tool-options" style={{ padding: '16px 20px' }}>
        {!finished && (
          <div className="notepad-bar" style={{ marginBottom: '10px' }}>
            <span className="notepad-stats">
              Word {Math.min(currentIndex + 1, mode === 'words' ? wordCount : words.length)} of {mode === 'words' ? wordCount : '∞'}
            </span>
            {mode === 'timed' && remainingTime !== null && (
              <span className="notepad-status" style={{ color: remainingTime <= 5 ? '#f87171' : '#4ade80' }}>
                <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {remainingTime}s
              </span>
            )}
          </div>
        )}

        <div style={{
          background: '#0f172a', border: '1px solid #334155', borderRadius: '8px',
          padding: '20px', fontSize: '18px', lineHeight: '1.8',
          fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
          minHeight: '160px', maxHeight: '240px', overflow: 'auto',
          letterSpacing: '0.5px', display: 'flex', flexWrap: 'wrap', gap: '4px 8px', marginBottom: '14px'
        }}>
          {words.slice(0, mode === 'words' ? wordCount : 50).map((word, wi) => {
            const typed = typedWords[wi];
            const isPast = wi < currentIndex;
            const isCurrent = wi === currentIndex;
            return (
              <span key={wi} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {word.split('').map((char, ci) => {
                  if (isPast) {
                    const typedChar = typed?.[ci] || '';
                    const wasCorrect = typedChar === char;
                    return <span key={ci} style={{ color: wasCorrect ? '#4ade80' : '#f87171' }}>{char}</span>;
                  }
                  if (isCurrent) {
                    if (ci < input.length) {
                      const isCorrect = input[ci] === char;
                      return (
                        <span key={ci} style={{
                          color: isCorrect ? '#e2e8f0' : '#f87171',
                          background: isCorrect ? 'transparent' : 'rgba(239,68,68,0.2)',
                          borderRadius: '2px'
                        }}>{char}</span>
                      );
                    }
                    if (ci === input.length) {
                      return <span key={ci} style={{ borderLeft: '2px solid #3b82f6', color: '#94a3b8' }}>{char}</span>;
                    }
                    return <span key={ci} style={{ color: '#64748b' }}>{char}</span>;
                  }
                  return <span key={ci} style={{ color: '#334155' }}>{char}</span>;
                })}
              </span>
            );
          })}
          <span ref={wordsEndRef} />
        </div>

        <input
          ref={inputRef}
          type="text"
          className="option-input"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={finished ? 'Test complete! Click Try Again.' : 'Type the highlighted word and press space...'}
          disabled={finished}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          style={{ width: '100%', padding: '14px 16px', fontSize: '18px', fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace" }}
        />
      </div>

      {finished && (
        <div className="tool-options" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid #3b82f6' }}>
          <h3 className="options-title" style={{ color: '#60a5fa' }}>Results</h3>
          <div className="result-grid">
            <div className="result-card highlight">
              <Zap size={20} color="#facc15" />
              <span className="result-label">Speed (WPM)</span>
              <span className="result-value" style={{ fontSize: '28px' }}>{wpm}</span>
            </div>
            <div className="result-card highlight">
              <Target size={20} color="#4ade80" />
              <span className="result-label">Accuracy</span>
              <span className="result-value" style={{ fontSize: '28px' }}>{accuracy}%</span>
            </div>
            <div className="result-card">
              <span className="result-label">Words Typed</span>
              <span className="result-value" style={{ fontSize: '24px' }}>{currentIndex}</span>
            </div>
            <div className="result-card">
              <span className="result-label">Wrong Characters</span>
              <span className="result-value" style={{ fontSize: '24px', color: '#f87171' }}>{wrongChars}</span>
            </div>
          </div>
        </div>
      )}

      <div className="service-actions">
        <button className="process-btn" onClick={reset}>
          <RefreshCw size={16} /> {finished ? 'Try Again' : 'Reset'}
        </button>
      </div>
    </div>
  );
}
