import { useNavigate } from 'react-router-dom';
import {
  Image, FileText, RotateCw, Shuffle,
  Droplets, Merge, Split,
  Unlock, Hash, Crop, Calendar,
  Calculator, DollarSign, Clock, Ruler,
  Edit3, Code, Terminal
} from 'lucide-react';
import './Services.css';

const imageTools = [
  { id: 'image-compress', title: 'Compress Image', icon: FileText, desc: 'Reduce image file size without losing quality' },
  { id: 'image-crop', title: 'Crop Image', icon: Crop, desc: 'Crop unwanted areas from your images' },
  { id: 'image-rotate', title: 'Rotate Image', icon: RotateCw, desc: 'Rotate or flip images by any angle' },
  { id: 'image-convert', title: 'JPG ↔ PNG ↔ WebP', icon: Shuffle, desc: 'Convert between image formats' },
  { id: 'add-watermark', title: 'Add Watermark', icon: Droplets, desc: 'Add text or image watermarks' },
];

const utilityTools = [
  { id: 'age-calculator', title: 'Age Calculator', icon: Calendar, desc: 'Calculate exact age in years, months and days' },
  { id: 'emi-calculator', title: 'EMI Calculator', icon: Calculator, desc: 'Monthly EMI, total interest and payment' },
  { id: 'interest-calculator', title: 'Interest Calculator', icon: Calculator, desc: 'Simple & compound interest on borrowed money' },
  { id: 'income-tax-calculator', title: 'Income Tax Calculator (India)', icon: DollarSign, desc: 'Tax as per Indian income tax slabs' },
  { id: 'currency-converter', title: 'Currency Converter', icon: DollarSign, desc: 'Convert between world currencies' },
  { id: 'timezone-converter', title: 'Time Zone Converter', icon: Clock, desc: 'Convert time between different time zones' },
  { id: 'unit-converter', title: 'Unit Converter', icon: Ruler, desc: 'Convert length, weight, temperature, area and more' },
  { id: 'bmi-calculator', title: 'BMI Calculator', icon: Calculator, desc: 'Calculate Body Mass Index from weight and height' },
];

const devTools = [
  { id: 'browser-notepad', title: 'Browser Notepad', icon: Edit3, desc: 'Take notes that auto-save in your browser' },
  { id: 'json-compare', title: 'JSON Compare', icon: Code, desc: 'Compare two JSON objects side by side' },
  { id: 'json-parser', title: 'JSON Parser', icon: Code, desc: 'Format, validate and beautify JSON' },
  { id: 'curl-parser', title: 'cURL Parser', icon: Terminal, desc: 'Parse cURL commands into readable request data' },
];

const pdfTools = [
  { id: 'image-to-pdf', title: 'Image to PDF', icon: Image, desc: 'Convert images to PDF documents' },
  { id: 'pdf-to-image', title: 'PDF to Image', icon: FileText, desc: 'Extract images from PDF pages' },
  { id: 'merge-pdf', title: 'Merge PDF', icon: Merge, desc: 'Combine multiple PDFs into one' },
  { id: 'split-pdf', title: 'Split PDF', icon: Split, desc: 'Split PDF into separate pages' },
  { id: 'compress-pdf', title: 'Compress PDF', icon: FileText, desc: 'Reduce PDF file size' },
  { id: 'rotate-pdf', title: 'Rotate PDF', icon: RotateCw, desc: 'Rotate PDF pages' },
  { id: 'unlock-pdf', title: 'Unlock PDF', icon: Unlock, desc: 'Remove PDF password protection' },
  { id: 'add-page-numbers', title: 'Add Page Numbers', icon: Hash, desc: 'Add page numbers to PDF' },
];

function Services() {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>All Tools</h1>
        <p>Free online tools for images, PDFs and everyday calculations</p>
      </div>

      <section className="tool-category">
        <h2 className="category-title">
          <Calculator className="category-icon" />
          Daily Utilities
        </h2>
        <div className="tools-grid">
          {utilityTools.map(tool => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} className="tool-card" onClick={() => navigate(`/service/${tool.id}`)}>
                <div className="tool-icon"><Icon size={28} /></div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-desc">{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="tool-category">
        <h2 className="category-title">
          <Image className="category-icon" />
          Image Tools
        </h2>
        <div className="tools-grid">
          {imageTools.map(tool => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} className="tool-card" onClick={() => navigate(`/service/${tool.id}`)}>
                <div className="tool-icon"><Icon size={28} /></div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-desc">{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="tool-category">
        <h2 className="category-title">
          <FileText className="category-icon" />
          PDF Tools
        </h2>
        <div className="tools-grid">
          {pdfTools.map(tool => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} className="tool-card" onClick={() => navigate(`/service/${tool.id}`)}>
                <div className="tool-icon"><Icon size={28} /></div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-desc">{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="tool-category">
        <h2 className="category-title">
          <Terminal className="category-icon" />
          Developer Utilities
        </h2>
        <div className="tools-grid">
          {devTools.map(tool => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} className="tool-card" onClick={() => navigate(`/service/${tool.id}`)}>
                <div className="tool-icon"><Icon size={28} /></div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-desc">{tool.desc}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Services;
