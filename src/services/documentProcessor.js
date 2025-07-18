import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class DocumentProcessor {
  constructor() {
    this.supportedFormats = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain',
      'text/csv'
    ];
  }

  isSupported(file) {
    return this.supportedFormats.includes(file.type) || 
           file.name.endsWith('.txt') || 
           file.name.endsWith('.csv') ||
           file.name.endsWith('.docx') ||
           file.name.endsWith('.doc') ||
           file.name.endsWith('.pdf');
  }

  async processFile(file) {
    if (!this.isSupported(file)) {
      throw new Error(`Unsupported file format: ${file.type || 'unknown'}`);
    }

    try {
      let text = '';
      let metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        processedAt: new Date().toISOString()
      };

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const result = await this.processPDF(file);
        text = result.text;
        metadata = { ...metadata, ...result.metadata };
      } else if (file.type.includes('wordprocessingml') || file.name.endsWith('.docx')) {
        const result = await this.processWordDoc(file);
        text = result.text;
        metadata = { ...metadata, ...result.metadata };
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await this.processTextFile(file);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        text = await this.processCSVFile(file);
      } else {
        throw new Error('File format not yet supported');
      }

      return {
        text: this.cleanText(text),
        metadata,
        wordCount: this.countWords(text),
        estimatedReadingTime: this.estimateReadingTime(text)
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  async processPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const pageTexts = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        pageTexts.push(pageText);
        fullText += pageText + '\n\n';
      }

      return {
        text: fullText,
        metadata: {
          pageCount: pdf.numPages,
          pages: pageTexts,
          extractionMethod: 'pdf.js'
        }
      };
    } catch (error) {
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  }

  async processWordDoc(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (result.messages && result.messages.length > 0) {
        console.warn('Word document processing warnings:', result.messages);
      }

      return {
        text: result.value,
        metadata: {
          extractionMethod: 'mammoth',
          warnings: result.messages || []
        }
      };
    } catch (error) {
      throw new Error(`Word document processing failed: ${error.message}`);
    }
  }

  async processTextFile(file) {
    try {
      return await file.text();
    } catch (error) {
      throw new Error(`Text file processing failed: ${error.message}`);
    }
  }

  async processCSVFile(file) {
    try {
      const text = await file.text();
      // Convert CSV to readable text format
      const lines = text.split('\n');
      const headers = lines[0]?.split(',') || [];
      
      let formattedText = `Document contains ${lines.length - 1} entries with the following fields: ${headers.join(', ')}\n\n`;
      
      // Add sample entries for context
      for (let i = 1; i < Math.min(11, lines.length); i++) {
        const values = lines[i]?.split(',') || [];
        formattedText += `Entry ${i}:\n`;
        headers.forEach((header, index) => {
          formattedText += `${header}: ${values[index] || 'N/A'}\n`;
        });
        formattedText += '\n';
      }

      if (lines.length > 11) {
        formattedText += `... and ${lines.length - 11} more entries`;
      }

      return formattedText;
    } catch (error) {
      throw new Error(`CSV file processing failed: ${error.message}`);
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .trim();
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  estimateReadingTime(text) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.countWords(text);
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  getFilePreview(text, maxLength = 500) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  extractKeyTopics(text, count = 5) {
    // Simple keyword extraction - in a real app you might use more sophisticated NLP
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Filter out common words
    const commonWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'would', 'there', 'could', 'other'];
    
    const filtered = Object.entries(frequency)
      .filter(([word]) => !commonWords.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word]) => word);

    return filtered;
  }

  validateFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`);
    }
    return true;
  }

  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeFormatted: this.formatFileSize(file.size),
      isSupported: this.isSupported(file)
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const documentProcessor = new DocumentProcessor();
export default documentProcessor;
