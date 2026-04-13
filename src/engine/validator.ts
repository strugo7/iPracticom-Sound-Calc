import { ValidationResult, ChainNode, Catalog, Amplifier, Speaker } from '../types/catalog';
import { seriesImpedance, parallelImpedance } from './impedance';

// תוקף - בדיקת עכבה והספק בשרשרת אות
// משתמש בנתונים סטטיים מהקטלוג

export const validateChain = (
  chain: ChainNode[],
  catalog: Catalog
): ValidationResult => {
  const result: ValidationResult = {
    impedanceOk: false,
    powerOk: false,
    lineVoltageOk: true, // ברירת מחדל - תקין אם אין שנאי
    impedanceActual: 0,
    impedanceMin: 0,
    powerRequired: 0,
    powerAvailable: 0,
    lineVoltageRequired: false,
    errors: [],
  };

  // בדיקה אם בשרשרת יש source ו-amplifier ו-speaker_group
  const source = chain.find(n => n.type === 'source');
  const amplifierNode = chain.find(n => n.type === 'amplifier');
  const speakerGroup = chain.find(n => n.type === 'speaker_group');

  if (!source || !amplifierNode || !speakerGroup) {
    result.errors.push('שרשרת חייבת להיות בעלת source, amplifier ו-speaker group');
    return result;
  }

  // קבל את האמפליפיקטור מהקטלוג
  const amplifier = catalog.amplifiers.find(a => a.id === amplifierNode.productId);
  if (!amplifier) {
    result.errors.push('אמפליפיקטור לא נמצא בקטלוג');
    return result;
  }

  result.impedanceMin = amplifier.minImpedance;
  result.powerAvailable = amplifier.powerPerChannel;

  // חשב עכבה של רמקולים
  const speaker = catalog.speakers.find(s => s.id === speakerGroup.productId);
  if (!speaker) {
    result.errors.push('רמקול לא נמצא בקטלוג');
    return result;
  }

  const quantity = speakerGroup.quantity || 1;
  const wiring = speakerGroup.wiring || 'series';

  // בנה מערך של עכבות לכמות הרמקולים
  const speakerImpedances = Array(quantity).fill(speaker.impedance);

  if (wiring === 'series') {
    result.impedanceActual = seriesImpedance(speakerImpedances);
  } else if (wiring === 'parallel') {
    result.impedanceActual = parallelImpedance(speakerImpedances);
  }

  // בדיקת עכבה
  if (result.impedanceActual >= result.impedanceMin) {
    result.impedanceOk = true;
  } else {
    result.errors.push(
      `עכבה מחושבת (${result.impedanceActual.toFixed(1)}Ω) נמוכה מן המינימום (${result.impedanceMin}Ω)`
    );
  }

  // חשב הספק נדרש
  result.powerRequired = speaker.powerRating * quantity;

  // בדיקת הספק
  if (result.powerRequired <= result.powerAvailable) {
    result.powerOk = true;
  } else {
    result.errors.push(
      `הספק נדרש (${result.powerRequired}W) גדול מן הזמין (${result.powerAvailable}W בערוץ)`
    );
  }

  // בדיקת תמיכה 70V/100V עבור שנאים
  if (speaker.hasLineTransformer) {
    result.lineVoltageRequired = true;
    const has70V = amplifier.supports70V;
    const has100V = amplifier.supports100V;

    if (has70V || has100V) {
      result.lineVoltageOk = true;
    } else {
      result.lineVoltageOk = false;
      result.errors.push('האמפליפיקטור אינו תומך בשנאים של קו (70V/100V)');
    }
  }

  return result;
};
