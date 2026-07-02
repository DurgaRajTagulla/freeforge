import { jsPDF } from 'jspdf';

const MARGIN = 20;
const PAGE_W = 210;
const LINE_H = 5;
const BLACK = [0, 0, 0];
const BLUE = [37, 99, 235];
const GRAY = [107, 114, 128];
const LIGHT_GRAY = [209, 213, 219];
const FONT = 'helvetica';

function resetColor(doc) {
  doc.setTextColor(...BLACK);
}

function addLine(doc, y, color = LIGHT_GRAY) {
  doc.setDrawColor(...color);
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

export function generatePDF(data, template = 0, theme = { primary: '#2563eb', secondary: '#1e40af' }) {
  if (template === 1) {
    return generateTwoColumnPDF(data, theme);
  }
  
  const doc = new jsPDF('portrait', 'mm', 'a4');
  let y = MARGIN;

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [37, 99, 235];
  };
  const THEME_PRIMARY = hexToRgb(theme.primary);

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
    doc.setTextColor(...THEME_PRIMARY);
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
    doc.setTextColor(...THEME_PRIMARY);
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
    addLine(doc, y, THEME_PRIMARY); y += 5;
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
    addLine(doc, y, THEME_PRIMARY); y += 5;

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
        doc.setTextColor(...THEME_PRIMARY);
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
    addLine(doc, y, THEME_PRIMARY); y += 5;

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
    addLine(doc, y, THEME_PRIMARY); y += 5;

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
    addLine(doc, y, THEME_PRIMARY); y += 5;

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

function generateTwoColumnPDF(data, theme = { primary: '#2563eb', secondary: '#1e40af' }) {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  const PW = 210;
  const PH = 297;
  const M = 18;
  const GAP = 8;
  const LW = (PW - 2 * M - GAP) * 0.52;
  const RW = (PW - 2 * M - GAP) * 0.48;
  const RX = M + LW + GAP;
  const BOTTOM = PH - 15;

  const hexToRgb = (hex) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [37, 99, 235];
  };
  const TP = hexToRgb(theme.primary);

  const drawSectionTitle = (title, y, x, w) => {
    doc.setFont(FONT, 'bold', 10);
    doc.setTextColor(...TP);
    doc.text(title, x, y);
    y += 2;
    doc.setDrawColor(...TP);
    doc.setLineWidth(0.4);
    doc.line(x, y, x + w, y);
    y += 7;
    return y;
  };

  let page = 1;

  doc.setFillColor(...TP);
  doc.rect(0, 0, PW, 58, 'F');

  doc.setFont(FONT, 'bold', 22);
  doc.setTextColor(255, 255, 255);
  const name = (data.fullName || 'YOUR NAME').toUpperCase();
  doc.text(name, PW / 2, 26, { align: 'center' });

  if (data.jobTitle) {
    doc.setFont(FONT, 'normal', 11);
    doc.setTextColor(255, 255, 255);
    doc.text(data.jobTitle, PW / 2, 34, { align: 'center' });
  }

  if (data.summary) {
    doc.setFont(FONT, 'normal', 8);
    doc.setTextColor(210, 210, 210);
    const st = data.summary.replace(/<[^>]*>/g, '').trim();
    const sl = doc.splitTextToSize(st, PW - 40);
    doc.text(sl.slice(0, 3), PW / 2, 44, { align: 'center' });
  }

  doc.setFillColor(241, 245, 249);
  doc.rect(0, 60, PW, 10, 'F');

  doc.setFont(FONT, 'normal', 7);
  doc.setTextColor(71, 85, 105);
  const cp = [];
  if (data.email) cp.push(data.email);
  if (data.phone) cp.push(data.phone);
  if (data.location) cp.push(data.location);
  if (data.linkedin) cp.push('LinkedIn');
  if (data.github) cp.push('GitHub');
  if (cp.length) {
    const contactStr = cp.join('  \u2022  ');
    doc.text(contactStr, PW / 2, 66.5, { align: 'center' });
  }

  const leftItems = [];
  if (data.experience?.length) {
    leftItems.push({ type: 'section', title: 'WORK EXPERIENCE' });
    for (const exp of data.experience) {
      leftItems.push({ type: 'exp', data: exp });
    }
  }
  if (data.education?.length) {
    leftItems.push({ type: 'section', title: 'EDUCATION' });
    for (const edu of data.education) {
      leftItems.push({ type: 'edu', data: edu });
    }
  }

  const rightItems = [];
  if (data.skills && Object.keys(data.skills).length) {
    rightItems.push({ type: 'section', title: 'SKILLS' });
    for (const [cat, skills] of Object.entries(data.skills)) {
      rightItems.push({ type: 'skill', category: cat, skills });
    }
  }
  if (data.projects?.length) {
    rightItems.push({ type: 'section', title: 'PROJECTS' });
    for (const proj of data.projects) {
      rightItems.push({ type: 'proj', data: proj });
    }
  }

  let ly = 78;
  let ry = 78;
  let li = 0;
  let ri = 0;

  function newPage() {
    doc.addPage();
    page++;
    ly = 20;
    ry = 20;
  }

  while (li < leftItems.length || ri < rightItems.length) {
    const leftDone = li >= leftItems.length;
    const rightDone = ri >= rightItems.length;

    if (!leftDone && ly > BOTTOM) {
      newPage();
      continue;
    }
    if (!rightDone && ry > BOTTOM) {
      newPage();
      continue;
    }
    if (leftDone && rightDone) break;

    if (!leftDone) {
      const item = leftItems[li];
      if (item.type === 'section') {
        if (ly > 20) ly += 5;
        ly = drawSectionTitle(item.title, ly, M, LW);
        li++;
      } else if (item.type === 'exp') {
        const exp = item.data;
        doc.setFont(FONT, 'bold', 9);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.company || '', M, ly);
        ly += 4;
        if (exp.position) {
          doc.setFont(FONT, 'bold', 8);
          doc.setTextColor(...TP);
          doc.text(exp.position, M, ly);
          ly += 3.5;
        }
        doc.setFont(FONT, 'normal', 7);
        doc.setTextColor(107, 114, 128);
        const dt = ((exp.startDate || '') + ' \u2014 ' + (exp.endDate || '')).trim();
        if (dt !== '\u2014') doc.text(dt, M, ly);
        if (exp.location) doc.text(exp.location, M + LW, ly, { align: 'right' });
        ly += 4;
        if (exp.description) {
          ly = renderRichTextInColumn(doc, exp.description, M, ly, LW);
        }
        ly += 4;
        li++;
      } else if (item.type === 'edu') {
        const edu = item.data;
        doc.setFont(FONT, 'bold', 9);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.school || '', M, ly);
        ly += 4;
        if (edu.degree) {
          doc.setFont(FONT, 'normal', 8);
          doc.setTextColor(...TP);
          doc.text(edu.degree, M, ly);
          ly += 3.5;
        }
        if (edu.startDate || edu.endDate) {
          doc.setFont(FONT, 'normal', 7);
          doc.setTextColor(107, 114, 128);
          doc.text((edu.startDate || '') + ' \u2014 ' + (edu.endDate || ''), M, ly);
          ly += 3.5;
        }
        ly += 4;
        li++;
      } else {
        li++;
      }
    }

    if (!rightDone) {
      const item = rightItems[ri];
      if (item.type === 'section') {
        if (ry > 20) ry += 5;
        ry = drawSectionTitle(item.title, ry, RX, RW);
        ri++;
      } else if (item.type === 'skill') {
        doc.setFont(FONT, 'bold', 8);
        doc.setTextColor(...TP);
        doc.text(item.category, RX, ry);
        ry += 4.5;

        let tagX = RX;
        let tagY = ry;
        const tagH = 5;
        const tagPad = 1.5;
        const tagGap = 2.5;

        for (const skill of item.skills) {
          doc.setFont(FONT, 'normal', 7);
          const sw = doc.getTextWidth(skill) + tagPad * 2 + 1;
          if (tagX + sw > RX + RW) {
            tagX = RX;
            tagY += tagH + tagGap;
          }
          doc.setFillColor(...TP);
          doc.roundedRect(tagX, tagY - 3.5, sw, tagH, 1.5, 1.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(skill, tagX + tagPad + 0.5, tagY);
          tagX += sw + tagGap;
        }
        ry = tagY + tagH + 5;
        ri++;
      } else if (item.type === 'proj') {
        const proj = item.data;
        doc.setFont(FONT, 'bold', 8.5);
        doc.setTextColor(0, 0, 0);
        doc.text(proj.name || 'Project', RX, ry);
        ry += 4;
        if (proj.description) {
          ry = renderRichTextInColumn(doc, proj.description, RX, ry, RW);
        }
        ry += 4;
        ri++;
      } else {
        ri++;
      }
    }
  }

  const fname = (data.fullName || 'resume').replace(/\s+/g, '_');
  doc.setProperties({ subject: JSON.stringify(data) });
  doc.save(fname + '_resume.pdf');
}

