const QRCode = require('qrcode');

const DEFAULT_OPTIONS = {
  format: 'png',
  size: 300,
  margin: 4,
  errorCorrectionLevel: 'M',
};

function normalizeOptions(options = {}) {
  const format = String(options.format || DEFAULT_OPTIONS.format).toLowerCase();
  const size = Number(options.size || DEFAULT_OPTIONS.size);
  const margin = Number(options.margin ?? DEFAULT_OPTIONS.margin);
  const errorCorrectionLevel = String(options.errorCorrectionLevel || DEFAULT_OPTIONS.errorCorrectionLevel).toUpperCase();

  if (!['png', 'svg'].includes(format)) {
    throw new Error('Format invalide. Choisissez "png" ou "svg".');
  }
  if (!Number.isFinite(size) || size < 64 || size > 2000) {
    throw new Error('Taille invalide. Utilisez une valeur entre 64 et 2000.');
  }
  if (!Number.isFinite(margin) || margin < 0 || margin > 50) {
    throw new Error('Marge invalide. Utilisez une valeur entre 0 et 50.');
  }
  if (!['L', 'M', 'Q', 'H'].includes(errorCorrectionLevel)) {
    throw new Error('Niveau de correction invalide. Utilisez L, M, Q ou H.');
  }

  return {
    format,
    size,
    margin,
    errorCorrectionLevel,
  };
}

function normalizePayload(body) {
  if (body == null || typeof body !== 'object') {
    throw new Error('Le corps de la requête doit être un objet JSON.');
  }

  const { data, url, json } = body;
  if (json !== undefined) {
    try {
      return JSON.stringify(json);
    } catch (err) {
      throw new Error('Le champ "json" doit être un objet JSON valide.');
    }
  }

  const raw = data ?? url;
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error('Le champ "data" ou "url" est requis et doit être une chaîne non vide.');
  }

  return raw.trim();
}

async function generateQRCode(payload, options = {}) {
  const normalizedPayload = normalizePayload(payload);
  const normalizedOptions = normalizeOptions(options);

  const qrcodeOptions = {
    errorCorrectionLevel: normalizedOptions.errorCorrectionLevel,
    margin: normalizedOptions.margin,
    width: normalizedOptions.size,
  };

  if (normalizedOptions.format === 'svg') {
    return {
      mimeType: 'image/svg+xml',
      data: await QRCode.toString(normalizedPayload, {
        ...qrcodeOptions,
        type: 'svg',
      }),
    };
  }

  const buffer = await QRCode.toBuffer(normalizedPayload, {
    ...qrcodeOptions,
    type: 'png',
  });

  return {
    mimeType: 'image/png',
    data: buffer,
  };
}

module.exports = {
  generateQRCode,
};
