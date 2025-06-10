import { marked } from 'marked';
import htmlToDocx from 'html-to-docx';
import { saveAs } from 'file-saver';

export const downloadTextFile = (filename: string, text: string): void => {
  const element = document.createElement("a");
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.txt`;
  document.body.appendChild(element); 
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

export const downloadMarkdownFile = (filename: string, markdown: string): void => {
  const element = document.createElement("a");
  const file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

export const downloadDocxFile = async (filename: string, markdownContent: string): Promise<void> => {
  const htmlContent = marked.parse(markdownContent) as string;
  
  const fileBuffer = await htmlToDocx(htmlContent, undefined, {
    orientation: 'portrait',
    margins: {
      top: 720, // 1 inch in twentieths of a point
      right: 720,
      bottom: 720,
      left: 720,
    }
  });

  saveAs(fileBuffer, `${filename}.docx`);
};
