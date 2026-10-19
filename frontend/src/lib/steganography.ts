/**
 * Sakhi Steganography Engine
 * Implements LSB (Least Significant Bit) steganography on image canvas pixels.
 * Compatible with Sakhi's 16-bit end marker: "1111111111111110".
 */

export interface SteganographyPayload {
  version: string;
  timestamp: string;
  caseId?: string;
  name?: string;
  phone?: string;
  location?: { lat: number; lng: number; address?: string };
  severity?: 'Low' | 'Medium' | 'High' | 'Very High';
  situation?: string;
  culprit?: string;
  preferredContact?: string[];
  rawText?: string;
}

const END_MARKER = '1111111111111110';

/**
 * Converts a UTF-8 string to a binary bitstring.
 */
function textToBinary(text: string): string {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Support ASCII/UTF-8 byte conversion
    const binStr = charCode.toString(2).padStart(8, '0');
    binary += binStr;
  }
  return binary + END_MARKER;
}

/**
 * Encodes text into an HTML5 Canvas and returns a PNG Data URL.
 */
export function encodeTextToImageData(
  img: HTMLImageElement,
  text: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data; // [r, g, b, a, r, g, b, a, ...]

  const binaryText = textToBinary(text);
  let bitIndex = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (bitIndex < binaryText.length) {
      const bit = parseInt(binaryText[bitIndex], 10);
      // Modify LSB of Red channel
      data[i] = (data[i] & ~1) | bit;
      bitIndex++;
    } else {
      break;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Decodes hidden text from an HTML5 Canvas or Image.
 */
export function decodeTextFromImageElement(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let binaryText = '';
  const markerLength = END_MARKER.length;

  for (let i = 0; i < data.length; i += 4) {
    const lsb = data[i] & 1;
    binaryText += lsb.toString();

    // Check if end marker reached
    if (
      binaryText.length >= markerLength &&
      binaryText.endsWith(END_MARKER)
    ) {
      const payloadBits = binaryText.slice(0, -markerLength);
      let decoded = '';
      for (let b = 0; b < payloadBits.length; b += 8) {
        const byteStr = payloadBits.substr(b, 8);
        if (byteStr.length === 8) {
          decoded += String.fromCharCode(parseInt(byteStr, 2));
        }
      }
      return decoded;
    }
  }

  return '';
}

/**
 * Helper to encode structured incident data into JSON payload.
 */
export function buildPayloadString(data: SteganographyPayload): string {
  return `HAVEN_SOS::${JSON.stringify(data)}`;
}

/**
 * Helper to parse decoded text into structured incident data or raw format.
 */
export function parseDecodedMessage(decoded: string): SteganographyPayload | null {
  if (!decoded || !decoded.trim()) return null;

  if (decoded.startsWith('HAVEN_SOS::')) {
    try {
      const jsonStr = decoded.replace('HAVEN_SOS::', '');
      return JSON.parse(jsonStr) as SteganographyPayload;
    } catch {
      return {
        version: '1.0',
        timestamp: new Date().toISOString(),
        rawText: decoded,
      };
    }
  }

  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    rawText: decoded,
    situation: decoded,
  };
}
