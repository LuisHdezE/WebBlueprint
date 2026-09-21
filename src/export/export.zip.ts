import type { ExportProjectFile } from '@/export/export.types';

const encoder = new TextEncoder();
const dosEpochDate = 0x21;

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value >>> 0, true);
}

function concatBytes(parts: readonly Uint8Array[]) {
  const size = parts.reduce((total, part) => total + part.byteLength, 0);
  const output = new Uint8Array(size);
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }

  return output;
}

function validatePath(path: string) {
  const normalized = path.replaceAll('\\', '/');
  if (!normalized || normalized.startsWith('/') || normalized.split('/').includes('..')) {
    throw new Error(`Unsafe export path: ${path}`);
  }
  return normalized;
}

export function createStoredZip(files: readonly ExportProjectFile[]) {
  const normalizedFiles = files
    .map((file) => ({ ...file, path: validatePath(file.path) }))
    .sort((left, right) => left.path.localeCompare(right.path));

  if (new Set(normalizedFiles.map((file) => file.path)).size !== normalizedFiles.length) {
    throw new Error('Export project contains duplicate file paths.');
  }

  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let localOffset = 0;

  for (const file of normalizedFiles) {
    const nameBytes = encoder.encode(file.path);
    const contentBytes = encoder.encode(file.content);
    const checksum = crc32(contentBytes);

    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 0);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, 0);
    writeUint16(localView, 12, dosEpochDate);
    writeUint32(localView, 14, checksum);
    writeUint32(localView, 18, contentBytes.byteLength);
    writeUint32(localView, 22, contentBytes.byteLength);
    writeUint16(localView, 26, nameBytes.byteLength);
    writeUint16(localView, 28, 0);

    localParts.push(localHeader, nameBytes, contentBytes);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, 0);
    writeUint16(centralView, 14, dosEpochDate);
    writeUint32(centralView, 16, checksum);
    writeUint32(centralView, 20, contentBytes.byteLength);
    writeUint32(centralView, 24, contentBytes.byteLength);
    writeUint16(centralView, 28, nameBytes.byteLength);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, localOffset);

    centralParts.push(centralHeader, nameBytes);
    localOffset += localHeader.byteLength + nameBytes.byteLength + contentBytes.byteLength;
  }

  const localSection = concatBytes(localParts);
  const centralSection = concatBytes(centralParts);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, normalizedFiles.length);
  writeUint16(endView, 10, normalizedFiles.length);
  writeUint32(endView, 12, centralSection.byteLength);
  writeUint32(endView, 16, localSection.byteLength);
  writeUint16(endView, 20, 0);

  return concatBytes([localSection, centralSection, end]);
}
