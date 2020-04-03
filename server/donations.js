import { createGoogleSheetGetter } from './sheets';

const getSpreadsheetRows = createGoogleSheetGetter(
    () => process.env.DONATIONS_SHEET_ID
);

const isRowVisible = spreadsheetRow => {
    const { hidden } = spreadsheetRow;
    if (!hidden) {
        return true;
    }
    return hidden.toString() === '0' || hidden.toLowerCase() === 'false';
};

const processRow = spreadsheetRow => {
    const {
        address,
        locationName,
        totalDonations,
        documentationUrl,
        donationType,
        date,
        id,
    } = spreadsheetRow;
    return {
        locationName,
        address,
        documentationUrl,
        donationType,
        date,
        id,
        totalDonations: parseInt(totalDonations),
    };
};

export const getDonations = async () => {
    const rows = await getSpreadsheetRows();
    return rows.filter(isRowVisible).map(processRow);
};
