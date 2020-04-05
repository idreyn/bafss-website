import md5 from 'md5';

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

export const getDonations = async () => {
    const rows = await getSpreadsheetRows();
    return rows.filter(isRowVisible).map(processRow);
};
