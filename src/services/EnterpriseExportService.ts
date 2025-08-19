import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'pptx' | 'html' | 'json';
  title: string;
  content: string;
  analytics?: any;
  includeCharts?: boolean;
  includeImages?: boolean;
  customStyling?: boolean;
}

class EnterpriseExportService {
  
  // Export to PDF with professional formatting
  async exportToPDF(options: ExportOptions): Promise<void> {
    try {
      const { title, content, analytics } = options;
      
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set up professional styling
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add company header with gradient effect
      pdf.setFillColor(59, 130, 246); // Primary blue
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      // Add logo space and title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ENTERPRISE REPORT', margin, 20);
      
      // Add generation date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 80, 25);

      yPosition = 50;

      // Add executive summary box
      pdf.setFillColor(248, 250, 252); // Light gray background
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30);

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 5, yPosition + 10);

      // Add analytics summary if available
      if (analytics) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const summaryText = `Projects: ${analytics.totalProjects || 0} | Sites: ${analytics.totalSites || 0} | Completion: ${analytics.avgProgress || 0}%`;
        pdf.text(summaryText, margin + 5, yPosition + 20);
      }

      yPosition += 40;

      // Process content with rich formatting
      const processedContent = this.processContentForPDF(content);
      const lines = pdf.splitTextToSize(processedContent, pageWidth - 2 * margin);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      }

      // Add footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
        pdf.text('Confidential & Proprietary', margin, pageHeight - 10);
      }

      // Save the PDF
      pdf.save(`${this.sanitizeFilename(title)}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export PDF');
    }
  }

  // Export to Word document
  async exportToWord(options: ExportOptions): Promise<void> {
    try {
      const { title, content, analytics } = options;

      // Create Word document structure
      const documentXml = this.createWordDocumentXml(title, content, analytics);
      
      // Create zip file for .docx
      const zip = new PizZip();
      
      // Add required files for .docx format
      zip.file('[Content_Types].xml', this.getContentTypesXml());
      zip.file('_rels/.rels', this.getRelationshipsXml());
      zip.file('word/_rels/document.xml.rels', this.getDocumentRelationshipsXml());
      zip.file('word/document.xml', documentXml);
      zip.file('word/styles.xml', this.getStylesXml());
      zip.file('word/settings.xml', this.getSettingsXml());
      zip.file('word/fontTable.xml', this.getFontTableXml());
      
      // Generate and save
      const blob = zip.generate({ type: 'blob' });
      saveAs(blob, `${this.sanitizeFilename(title)}_${new Date().toISOString().slice(0, 10)}.docx`);
      
    } catch (error) {
      console.error('Error exporting to Word:', error);
      throw new Error('Failed to export Word document');
    }
  }

  // Export to PowerPoint
  async exportToPowerPoint(options: ExportOptions): Promise<void> {
    try {
      const { title, content, analytics } = options;

      // Create PowerPoint structure
      const slides = this.createPowerPointSlides(title, content, analytics);
      
      // For now, export as HTML that can be opened in PowerPoint
      const htmlContent = this.createPowerPointHTML(slides);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      saveAs(blob, `${this.sanitizeFilename(title)}_presentation_${new Date().toISOString().slice(0, 10)}.html`);
      
    } catch (error) {
      console.error('Error exporting to PowerPoint:', error);
      throw new Error('Failed to export PowerPoint presentation');
    }
  }

  // Export to enhanced HTML
  async exportToHTML(options: ExportOptions): Promise<void> {
    try {
      const { title, content, analytics } = options;
      
      const htmlContent = this.createEnhancedHTML(title, content, analytics);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      saveAs(blob, `${this.sanitizeFilename(title)}_${new Date().toISOString().slice(0, 10)}.html`);
      
    } catch (error) {
      console.error('Error exporting to HTML:', error);
      throw new Error('Failed to export HTML');
    }
  }

  // Export to JSON with metadata
  async exportToJSON(options: ExportOptions): Promise<void> {
    try {
      const exportData = {
        metadata: {
          title: options.title,
          generatedAt: new Date().toISOString(),
          format: 'enterprise-report-v1.0',
          analytics: options.analytics
        },
        content: options.content,
        exportOptions: options
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      saveAs(blob, `${this.sanitizeFilename(options.title)}_data_${new Date().toISOString().slice(0, 10)}.json`);
      
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export JSON');
    }
  }

  // Capture element as image for reports
  async captureElementAsImage(elementId: string): Promise<string> {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing element:', error);
      throw new Error('Failed to capture element');
    }
  }

  // Helper methods
  private processContentForPDF(content: string): string {
    return content
      .replace(/# (.*)/g, '\n$1\n' + '='.repeat(50))
      .replace(/## (.*)/g, '\n$1\n' + '-'.repeat(30))
      .replace(/### (.*)/g, '\n$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[\s\S]*?```/g, '[CODE BLOCK]')
      .replace(/\|.*\|/g, '[TABLE ROW]');
  }

  private createWordDocumentXml(title: string, content: string, analytics?: any): string {
    const processedContent = content
      .replace(/# (.*)/g, '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>$1</w:t></w:r></w:p>')
      .replace(/## (.*)/g, '<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>$1</w:t></w:r></w:p>')
      .replace(/\*\*(.*?)\*\*/g, '<w:r><w:rPr><w:b/></w:rPr><w:t>$1</w:t></w:r>')
      .replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:pStyle w:val="Title"/></w:pPr>
      <w:r><w:t>${title}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Generated: ${new Date().toLocaleString()}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>${processedContent}</w:t></w:r></w:p>
  </w:body>
</w:document>`;
  }

  private createEnhancedHTML(title: string, content: string, analytics?: any): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .report-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 2.5em;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .content {
      padding: 40px;
    }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; border-left: 4px solid #2563eb; padding-left: 15px; }
    .analytics-summary {
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border-left: 5px solid #2563eb;
    }
    pre {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #2563eb;
      overflow-x: auto;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <h1>${title}</h1>
      <p>Enterprise Network Access Control Report</p>
      <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    <div class="content">
      ${analytics ? `
      <div class="analytics-summary">
        <h3>Executive Summary</h3>
        <p><strong>Total Projects:</strong> ${analytics.totalProjects || 0}</p>
        <p><strong>Total Sites:</strong> ${analytics.totalSites || 0}</p>
        <p><strong>Average Progress:</strong> ${analytics.avgProgress || 0}%</p>
      </div>
      ` : ''}
      ${this.processContentForHTML(content)}
    </div>
    <div class="footer">
      <p>Confidential & Proprietary | Enterprise Network Management System</p>
    </div>
  </div>
</body>
</html>`;
  }

  private processContentForHTML(content: string): string {
    return content
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  }

  private createPowerPointSlides(title: string, content: string, analytics?: any): any[] {
    const slides = [
      {
        title: title,
        type: 'title',
        content: `Enterprise Network Access Control Report\nGenerated: ${new Date().toLocaleDateString()}`
      }
    ];

    if (analytics) {
      slides.push({
        title: 'Executive Summary',
        type: 'content',
        content: `Total Projects: ${analytics.totalProjects || 0}\nTotal Sites: ${analytics.totalSites || 0}\nAverage Progress: ${analytics.avgProgress || 0}%`
      });
    }

    // Split content into slides
    const sections = content.split(/# /);
    sections.forEach((section, index) => {
      if (section.trim() && index > 0) {
        const lines = section.split('\n');
        const slideTitle = lines[0] || `Slide ${index}`;
        const slideContent = lines.slice(1).join('\n');
        
        slides.push({
          title: slideTitle,
          type: 'content',
          content: slideContent
        });
      }
    });

    return slides;
  }

  private createPowerPointHTML(slides: any[]): string {
    const slideHTML = slides.map((slide, index) => `
      <div class="slide" data-slide="${index + 1}">
        <div class="slide-header">
          <h1>${slide.title}</h1>
        </div>
        <div class="slide-content">
          <pre>${slide.content}</pre>
        </div>
        <div class="slide-footer">
          <span>Slide ${index + 1} of ${slides.length}</span>
        </div>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <title>Enterprise Presentation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; }
    .slide {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      page-break-after: always;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .slide-header {
      background: rgba(0,0,0,0.2);
      padding: 40px;
      text-align: center;
    }
    .slide-header h1 {
      margin: 0;
      font-size: 3em;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .slide-content {
      flex: 1;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slide-content pre {
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 10px;
      font-size: 1.5em;
      line-height: 1.6;
      max-width: 80%;
    }
    .slide-footer {
      padding: 20px;
      text-align: center;
      background: rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  ${slideHTML}
</body>
</html>`;
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  // Helper XML templates for Word export
  private getContentTypesXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
</Types>`;
  }

  private getRelationshipsXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  }

  private getDocumentRelationshipsXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`;
  }

  private getStylesXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:rPr><w:sz w:val="32"/><w:b/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:rPr><w:sz w:val="24"/><w:b/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="Heading 2"/>
    <w:rPr><w:sz w:val="20"/><w:b/></w:rPr>
  </w:style>
</w:styles>`;
  }

  private getSettingsXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>`;
  }

  private getFontTableXml(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:font w:name="Calibri">
    <w:panose1 w:val="020F0502020204030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
  </w:font>
</w:fonts>`;
  }
}

export const exportService = new EnterpriseExportService();