const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

/**
 * Extract text from a buffer based on file mimetype or extension
 */
async function extractTextFromBuffer(buffer, mimetype, originalname) {
  const ext = path.extname(originalname || "").toLowerCase();

  const isPDF =
    mimetype === "application/pdf" ||
    ext === ".pdf";

  const isDOCX =
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword" ||
    ext === ".docx" ||
    ext === ".doc";

  if (isPDF) {
    try {
      const data = await pdfParse(buffer);
      if (!data.text || data.text.trim().length < 20) {
        throw new Error("PDF appears to be empty or image-only. Please use a text-based PDF.");
      }
      return data.text;
    } catch (err) {
      throw new Error(`PDF parsing failed: ${err.message}`);
    }
  }

  if (isDOCX) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (!result.value || result.value.trim().length < 20) {
        throw new Error("DOC/DOCX appears to be empty.");
      }
      return result.value;
    } catch (err) {
      throw new Error(`DOC/DOCX parsing failed: ${err.message}`);
    }
  }

  // Plain text fallback
  if (mimetype === "text/plain" || ext === ".txt") {
    return buffer.toString("utf-8");
  }

  throw new Error(`Unsupported file type: ${mimetype || ext}. Please upload PDF, DOC, DOCX, or TXT.`);
}

module.exports = { extractTextFromBuffer };