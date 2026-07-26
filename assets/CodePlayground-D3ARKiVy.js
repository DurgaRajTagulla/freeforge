import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{T as t}from"./vendor-CUsNzEWu.js";import{t as n}from"./vendor-react-CJ8QrA_k.js";import{o as r}from"./vendor-router-KynAGaNv.js";import{At as i,Ht as a,Mt as o,V as s,an as c,p as l}from"./vendor-icons-DMbGCGUx.js";var u=e(t(),1),d=n(),f=[{label:`Hello World`,code:`console.log("Hello, World!");
console.log("Welcome to FreeForge Code Playground!");`},{label:`Fibonacci`,code:`function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fib(i)}\`);
}`},{label:`FizzBuzz`,code:`for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`},{label:`Sort`,code:`const arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", arr);
arr.sort((a, b) => a - b);
console.log("Sorted:", arr);
console.log("Min:", arr[0], "Max:", arr[arr.length-1]);`},{label:`Pattern`,code:`const n = 5;
for (let i = 1; i <= n; i++) {
  let row = "";
  for (let j = 1; j <= i; j++) row += "* ";
  console.log(row);
}`},{label:`Prime Check`,code:`function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++)
    if (n % i === 0) return false;
  return true;
}
for (let n = 1; n <= 30; n++) {
  if (isPrime(n)) console.log(n + " is prime");
}`},{label:`Arrays`,code:`const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Original:", nums);
console.log("Even:", nums.filter(n => n % 2 === 0));
console.log("Odd:", nums.filter(n => n % 2 !== 0));
console.log("Sum:", nums.reduce((a, b) => a + b, 0));
console.log("Average:", nums.reduce((a, b) => a + b, 0) / nums.length);`},{label:`Objects`,code:`const student = {
  name: "Alice",
  age: 20,
  grade: "A",
  subjects: ["Math", "Physics", "CS"]
};
console.log("Student:", student);
console.log("Name:", student.name);
console.log("Subjects:", student.subjects.join(", "));
console.log("JSON:", JSON.stringify(student, null, 2));`}],p={"console.log":`console.log();`,"for loop":`for (let i = 0; i < 10; i++) {
  
}`,"if else":`if (condition) {
  
} else {
  
}`,function:`function name(params) {
  
}`,"arrow fn":`const fn = (params) => {
  
};`,"array.map":`arr.map(item => {
  
});`};function m(){let e=r(),[t,n]=(0,u.useState)(f[0].code),[m,h]=(0,u.useState)([]),[g,_]=(0,u.useState)(``),[v,y]=(0,u.useState)(!1),b=(0,u.useRef)(null),x=(0,u.useRef)(null),S=(0,u.useRef)(null);(0,u.useEffect)(()=>{x.current&&(x.current.scrollTop=x.current.scrollHeight)},[m]);let C=(0,u.useCallback)(()=>{_(``);let e=[],n={log:(...t)=>e.push({type:`log`,text:t.map(e=>typeof e==`object`?JSON.stringify(e,null,2):String(e)).join(` `)}),warn:(...t)=>e.push({type:`warn`,text:t.join(` `)}),error:(...t)=>e.push({type:`error`,text:t.join(` `)}),info:(...t)=>e.push({type:`info`,text:t.join(` `)}),clear:()=>{e.length=0}};try{Function(`console`,t)(n),h(e),e.length===0&&h([{type:`info`,text:`Code executed successfully (no output)`}])}catch(t){_(t.message),h([...e,{type:`error`,text:`Error: `+t.message}])}},[t]),w=()=>{h([]),_(``)},T=async()=>{try{await navigator.clipboard.writeText(t),y(!0),setTimeout(()=>y(!1),2e3)}catch{}},E=e=>{if(e.key===`Tab`){e.preventDefault();let r=e.target.selectionStart,i=e.target.selectionEnd;n(t.substring(0,r)+`  `+t.substring(i)),setTimeout(()=>{e.target.selectionStart=e.target.selectionEnd=r+2},0)}(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&(e.preventDefault(),C())},D=t.split(`
`).length;return(0,d.jsxs)(`div`,{className:`cp-page`,children:[(0,d.jsxs)(`div`,{className:`cp-header`,children:[(0,d.jsx)(`button`,{className:`cp-back`,onClick:()=>e(`/students-hub`),children:(0,d.jsx)(c,{size:20})}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`h1`,{className:`cp-title`,children:`Code Playground`}),(0,d.jsx)(`p`,{className:`cp-subtitle`,children:`Write and run JavaScript in your browser — Ctrl+Enter to run`})]})]}),(0,d.jsxs)(`div`,{className:`cp-body`,children:[(0,d.jsxs)(`div`,{className:`cp-sidebar`,children:[(0,d.jsxs)(`div`,{className:`cp-section`,children:[(0,d.jsx)(`div`,{className:`cp-section-title`,children:`Examples`}),(0,d.jsx)(`div`,{className:`cp-examples`,children:f.map((e,r)=>(0,d.jsxs)(`button`,{className:`cp-example-btn ${t===e.code?`active`:``}`,onClick:()=>{n(e.code),h([]),_(``)},children:[(0,d.jsx)(o,{size:12}),` `,e.label]},r))})]}),(0,d.jsxs)(`div`,{className:`cp-section`,children:[(0,d.jsx)(`div`,{className:`cp-section-title`,children:`Snippets`}),(0,d.jsx)(`div`,{className:`cp-snippets`,children:Object.entries(p).map(([e,t])=>(0,d.jsx)(`button`,{className:`cp-snippet-btn`,onClick:()=>{n(e=>e+`
`+t)},children:e},e))})]}),(0,d.jsxs)(`div`,{className:`cp-section`,children:[(0,d.jsx)(`div`,{className:`cp-section-title`,children:`Info`}),(0,d.jsxs)(`div`,{className:`cp-info`,children:[(0,d.jsx)(`p`,{children:`Write JavaScript code and see the output instantly.`}),(0,d.jsxs)(`ul`,{children:[(0,d.jsxs)(`li`,{children:[`Use `,(0,d.jsx)(`code`,{children:`console.log()`}),` to output`]}),(0,d.jsxs)(`li`,{children:[`Press `,(0,d.jsx)(`kbd`,{children:`Ctrl+Enter`}),` to run`]}),(0,d.jsxs)(`li`,{children:[`Press `,(0,d.jsx)(`kbd`,{children:`Tab`}),` to indent`]}),(0,d.jsx)(`li`,{children:`All code runs in a sandbox`})]})]})]})]}),(0,d.jsxs)(`div`,{className:`cp-main`,children:[(0,d.jsxs)(`div`,{className:`cp-editor-wrap`,children:[(0,d.jsxs)(`div`,{className:`cp-editor-header`,children:[(0,d.jsx)(`span`,{className:`cp-editor-lang`,children:`JavaScript`}),(0,d.jsxs)(`div`,{className:`cp-editor-actions`,children:[(0,d.jsx)(`button`,{className:`cp-editor-btn`,onClick:T,title:`Copy code`,children:v?(0,d.jsx)(a,{size:14}):(0,d.jsx)(i,{size:14})}),(0,d.jsxs)(`button`,{className:`cp-run-btn`,onClick:C,children:[(0,d.jsx)(s,{size:14}),` Run`]})]})]}),(0,d.jsxs)(`div`,{className:`cp-editor`,children:[(0,d.jsx)(`div`,{className:`cp-line-nums`,ref:S,children:Array.from({length:D},(e,t)=>(0,d.jsx)(`div`,{className:`cp-line-num`,children:t+1},t))}),(0,d.jsx)(`textarea`,{ref:b,className:`cp-textarea`,value:t,onChange:e=>n(e.target.value),onKeyDown:E,spellCheck:!1,wrap:`off`})]})]}),(0,d.jsxs)(`div`,{className:`cp-output-wrap`,children:[(0,d.jsxs)(`div`,{className:`cp-output-header`,children:[(0,d.jsx)(`span`,{className:`cp-output-title`,children:`Console Output`}),(0,d.jsxs)(`div`,{className:`cp-output-count`,children:[m.filter(e=>e.type===`log`).length,` logs`]}),(0,d.jsxs)(`button`,{className:`cp-clear-btn`,onClick:w,children:[(0,d.jsx)(l,{size:14}),` Clear`]})]}),(0,d.jsxs)(`div`,{className:`cp-output`,ref:x,children:[m.length===0&&!g&&(0,d.jsx)(`div`,{className:`cp-output-empty`,children:`Click "Run" or press Ctrl+Enter to execute the code`}),m.map((e,t)=>(0,d.jsxs)(`div`,{className:`cp-output-line cp-out-${e.type}`,children:[e.type===`error`?`✖`:e.type===`warn`?`⚠`:e.type===`info`?`ℹ`:`›`,` `,e.text]},t)),g&&!m.some(e=>e.type===`error`)&&(0,d.jsxs)(`div`,{className:`cp-output-line cp-out-error`,children:[`✖ `,g]})]})]})]})]})]})}export{m as default};