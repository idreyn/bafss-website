import { GoogleSpreadsheet } from 'google-spreadsheet';

const helpFields = {
    labor: {
        three_dee_printing: '3D printing',
        assembly: 'Assembly',
        transport: 'Transport',
    },
    materials: {
        poly_sheets: 'poly sheets',
        elastic_bands: 'elastic bands',
        pla_filament: 'PLA filament',
        super_glue: 'super glue',
        rubbing_alcohol: 'rubbing alcohol',
    },
    tools: {
        hole_punch: 'hole punch',
        razor_blade_etc: 'razor blade',
        safety_mask: 'safety masks for mask assembly',
    },
    funding: {
        money: 'Money',
    },
};

const getSpreadsheetRows = async () => {
    const doc = new GoogleSpreadsheet(process.env.RESPONSES_SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    console.log(doc.title);
    const [sheet] = doc.sheetsByIndex;
    return sheet.getRows();
};

const matchCaseInsensitive = (needle, haystack) =>
    haystack.toLowerCase().includes(needle.toLowerCase());

const normalizeOffers = (
    offersFieldValue,
    matcher = helpFields,
    matchInto = 'object'
) => {
    if (matchInto === 'array') {
        return Object.entries(matcher).reduce((included, [key, testString]) => {
            if (matchCaseInsensitive(testString, offersFieldValue)) {
                return [...included, key];
            }
            return included;
        }, []);
    } else if (matchInto === 'object') {
        const res = {};
        Object.entries(matcher).forEach(([key, value]) => {
            if (value && typeof value === 'object') {
                res[key] = normalizeOffers(offersFieldValue, value, 'array');
            } else if (typeof value === 'string') {
                res[key] = matchCaseInsensitive(value, offersFieldValue);
            } else {
                console.warn(
                    `Ignoring unmatched helper field matcher ${value}`
                );
            }
        });
        return res;
    }
    throw new Error('Invalid value for matchInto in matchHelpFields');
};

const rowFieldMatchers = {
    'Your Name': 'name',
    'Email address': 'email',
    Organization: 'organization',
    'ZIP Code': 'zip',
    'Phone number': 'phone',
    'Things you can help with': {
        deriveFrom: normalizeOffers,
        field: 'offers',
    },
    Timestamp: 'timestamp',
    'Additional comments': 'comments',
};

const publicEntryFields = ['zip', 'offers', 'timestamp'];

const findMatcherForRowHeader = header => {
    const key = Object.keys(rowFieldMatchers).find(matcherKey =>
        matchCaseInsensitive(matcherKey, header)
    );
    if (key) {
        return rowFieldMatchers[key];
    }
    return null;
};

const createEntryFromRow = row => {
    const result = {};
    Object.entries(row).forEach(([header, value]) => {
        const matcher = findMatcherForRowHeader(header);
        if (matcher) {
            if (typeof matcher === 'object') {
                const { field, deriveFrom } = matcher;
                result[field] = deriveFrom(value);
            } else {
                result[matcher] = value && value.trim();
            }
        } else {
            //  console.warn(`Discarding unmatched sheet header ${header}`);
        }
    });
    return result;
};

const sanitizeEntryForPublic = entry => {
    const res = {};
    Object.entries(entry).forEach(([key, value]) => {
        if (publicEntryFields.includes(key)) {
            res[key] = value;
        }
    });
    return res;
};

// const loadTestResponsesIntoEntries = async () => {
//     const data = await fs.readFile(__dirname + '/../static/testData/test.csv');
//     return parseCsv(data, { columns: true }).map(createEntryFromRow);
// };

export const loadAndCollateResponses = async (publicView = false) => {
    const rows = await getSpreadsheetRows();
    const entries = rows.map(createEntryFromRow);
    if (publicView) {
        return entries.map(sanitizeEntryForPublic);
    }
    console.log(entries);
    return entries;
};
