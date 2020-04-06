import md5 from 'md5';

import { createGoogleSheetGetter } from './sheets';

const getSpreadsheetRows = createGoogleSheetGetter({
    getId: () => process.env.DONATIONS_SHEET_ID,
    sheetExtractor: async doc => {
        const [donationsSheet, notesSheet] = doc.sheetsByIndex;
        const [donations, notes] = await Promise.all([
            donationsSheet.getRows(),
            notesSheet.getRows(),
        ]);
        return { donations, notes };
    },
});

const isRowVisible = spreadsheetRow => {
    const { hidden } = spreadsheetRow;
    if (!hidden) {
        return true;
    }
    return hidden.toString() === '0' || hidden.toLowerCase() === 'false';
};

const processNoteRow = spreadsheetRow => {
    const { imageUrl, documentationUrl, body, date } = spreadsheetRow;
    return {
        imageUrl,
        documentationUrl,
        body,
        date,
    };
};

const processDonationRow = spreadsheetRow => {
    const {
        address,
        locationName,
        totalDonations,
        documentationUrl,
        imageUrl,
        donationType,
        date,
        locationId,
    } = spreadsheetRow;
    return {
        locationName,
        address,
        documentationUrl,
        imageUrl,
        donationType,
        date,
        locationId: md5(locationId),
        totalDonations: parseInt(totalDonations),
    };
};

export const getEvents = async () => {
    const { donations, notes } = await getSpreadsheetRows();
    return {
        donations: donations.filter(isRowVisible).map(processDonationRow),
        notes: notes.filter(isRowVisible).map(processNoteRow),
    };
};
