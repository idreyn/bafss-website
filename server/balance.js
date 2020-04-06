import { createGoogleSheetGetter } from './sheets';

const getBalanceSheet = createGoogleSheetGetter({
    getId: () => process.env.BALANCE_SHEET_ID,
    sheetExtractor: doc => {
        return {
            expensesSheet: doc.sheetsByIndex[1],
            donationsSheet: doc.sheetsByIndex[2],
        };
    },
});

const processBalanceSheetRow = spreadsheetRow => {
    const { date, amount } = spreadsheetRow;
    return { date, amount: parseFloat(amount) };
};

const isRowVisible = spreadsheetRow => {
    return !!spreadsheetRow.date && !!spreadsheetRow.amount;
};

export const getBalanceData = async () => {
    const { donationsSheet, expensesSheet } = await getBalanceSheet();
    const [donationRows, expenseRows] = await Promise.all([
        donationsSheet.getRows(),
        expensesSheet.getRows(),
    ]);
    return {
        donations: donationRows
            .filter(isRowVisible)
            .map(processBalanceSheetRow),
        expenses: expenseRows.filter(isRowVisible).map(processBalanceSheetRow),
    };
};
