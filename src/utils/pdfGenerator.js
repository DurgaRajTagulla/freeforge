import { jsPDF } from 'jspdf';

const MARGIN = 20;
const PAGE_W = 210;
const CW = PAGE_W - MARGIN * 2;
const LINE_H = 5;
const BLACK = [0, 0, 0];
const BLUE = [37, 99, 235];
const GRAY = [107, 114, 128];
const LIGHT_GRAY = [209, 213, 219];
const FONT = 'helvetica';

function resetColor(doc) {
  doc.setTextColor(...BLACK);
}

function addLine(doc, y) {
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
}

function setFont(doc, style = 'normal', size = 10) {
  doc.setFont(FONT, style);
  doc.setFontSize(size);
}

function renderRichText(doc, html, startY) {
  const container = document.createElement('div');
  container.innerHTML = html || '';
  const nodes = [];
  let listType = null;

  let hasContent = false;
  function walk(node, bold, italic) {
    if (node.nodeType === 3) {
      const t = node.textContent;
      if (t) { nodes.push({ t, bold, italic }); hasContent = true; }
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    const b = bold || tag === 'b' || tag === 'strong';
    const it = italic || tag === 'i' || tag === 'em';

    if (tag === 'br') nodes.push({ type: 'break' });
    else if (tag === 'p' || tag === 'div') { if (hasContent) nodes.push({ type: 'break' }); for (const c of node.childNodes) walk(c, b, it); }
    else if (tag === 'ul') { for (const c of node.childNodes) walk(c, b, it); }
    else if (tag === 'ol') { for (const c of node.childNodes) walk(c, b, it); }
    else if (tag === 'li') { nodes.push({ type: 'li' }); for (const c of node.childNodes) walk(c, b, it); }
    else { for (const c of node.childNodes) walk(c, b, it); }
  }
  walk(container, false, false);

  let y = startY;
  let cx = MARGIN;
  let indent = false;
  const INDENT = 5;

  for (const node of nodes) {
    if (node.type === 'break') {
      cx = MARGIN; y += LINE_H; indent = false;
      if (y > 280) { doc.addPage(); y = 20; }
      continue;
    }
    if (node.type === 'li') {
      cx = MARGIN; y += LINE_H; indent = true;
      if (y > 280) { doc.addPage(); y = 20; }
      setFont(doc, 'normal', 10);
      resetColor(doc);
      doc.text('\u2022', MARGIN + 2, y);
      cx = MARGIN + INDENT;
      continue;
    }
    const style = node.bold ? (node.italic ? 'bolditalic' : 'bold') : (node.italic ? 'italic' : 'normal');
    setFont(doc, style, 10);
    resetColor(doc);

    for (const word of node.t.split(/\s+/)) {
      if (!word) continue;
      const sp = cx > (indent ? MARGIN + INDENT : MARGIN) ? ' ' : '';
      if (cx + doc.getTextWidth(sp + word) > PAGE_W - MARGIN) {
        cx = indent ? MARGIN + INDENT : MARGIN; y += LINE_H;
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(word, cx, y); cx += doc.getTextWidth(word);
      } else {
        if (sp) { doc.text(sp, cx, y); cx += doc.getTextWidth(sp); }
        doc.text(word, cx, y); cx += doc.getTextWidth(word);
      }
    }
  }
  y += LINE_H;
  resetColor(doc);
  return y;
}

export function generatePDF(data) {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  let y = MARGIN;

  const name = (data.fullName || 'YOUR NAME').toUpperCase();
  const jobTitle = data.jobTitle || '';
  const email = data.email || '';
  const phone = data.phone || '';
  const loc = data.location || '';
  const linkedin = data.linkedin || '';
  const github = data.github || '';
  const summary = data.summary || '';

  // Name
  setFont(doc, 'bold', 22);
  resetColor(doc);
  doc.text(name, PAGE_W / 2, y, { align: 'center' });
  y += 9;

  // Job title
  if (jobTitle) {
    setFont(doc, 'normal', 13);
    doc.setTextColor(...BLUE);
    doc.text(jobTitle, PAGE_W / 2, y, { align: 'center' });
    resetColor(doc);
    y += 7;
  }

  // Contact
  const contactParts = [email, phone, loc].filter(Boolean);
  if (contactParts.length) {
    setFont(doc, 'normal', 8);
    doc.setTextColor(...GRAY);
    doc.text(contactParts.join('  \u2022  '), PAGE_W / 2, y, { align: 'center' });
    y += 4;
  }

  // Links - show as clickable labels
  const linkLabels = [];
  if (linkedin) linkLabels.push({ text: 'LinkedIn', url: linkedin });
  if (github) linkLabels.push({ text: 'GitHub', url: github });
  if (linkLabels.length) {
    setFont(doc, 'normal', 8);
    doc.setTextColor(...BLUE);
    let linkX = PAGE_W / 2;
    if (linkLabels.length === 2) {
      linkX -= doc.getTextWidth('LinkedIn  •  GitHub') / 2;
      doc.text('LinkedIn', linkX, y);
      const linkedinW = doc.getTextWidth('LinkedIn');
      doc.link(linkX, y - 3, linkedinW, 4, { url: linkedin });
      linkX += linkedinW + doc.getTextWidth('  •  ');
      doc.text('GitHub', linkX, y);
      const githubW = doc.getTextWidth('GitHub');
      doc.link(linkX, y - 3, githubW, 4, { url: github });
    } else {
      const item = linkLabels[0];
      linkX -= doc.getTextWidth(item.text) / 2;
      doc.text(item.text, linkX, y);
      const textW = doc.getTextWidth(item.text);
      doc.link(linkX, y - 3, textW, 4, { url: item.url });
    }
    resetColor(doc);
    y += 4;
  }

  y += 2;

  // Summary
  const summaryText = summary.replace(/<[^>]*>/g, '').trim();
  if (summaryText) {
    if (y > 270) { doc.addPage(); y = MARGIN; }
    setFont(doc, 'bold', 11);
    resetColor(doc);
    doc.text('PROFESSIONAL SUMMARY', MARGIN, y);
    y += 2;
    addLine(doc, y); y += 5;
    y = renderRichText(doc, summary, y);
    y += 2;
  }

  // Experience
  if (data.experience?.length) {
    if (y > 270) { doc.addPage(); y = MARGIN; }
    setFont(doc, 'bold', 11);
    resetColor(doc);
    doc.text('WORK EXPERIENCE', MARGIN, y);
    y += 2;
    addLine(doc, y); y += 5;

    for (const exp of data.experience) {
      if (y > 270) { doc.addPage(); y = MARGIN; }

      const dateText = (exp.startDate || '') + ' \u2014 ' + (exp.endDate || '');
      const hasDate = dateText.trim() !== '\u2014' && dateText.trim() !== ' \u2014 ';

      // Line 1: Company (bold, left) + Location (right, gray)
      if (exp.company) {
        setFont(doc, 'bold', 10);
        resetColor(doc);
        doc.text(exp.company, MARGIN, y);
      }
      if (exp.location) {
        setFont(doc, 'normal', 8);
        doc.setTextColor(...GRAY);
        doc.text(exp.location, PAGE_W - MARGIN, y, { align: 'right' });
        resetColor(doc);
      }
      y += 5;

      // Line 2: Position (blue, left) + Date (right, gray)
      if (exp.position) {
        setFont(doc, 'bold', 10);
        doc.setTextColor(...BLUE);
        doc.text(exp.position, MARGIN, y);
        resetColor(doc);
      }
      if (hasDate) {
        setFont(doc, 'normal', 8);
        doc.setTextColor(...GRAY);
        doc.text(dateText, PAGE_W - MARGIN, y, { align: 'right' });
        resetColor(doc);
      }
      y += 5;

      // Description
      if (exp.description) {
        y = renderRichText(doc, exp.description, y);
      }
      y += 2;
    }
  }

  // Skills
  if (data.skills && Object.keys(data.skills).length) {
    if (y > 270) { doc.addPage(); y = MARGIN; }
    setFont(doc, 'bold', 11);
    resetColor(doc);
    doc.text('SKILLS', MARGIN, y);
    y += 2;
    addLine(doc, y); y += 5;

    for (const [cat, skills] of Object.entries(data.skills)) {
      if (y > 280) { doc.addPage(); y = MARGIN; }

      const catLabel = cat + ': ';
      setFont(doc, 'bold', 10);
      resetColor(doc);
      doc.text(catLabel, MARGIN, y);
      const catW = doc.getTextWidth(catLabel);

      const skillText = Array.isArray(skills) ? skills.join(', ') : String(skills);
      setFont(doc, 'normal', 10);
      resetColor(doc);

      const words = skillText.split(/\s+/);
      let currentX = MARGIN + catW;
      let firstLine = true;

      for (const word of words) {
        const wordW = doc.getTextWidth(word);
        const spaceW = currentX > (firstLine ? MARGIN + catW : MARGIN) ? doc.getTextWidth(' ') : 0;

        if (currentX + spaceW + wordW > PAGE_W - MARGIN) {
          y += LINE_H;
          if (y > 280) { doc.addPage(); y = MARGIN; }
          currentX = MARGIN;
          firstLine = false;
          doc.text(word, currentX, y);
          currentX += wordW;
        } else {
          if (spaceW) { doc.text(' ', currentX, y); currentX += spaceW; }
          doc.text(word, currentX, y);
          currentX += wordW;
        }
      }
      y += LINE_H + 1;
    }
    y += 2;
  }

  // Projects
  if (data.projects?.length) {
    if (y > 270) { doc.addPage(); y = MARGIN; }
    setFont(doc, 'bold', 11);
    resetColor(doc);
    doc.text('KEY PROJECTS', MARGIN, y);
    y += 2;
    addLine(doc, y); y += 5;

    for (const proj of data.projects) {
      if (y > 275) { doc.addPage(); y = MARGIN; }
      setFont(doc, 'bold', 10);
      resetColor(doc);
      doc.text(proj.name || 'Project', MARGIN, y);
      y += 5;

      if (proj.description) {
        y = renderRichText(doc, proj.description, y);
      }
      y += 2;
    }
  }

  // Education
  if (data.education?.length) {
    if (y > 270) { doc.addPage(); y = MARGIN; }
    setFont(doc, 'bold', 11);
    resetColor(doc);
    doc.text('EDUCATION', MARGIN, y);
    y += 2;
    addLine(doc, y); y += 5;

    for (const edu of data.education) {
      if (y > 275) { doc.addPage(); y = MARGIN; }

      // School name
      if (edu.school) {
        setFont(doc, 'bold', 10);
        resetColor(doc);
        doc.text(edu.school, MARGIN, y);
        y += 5;
      }

      // Degree
      if (edu.degree) {
        setFont(doc, 'normal', 10);
        resetColor(doc);
        doc.text(edu.degree, MARGIN, y);
        y += 5;
      }

      // Dates
      if (edu.startDate || edu.endDate) {
        setFont(doc, 'normal', 8);
        doc.setTextColor(...GRAY);
        doc.text((edu.startDate || '') + ' \u2014 ' + (edu.endDate || ''), MARGIN, y);
        resetColor(doc);
        y += 5;
      }
      y += 2;
    }
  }

  const fname = (data.fullName || 'resume').replace(/\s+/g, '_');

  // Store JSON data in PDF metadata for round-trip import
  doc.setProperties({
    subject: JSON.stringify(data)
  });

  doc.save(fname + '_resume.pdf');
}
