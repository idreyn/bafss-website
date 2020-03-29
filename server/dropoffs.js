import { createGoogleSheetGetter } from './sheets';

const getSpreadsheetRows = createGoogleSheetGetter(
    () => process.env.DROPOFFS_SHEET_ID
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
        hospitalName,
        totalDonations,
        documentationUrl,
    } = spreadsheetRow;
    return {
        hospitalName,
        address,
        documentationUrl,
        totalDonations: parseInt(totalDonations),
    };
};

export const getDropoffs = async () => {
    const rows = await getSpreadsheetRows();
    return rows.filter(isRowVisible).map(processRow);
};
