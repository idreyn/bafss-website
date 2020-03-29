import { GoogleSpreadsheet } from 'google-spreadsheet';

import { cache } from './util';

export const createGoogleSheetGetter = (
    spreadsheetIdGetter,
    lifetimeSeconds = 60
) => {
    return cache(async () => {
        const spreadsheetId = spreadsheetIdGetter();
        const doc = new GoogleSpreadsheet(spreadsheetId);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await doc.loadInfo();
        const [sheet] = doc.sheetsByIndex;
        return sheet.getRows();
    }, lifetimeSeconds);
};
