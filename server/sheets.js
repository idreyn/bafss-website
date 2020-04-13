import { GoogleSpreadsheet } from 'google-spreadsheet';

import { preemptiveCache } from './util';

const defaultSheetExtractor = doc => {
    const [sheet] = doc.sheetsByIndex;
    return sheet.getRows();
};

export const createGoogleSheetGetter = ({
    getId,
    lifetimeSeconds = 60,
    sheetExtractor = defaultSheetExtractor,
}) => {
    return preemptiveCache(async () => {
        const spreadsheetId = getId();
        const doc = new GoogleSpreadsheet(spreadsheetId);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await doc.loadInfo();
        return sheetExtractor(doc);
    }, lifetimeSeconds);
};
