import { createGoogleSheetGetter } from './sheets';

const getSpreadsheetRows = createGoogleSheetGetter(
    () => process.env.DROPOFFS_SHEET_ID,
    60
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
        lat,
        lng,
        hospitalName,
        totalDonations,
        documentationUrl,
    } = spreadsheetRow;
    return {
        hospitalName,
        documentationUrl,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        totalDonations: parseInt(totalDonations),
    };
};

export const getDropoffs = async () => {
    const rows = await getSpreadsheetRows();
    return rows.filter(isRowVisible).map(processRow);
};
