import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Trash2, Copy, Check, Code } from 'lucide-react';
import './CodePlayground.css';

const EXAMPLES = [
  { label: 'Hello World', code: 'console.log("Hello, World!");\nconsole.log("Welcome to FreeForge Code Playground!");' },
  { label: 'Fibonacci', code: 'function fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}\nfor (let i = 0; i < 10; i++) {\n  console.log(`fib(${i}) = ${fib(i)}`);\n}' },
  { label: 'FizzBuzz', code: 'for (let i = 1; i <= 20; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}' },
  { label: 'Sort', code: 'const arr = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Original:", arr);\narr.sort((a, b) => a - b);\nconsole.log("Sorted:", arr);\nconsole.log("Min:", arr[0], "Max:", arr[arr.length-1]);' },
  { label: 'Pattern', code: 'const n = 5;\nfor (let i = 1; i <= n; i++) {\n  let row = "";\n  for (let j = 1; j <= i; j++) row += "* ";\n  console.log(row);\n}' },
  { label: 'Prime Check', code: 'function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++)\n    if (n % i === 0) return false;\n  return true;\n}\nfor (let n = 1; n <= 30; n++) {\n  if (isPrime(n)) console.log(n + " is prime");\n}' },
  { label: 'Arrays', code: 'const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconsole.log("Original:", nums);\nconsole.log("Even:", nums.filter(n => n % 2 === 0));\nconsole.log("Odd:", nums.filter(n => n % 2 !== 0));\nconsole.log("Sum:", nums.reduce((a, b) => a + b, 0));\nconsole.log("Average:", nums.reduce((a, b) => a + b, 0) / nums.length);' },
  { label: 'Objects', code: 'const student = {\n  name: "Alice",\n  age: 20,\n  grade: "A",\n  subjects: ["Math", "Physics", "CS"]\n};\nconsole.log("Student:", student);\nconsole.log("Name:", student.name);\nconsole.log("Subjects:", student.subjects.join(", "));\nconsole.log("JSON:", JSON.stringify(student, null, 2));' },
];

const SNIPPETS = {
  'console.log': 'console.log();',
  'for loop': 'for (let i = 0; i < 10; i++) {\n  \n}',
  'if else': 'if (condition) {\n  \n} else {\n  \n}',
  'function': 'function name(params) {\n  \n}',
  'arrow fn': 'const fn = (params) => {\n  \n};',
  'array.map': 'arr.map(item => {\n  \n});',
};

export default function CodePlayground() {
  const navigate = useNavigate();
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const lineNumRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const runCode = useCallback(() => {
    setError('');
    const logs = [];
    const fakeConsole = {
      log: (...args) => logs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
      warn: (...args) => logs.push({ type: 'warn', text: args.join(' ') }),
      error: (...args) => logs.push({ type: 'error', text: args.join(' ') }),
      info: (...args) => logs.push({ type: 'info', text: args.join(' ') }),
      clear: () => { logs.length = 0; },
    };
    try {
      const fn = new Function('console', code);
      fn(fakeConsole);
      setOutput(logs);
      if (logs.length === 0) setOutput([{ type: 'info', text: 'Code executed successfully (no output)' }]);
    } catch (e) {
      setError(e.message);
      setOutput([...logs, { type: 'error', text: 'Error: ' + e.message }]);
    }
  }, [code]);

  const clearOutput = () => {
    setOutput([]);
    setError('');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newVal = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newVal);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="cp-page">
      <div className="cp-header">
        <button className="cp-back" onClick={() => navigate('/students-hub')}><ArrowLeft size={20} /></button>
        <div>
          <h1 className="cp-title">Code Playground</h1>
          <p className="cp-subtitle">Write and run JavaScript in your browser — Ctrl+Enter to run</p>
        </div>
      </div>

      <div className="cp-body">
        <div className="cp-sidebar">
          <div className="cp-section">
            <div className="cp-section-title">Examples</div>
            <div className="cp-examples">
              {EXAMPLES.map((ex, i) => (
                <button key={i} className={`cp-example-btn ${code === ex.code ? 'active' : ''}`} onClick={() => { setCode(ex.code); setOutput([]); setError(''); }}>
                  <Code size={12} /> {ex.label}
                </button>
              ))}
            </div>
          </div>
          <div className="cp-section">
            <div className="cp-section-title">Snippets</div>
            <div className="cp-snippets">
              {Object.entries(SNIPPETS).map(([name, snippet]) => (
                <button key={name} className="cp-snippet-btn" onClick={() => { setCode(prev => prev + '\n' + snippet); }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="cp-section">
            <div className="cp-section-title">Info</div>
            <div className="cp-info">
              <p>Write JavaScript code and see the output instantly.</p>
              <ul>
                <li>Use <code>console.log()</code> to output</li>
                <li>Press <kbd>Ctrl+Enter</kbd> to run</li>
                <li>Press <kbd>Tab</kbd> to indent</li>
                <li>All code runs in a sandbox</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="cp-main">
          <div className="cp-editor-wrap">
            <div className="cp-editor-header">
              <span className="cp-editor-lang">JavaScript</span>
              <div className="cp-editor-actions">
                <button className="cp-editor-btn" onClick={copyCode} title="Copy code">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button className="cp-run-btn" onClick={runCode}>
                  <Play size={14} /> Run
                </button>
              </div>
            </div>
            <div className="cp-editor">
              <div className="cp-line-nums" ref={lineNumRef}>
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="cp-line-num">{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={editorRef}
                className="cp-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                wrap="off"
              />
            </div>
          </div>

          <div className="cp-output-wrap">
            <div className="cp-output-header">
              <span className="cp-output-title">Console Output</span>
              <div className="cp-output-count">{output.filter(o => o.type === 'log').length} logs</div>
              <button className="cp-clear-btn" onClick={clearOutput}><Trash2 size={14} /> Clear</button>
            </div>
            <div className="cp-output" ref={outputRef}>
              {output.length === 0 && !error && (
                <div className="cp-output-empty">Click "Run" or press Ctrl+Enter to execute the code</div>
              )}
              {output.map((line, i) => (
                <div key={i} className={`cp-output-line cp-out-${line.type}`}>
                  {line.type === 'error' ? '✖' : line.type === 'warn' ? '⚠' : line.type === 'info' ? 'ℹ' : '›'} {line.text}
                </div>
              ))}
              {error && !output.some(o => o.type === 'error') && (
                <div className="cp-output-line cp-out-error">✖ {error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
