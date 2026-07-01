import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, Plus, X, Printer, FileJson, Upload, FileText, Loader2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { generatePDF } from '../utils/pdfGenerator';
import { extractResumeFromPDF } from '../utils/pdfParser';
import './Editor.css';

const STORAGE_KEY = 'freeforge_data';

const defaultResumeData = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  experience: [],
  education: [],
  skills: {},
  projects: []
};

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.resumeData;
  
  // Load data from localStorage or use location data or defaults
  const loadData = () => {
    if (locationData) {
      return locationData;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultResumeData;
      }
    }
    return defaultResumeData;
  };
  
  const [resumeData, setResumeData] = useState(loadData);
  const [zoom, setZoom] = useState(85);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalData, setModalData] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  // Save to localStorage whenever resumeData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  }, [resumeData]);

  // Clear localStorage when tab is closed for privacy
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem(STORAGE_KEY);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const openModal = (type, index = null) => {
    setModalType(type);
    setEditingIndex(index);
    
    if (index !== null) {
      switch (type) {
        case 'experience':
          setModalData({ ...resumeData.experience[index] });
          break;
        case 'education':
          setModalData({ ...resumeData.education[index] });
          break;
        case 'skills':
          setModalData({ 
            category: Object.keys(resumeData.skills)[index],
            skills: Object.values(resumeData.skills)[index].join(', ')
          });
          break;
        case 'projects':
          setModalData({ ...resumeData.projects[index] });
          break;
        default:
          setModalData({});
      }
    } else {
      setModalData({});
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType('');
    setEditingIndex(null);
    setModalData({});
  };

  const saveModal = () => {
    switch (modalType) {
      case 'experience':
        if (editingIndex !== null) {
          const newExp = [...resumeData.experience];
          newExp[editingIndex] = modalData;
          setResumeData({ ...resumeData, experience: newExp });
        } else {
          setResumeData({ ...resumeData, experience: [...resumeData.experience, modalData] });
        }
        break;
      case 'education':
        if (editingIndex !== null) {
          const newEdu = [...resumeData.education];
          newEdu[editingIndex] = modalData;
          setResumeData({ ...resumeData, education: newEdu });
        } else {
          setResumeData({ ...resumeData, education: [...resumeData.education, modalData] });
        }
        break;
      case 'skills':
        const skillsArray = modalData.skills.split(',').map(s => s.trim()).filter(s => s);
        if (editingIndex !== null) {
          const oldCategory = Object.keys(resumeData.skills)[editingIndex];
          const newSkills = { ...resumeData.skills };
          delete newSkills[oldCategory];
          newSkills[modalData.category] = skillsArray;
          setResumeData({ ...resumeData, skills: newSkills });
        } else {
          setResumeData({
            ...resumeData,
            skills: { ...resumeData.skills, [modalData.category]: skillsArray }
          });
        }
        break;
      case 'projects':
        if (editingIndex !== null) {
          const newProjects = [...resumeData.projects];
          newProjects[editingIndex] = modalData;
          setResumeData({ ...resumeData, projects: newProjects });
        } else {
          setResumeData({ ...resumeData, projects: [...resumeData.projects, modalData] });
        }
        break;
    }
    closeModal();
  };

  const deleteItem = (type, index) => {
    switch (type) {
      case 'experience':
        setResumeData({ ...resumeData, experience: resumeData.experience.filter((_, i) => i !== index) });
        break;
      case 'education':
        setResumeData({ ...resumeData, education: resumeData.education.filter((_, i) => i !== index) });
        break;
      case 'skills':
        const category = Object.keys(resumeData.skills)[index];
        const newSkills = { ...resumeData.skills };
        delete newSkills[category];
        setResumeData({ ...resumeData, skills: newSkills });
        break;
      case 'projects':
        setResumeData({ ...resumeData, projects: resumeData.projects.filter((_, i) => i !== index) });
        break;
    }
  };

  const getModalTitle = () => {
    const titles = {
      experience: editingIndex !== null ? 'Edit Work Experience' : 'Add Work Experience',
      education: editingIndex !== null ? 'Edit Education' : 'Add Education',
      skills: editingIndex !== null ? 'Edit Skill Category' : 'Add Skill Category',
      projects: editingIndex !== null ? 'Edit Project' : 'Add Project'
    };
    return titles[modalType] || 'Edit Section';
  };

  const handleDownloadPDFModal = () => {
    generatePDF(resumeData);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.fullName || 'resume'}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const jsonInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [importLoading, setImportLoading] = useState(false);

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setResumeData(data);
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleImportPDF = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportLoading(true);
      try {
        const data = await extractResumeFromPDF(file);
        setResumeData(data);
      } catch (error) {
        console.error('Error parsing PDF:', error);
        alert('Error parsing PDF file. Please try again or import a JSON file instead.');
      } finally {
        setImportLoading(false);
      }
    }
    e.target.value = '';
  };

  return (
    <div className="editor">
      <header className="editor-header">
        <div className="header-left">
          <button className="editor-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
          </button>
          <span className="resume-title">{resumeData.jobTitle || 'Untitled Resume'}</span>
          <span className="draft-status">
            <span className="draft-dot"></span>
            Draft Saved
          </span>
        </div>
        <div className="header-right">
          <input type="file" ref={jsonInputRef} onChange={handleImportJSON} accept=".json" style={{ display: 'none' }} />
          <input type="file" ref={pdfInputRef} onChange={handleImportPDF} accept=".pdf" style={{ display: 'none' }} />
          <button className="import-header-btn" onClick={() => jsonInputRef.current.click()}>
            <Upload className="btn-icon" />
            Import JSON
          </button>
          <button className="import-header-btn pdf" onClick={() => pdfInputRef.current.click()} disabled={importLoading}>
            {importLoading ? (
              <Loader2 className="btn-icon spinning" />
            ) : (
              <FileText className="btn-icon" />
            )}
            Import PDF
          </button>
          <button className="preview-btn" onClick={() => setPreviewOpen(true)}>
            <Eye className="btn-icon" />
            Preview & Download
          </button>
          <button className="download-json-btn" onClick={handleDownloadJSON}>
            <FileJson className="btn-icon" />
            Download JSON
          </button>
        </div>
      </header>

      <div className="editor-content">
        <div className="editor-form">
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="section-title">Personal Information</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={resumeData.jobTitle}
                  onChange={(e) => setResumeData({ ...resumeData, jobTitle: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="form-group full-width">
                <label>Location</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="form-group full-width">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={resumeData.linkedin}
                  onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>
              <div className="form-group full-width">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={resumeData.github}
                  onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                  placeholder="github.com/yourusername"
                />
              </div>
              <div className="form-group full-width">
                <label>Summary</label>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  placeholder="Write a brief professional summary..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="section-title">Work Experience</h3>
              <button className="add-btn" onClick={() => openModal('experience')}>
                <Plus className="add-icon" />
                Add
              </button>
            </div>
            {resumeData.experience.length === 0 && (
              <p className="empty-message">No work experience added yet. Click "Add" to get started.</p>
            )}
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-card">
                <div className="card-header">
                  <div>
                    <h4 className="company-name">{exp.company}</h4>
                    <p className="position">{exp.position}</p>
                  </div>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => openModal('experience', index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteItem('experience', index)}>Delete</button>
                  </div>
                </div>
                <div className="card-details">
                  <span>{exp.location}</span>
                  <span>{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="card-description" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>

          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3 className="section-title">Education</h3>
              <button className="add-btn" onClick={() => openModal('education')}>
                <Plus className="add-icon" />
                Add
              </button>
            </div>
            {resumeData.education.length === 0 && (
              <p className="empty-message">No education added yet. Click "Add" to get started.</p>
            )}
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-card">
                <div className="card-header">
                  <div>
                    <h4 className="school-name">{edu.school}</h4>
                    <p className="degree">{edu.degree}</p>
                  </div>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => openModal('education', index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteItem('education', index)}>Delete</button>
                  </div>
                </div>
                <div className="card-details">
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <h3 className="section-title">Skills (Categorized)</h3>
              <button className="add-btn" onClick={() => openModal('skills')}>
                <Plus className="add-icon" />
                Add Category
              </button>
            </div>
            {Object.keys(resumeData.skills).length === 0 && (
              <p className="empty-message">No skills added yet. Click "Add Category" to get started.</p>
            )}
            {Object.entries(resumeData.skills).map(([category, skills], index) => (
              <div key={category} className="skill-category-card">
                <div className="card-header">
                  <h4 className="category-name">{category}</h4>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => openModal('skills', index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteItem('skills', index)}>Delete</button>
                  </div>
                </div>
                <div className="skills-tags">
                  {skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="section-title">Projects</h3>
              <button className="add-btn" onClick={() => openModal('projects')}>
                <Plus className="add-icon" />
                Add
              </button>
            </div>
            {resumeData.projects.length === 0 && (
              <p className="empty-message">No projects added yet. Click "Add" to get started.</p>
            )}
            {resumeData.projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="card-header">
                  <h4 className="project-name">{project.name}</h4>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => openModal('projects', index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteItem('projects', index)}>Delete</button>
                  </div>
                </div>
                <p className="project-description" dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            ))}
          </div>
        </div>

        <div className="editor-preview">
          <div className="preview-header">
            <div className="style-selector">
              <span className="style-label">Style: Executive Precision</span>
              <div className="style-options">
                <span className="style-dot active"></span>
                <span className="style-dot"></span>
              </div>
            </div>
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M8 11h6" />
                </svg>
              </button>
              <span className="zoom-value">{zoom}%</span>
              <button className="zoom-btn" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M11 8v6" />
                  <path d="M8 11h6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="resume-preview">
            <div id="resume-paper" className="resume-paper" style={{ transform: `scale(${zoom / 100})` }}>
              <h1 className="resume-name">{resumeData.fullName?.toUpperCase() || 'YOUR NAME'}</h1>
              <p className="resume-title-text">{resumeData.jobTitle || 'Job Title'}</p>
              <div className="resume-contact">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.email && resumeData.phone && <span className="separator">•</span>}
                {resumeData.phone && <span>{resumeData.phone}</span>}
                {(resumeData.email || resumeData.phone) && resumeData.location && <span className="separator">•</span>}
                {resumeData.location && <span>{resumeData.location}</span>}
                {resumeData.location && resumeData.linkedin && <span className="separator">•</span>}
                {resumeData.linkedin && <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>}
                {resumeData.linkedin && resumeData.github && <span className="separator">•</span>}
                {resumeData.github && <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>}
              </div>

              {resumeData.summary && (
                <div className="resume-section">
                  <h2 className="resume-section-title">PROFESSIONAL SUMMARY</h2>
                  <p className="resume-text">{resumeData.summary}</p>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">WORK EXPERIENCE</h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="resume-experience">
                      <div className="resume-exp-header">
                        <div>
                          <h3 className="resume-company">{exp.company}</h3>
                          <p className="resume-position">{exp.position}</p>
                        </div>
                        <div className="resume-exp-meta">
                          {exp.location && <span className="resume-location">{exp.location}</span>}
                          <span className="resume-date">{exp.startDate} — {exp.endDate}</span>
                        </div>
                      </div>
                      {exp.description && (
                        <div className="resume-exp-list" dangerouslySetInnerHTML={{ __html: exp.description }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {Object.keys(resumeData.skills).length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">SKILLS</h2>
                  {Object.entries(resumeData.skills).map(([category, skills]) => (
                    <div key={category} className="resume-skill-category">
                      <strong>{category}:</strong> {skills.join(', ')}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.projects.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">KEY PROJECTS</h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="resume-project">
                      <h3 className="resume-project-name">{project.name}</h3>
                      <p className="resume-project-description" dangerouslySetInnerHTML={{ __html: project.description }} />
                    </div>
                  ))}
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">EDUCATION</h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="resume-education">
                      <h3 className="resume-school">{edu.school}</h3>
                      <p className="resume-degree">{edu.degree}</p>
                      <p className="resume-date">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{getModalTitle()}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X className="close-icon" />
              </button>
            </div>
            <div className="modal-body">
              {modalType === 'experience' && (
                <>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={modalData.company || ''}
                      onChange={(e) => setModalData({ ...modalData, company: e.target.value })}
                      placeholder="e.g. TechCorp Solutions"
                    />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={modalData.position || ''}
                      onChange={(e) => setModalData({ ...modalData, position: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={modalData.location || ''}
                        onChange={(e) => setModalData({ ...modalData, location: e.target.value })}
                        placeholder="e.g. New York, NY"
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="text"
                        value={modalData.startDate || ''}
                        onChange={(e) => setModalData({ ...modalData, startDate: e.target.value })}
                        placeholder="e.g. Jan 2020"
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="text"
                        value={modalData.endDate || ''}
                        onChange={(e) => setModalData({ ...modalData, endDate: e.target.value })}
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <RichTextEditor
                      value={modalData.description || ''}
                      onChange={(value) => setModalData({ ...modalData, description: value })}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </>
              )}

              {modalType === 'education' && (
                <>
                  <div className="form-group">
                    <label>School / University</label>
                    <input
                      type="text"
                      value={modalData.school || ''}
                      onChange={(e) => setModalData({ ...modalData, school: e.target.value })}
                      placeholder="e.g. University of California, Berkeley"
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={modalData.degree || ''}
                      onChange={(e) => setModalData({ ...modalData, degree: e.target.value })}
                      placeholder="e.g. B.S. in Computer Science"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Year</label>
                      <input
                        type="text"
                        value={modalData.startDate || ''}
                        onChange={(e) => setModalData({ ...modalData, startDate: e.target.value })}
                        placeholder="e.g. 2013"
                      />
                    </div>
                    <div className="form-group">
                      <label>End Year</label>
                      <input
                        type="text"
                        value={modalData.endDate || ''}
                        onChange={(e) => setModalData({ ...modalData, endDate: e.target.value })}
                        placeholder="e.g. 2017"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'skills' && (
                <>
                  <div className="form-group">
                    <label>Category Name</label>
                    <input
                      type="text"
                      value={modalData.category || ''}
                      onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                      placeholder="e.g. Frontend, Backend, Tools"
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills (comma separated)</label>
                    <textarea
                      value={modalData.skills || ''}
                      onChange={(e) => setModalData({ ...modalData, skills: e.target.value })}
                      placeholder="e.g. React, Next.js, TypeScript, Tailwind CSS"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {modalType === 'projects' && (
                <>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={modalData.name || ''}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                      placeholder="e.g. OpenSource UI Kit"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <RichTextEditor
                      value={modalData.description || ''}
                      onChange={(value) => setModalData({ ...modalData, description: value })}
                      placeholder="Describe the project..."
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveModal}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {previewOpen && (
        <div className="preview-modal-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2 className="preview-modal-title">Resume Preview</h2>
              <div className="preview-modal-actions">
                <button className="download-pdf-modal-btn" onClick={handleDownloadPDFModal}>
                  <Printer className="btn-icon" />
                  Download PDF
                </button>
                <button className="modal-close" onClick={() => setPreviewOpen(false)}>
                  <X className="close-icon" />
                </button>
              </div>
            </div>
            <div className="preview-modal-body">
              <div id="resume-paper-modal" className="resume-paper-preview">
                <h1 className="resume-name">{resumeData.fullName?.toUpperCase() || 'YOUR NAME'}</h1>
                <p className="resume-title-text">{resumeData.jobTitle || 'Job Title'}</p>
                <div className="resume-contact">
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.email && resumeData.phone && <span className="separator">•</span>}
                  {resumeData.phone && <span>{resumeData.phone}</span>}
                  {(resumeData.email || resumeData.phone) && resumeData.location && <span className="separator">•</span>}
                  {resumeData.location && <span>{resumeData.location}</span>}
                  {resumeData.location && resumeData.linkedin && <span className="separator">•</span>}
                  {resumeData.linkedin && <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>}
                  {resumeData.linkedin && resumeData.github && <span className="separator">•</span>}
                  {resumeData.github && <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>}
                </div>

                {resumeData.summary && resumeData.summary.trim() && (
                  <div className="resume-section">
                    <h2 className="resume-section-title">PROFESSIONAL SUMMARY</h2>
                    <p className="resume-text">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experience?.length > 0 && (
                  <div className="resume-section">
                    <h2 className="resume-section-title">WORK EXPERIENCE</h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="resume-experience">
                        <div className="resume-exp-header">
                          <div>
                            <h3 className="resume-company">{exp.company}</h3>
                            <p className="resume-position">{exp.position}</p>
                          </div>
                          <div className="resume-exp-meta">
                            {exp.location && <span className="resume-location">{exp.location}</span>}
                            <span className="resume-date">{exp.startDate} — {exp.endDate}</span>
                          </div>
                        </div>
                        {exp.description && (
                          <div className="resume-list" dangerouslySetInnerHTML={{ __html: exp.description }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {Object.keys(resumeData.skills || {}).length > 0 && (
                  <div className="resume-section">
                    <h2 className="resume-section-title">SKILLS</h2>
                    {Object.entries(resumeData.skills).map(([category, skills]) => (
                      <div key={category} className="resume-skill-category">
                        <strong>{category}:</strong> {skills.join(', ')}
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.projects?.length > 0 && (
                  <div className="resume-section">
                    <h2 className="resume-section-title">KEY PROJECTS</h2>
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="resume-project">
                        <h3 className="resume-project-name">{project.name}</h3>
                        <p className="resume-project-description" dangerouslySetInnerHTML={{ __html: project.description }} />
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education?.length > 0 && (
                  <div className="resume-section">
                    <h2 className="resume-section-title">EDUCATION</h2>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="resume-education">
                        <h3 className="resume-school">{edu.school}</h3>
                        <p className="resume-degree">{edu.degree}</p>
                        <p className="resume-date">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;
