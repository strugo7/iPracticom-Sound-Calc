/**
 * strings.ts — iPracticom Sound Calc & Topology
 * כל מחרוזות ה-UI בעברית מרוכזות כאן.
 * אין לכתוב טקסט עברי ישירות בתוך קומפוננטות JSX.
 * שימוש: import { S } from '../strings';
 */

export const S = {

    // ─── ניווט תחתון ─────────────────────────────────────────────────────────
    nav: {
        calculator: 'מחשבון',
        topology: 'טופולוגיה',
        catalog: 'קטלוג',
    },

    // ─── מסך מחשבון אוהם ──────────────────────────────────────────────────────
    calculator: {
        screenTitle: 'מחשבון חוק אוהם',
        solveFor: 'חשב:',
        inputPlaceholder: 'הכנס ערך',
        resultLabel: 'תוצאה:',
        resultEmpty: '—',
        unitWatts: 'W',
        unitVolts: 'V',
        unitAmps: 'A',
        unitOhms: 'Ω',

        // כרטיסי פרמטרים
        power: 'הספק (W)',
        voltage: 'מתח (V)',
        current: 'זרם (A)',
        resistance: 'התנגדות (Ω)',

        // שגיאות קלט
        errorZero: 'הערך חייב להיות גדול מאפס',
        errorInvalid: 'ערך לא תקין',
        errorTwoInputsRequired: 'יש להזין שני ערכים לפחות',

        // כפתורי נוסחה
        formulaA: 'נוסחה א׳',
        formulaB: 'נוסחה ב׳',
        formulaC: 'נוסחה ג׳',

        // טבלת נוסחאות (tooltip / מצב עזרה)
        formulaTableTitle: 'טבלת 12 נוסחאות חוק אוהם',
        clearButton: 'נקה',
    },

    // ─── מסך טופולוגיה ────────────────────────────────────────────────────────
    topology: {
        screenTitle: 'בניית מערכת',
        emptyState: 'השרשרת ריקה — לחץ + להוספת רכיב',
        addNodeButton: '+ הוסף רכיב',
        removeNode: 'הסר',
        saveButton: 'שמור',
        clearButton: 'נקה הכל',
        clearConfirm: 'לנקות את כל השרשרת?',
        confirmYes: 'כן, נקה',
        confirmNo: 'ביטול',

        // סוגי צמתים
        nodeTypes: {
            source: 'מקור',
            mixer: 'מיקסר',
            matrix: 'מטריצה',
            amplifier: 'מגבר',
            speakerGroup: 'קבוצת רמקולים',
        },

        // חיווט רמקולים
        wiringLabel: 'חיווט:',
        wiringSeries: 'טור',
        wiringParallel: 'מקביל',
        quantityLabel: 'כמות רמקולים:',

        // שגיאות סדר שרשרת
        errorSourceFirst: 'יש להוסיף מקור כרכיב ראשון',
        errorOneAmpOnly: 'ניתן להוסיף מגבר אחד בלבד לשרשרת',
        errorAmpBeforeSpeakers: 'יש להוסיף מגבר לפני קבוצת רמקולים',
        errorRouterAfterSource: 'מיקסר/מטריצה חייבים לבוא אחרי המקור',

        // Snackbar
        snackInvalidOrder: 'לא ניתן להוסיף רכיב זה בשלב זה',
        snackSaved: 'הטופולוגיה נשמרה',
    },

    // ─── מודל הוספת צומת ─────────────────────────────────────────────────────
    addNodeModal: {
        title: 'הוסף רכיב',
        selectType: 'בחר סוג רכיב',
        selectProduct: 'בחר מוצר',
        searchPlaceholder: 'חיפוש...',
        noResults: 'לא נמצאו תוצאות',
        addButton: 'הוסף לשרשרת',
        cancelButton: 'ביטול',
    },

    // ─── ולידציה ──────────────────────────────────────────────────────────────
    validation: {
        sectionTitle: 'בדיקת תקינות',
        impedanceCheck: 'עכבה',
        powerCheck: 'הספק',
        lineVoltageCheck: 'מתח קו',
        statusOk: '✓',
        statusFail: '✗',
        notEnoughNodes: 'הוסף מגבר ורמקולים לביצוע בדיקה',

        // תוצאות מפורטות
        impedanceActual: 'עכבה מחושבת',
        impedanceMin: 'מינימום מגבר',
        powerRequired: 'הספק נדרש',
        powerAvailable: 'הספק זמין',

        // הודעות שגיאה (מופיעות ב-errors[])
        errorImpedanceTooLow:
            'עכבת הרמקולים נמוכה מהמינימום של המגבר — סכנת נזק!',
        errorPowerExceeded:
            'הספק הרמקולים עולה על כושר המגבר — יש להפחית רמקולים או להחליף מגבר',
        errorLineVoltageMismatch:
            'לרמקול יש שנאי קו — ודא שהמגבר תומך ב-70V/100V',
    },

    // ─── מסך קטלוג ────────────────────────────────────────────────────────────
    catalog: {
        screenTitle: 'קטלוג מוצרים',
        searchPlaceholder: 'חיפוש לפי שם או דגם...',
        noResults: 'לא נמצאו מוצרים',
        allCategories: 'הכל',

        // כותרות קטגוריות
        categories: {
            players: 'נגנים',
            mixers: 'מיקסרים',
            matrices: 'מטריצות',
            amplifiers: 'מגברים',
            speakers: 'רמקולים',
        },

        // גיליון פרטי מוצר
        detailSheet: {
            manufacturer: 'יצרן',
            model: 'דגם',
            outputType: 'סוג יציאה',
            outputVoltage: 'מתח יציאה',
            channels: 'ערוצים',
            powerPerChannel: 'הספק לערוץ',
            minImpedance: 'עכבה מינימלית',
            totalPower: 'הספק כולל',
            supports70V: 'תמיכה 70V',
            supports100V: 'תמיכה 100V',
            dsp: 'DSP מובנה',
            powerRating: 'הספק רמקול',
            impedance: 'עכבה',
            hasTransformer: 'שנאי קו',
            transformerTaps: 'ברזים זמינים',
            inputs: 'כניסות',
            outputs: 'יציאות',
            zones: 'אזורים',
            yes: 'כן',
            no: 'לא',
            closeButton: 'סגור',
        },
    },

    // ─── כללי ─────────────────────────────────────────────────────────────────
    general: {
        appName: 'iPracticom Calc',
        loading: 'טוען...',
        error: 'שגיאה',
        retry: 'נסה שוב',
        ok: 'אישור',
        cancel: 'ביטול',
        save: 'שמור',
        delete: 'מחק',
        edit: 'עריכה',
        close: 'סגור',
        back: 'חזרה',
        unknown: 'לא ידוע',
        notAvailable: 'לא זמין',
    },

    // ─── נגישות (accessibilityLabel) ─────────────────────────────────────────
    a11y: {
        removeNodeButton: 'הסר רכיב מהשרשרת',
        addNodeButton: 'הוסף רכיב לשרשרת',
        statusBadgeOk: 'בדיקה תקינה',
        statusBadgeFail: 'בדיקה נכשלה',
        searchInput: 'שדה חיפוש',
        quantityIncrement: 'הוסף רמקול',
        quantityDecrement: 'הסר רמקול',
        catalogItemDetail: 'פתח פרטי מוצר',
    },

} as const;

// טיפוס עזר — מאפשר autocomplete בכל מקום בקוד
export type StringKeys = typeof S;