function renderRichTextInColumn(doc, html, startX, startY, maxWidth) {
  const container = document.createElement('div');
  container.innerHTML = html || '';
  const nodes = [];
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
    else if (tag === 'ul' || tag === 'ol') { for (const c of node.childNodes) walk(c, b, it); }
    else if (tag === 'li') { nodes.push({ type: 'li' }); for (const c of node.childNodes) walk(c, b, it); }
    else { for (const c of node.childNodes) walk(c, b, it); }
  }
  walk(container, false, false);
  
  let y = startY;
  let cx = startX;
  let indent = false;
  const INDENT = 4;
  const LINE_H = 4;
  const BREAK_GAP = 4;
  const LI_GAP = 1.5;
  
  for (const node of nodes) {
    if (node.type === 'break') {
      cx = startX; y += LINE_H + BREAK_GAP; indent = false;
      if (y > 275) { doc.addPage(); y = 20; }
      continue;
    }
    if (node.type === 'li') {
      cx = startX; y += LINE_H + LI_GAP; indent = true;
      if (y > 275) { doc.addPage(); y = 20; }
      doc.setFont(FONT, 'normal', 7.5);
      doc.setTextColor(0, 0, 0);
      doc.text('\u2022', startX + 1, y);
      cx = startX + INDENT;
      continue;
    }
    const style = node.bold ? (node.italic ? 'bolditalic' : 'bold') : (node.italic ? 'italic' : 'normal');
    doc.setFont(FONT, style, 7.5);
    doc.setTextColor(0, 0, 0);
    
    for (const word of node.t.split(/\s+/)) {
      if (!word) continue;
      const sp = cx > (indent ? startX + INDENT : startX) ? ' ' : '';
      if (cx + doc.getTextWidth(sp + word) > startX + maxWidth) {
        cx = indent ? startX + INDENT : startX; y += LINE_H;
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(word, cx, y); cx += doc.getTextWidth(word);
      } else {
        if (sp) { doc.text(sp, cx, y); cx += doc.getTextWidth(sp); }
        doc.text(word, cx, y); cx += doc.getTextWidth(word);
      }
    }
  }
  y += LINE_H;
  return y;
}
