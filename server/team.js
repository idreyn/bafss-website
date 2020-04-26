import { createGoogleSheetGetter } from './sheets';

const getTeamSheet = createGoogleSheetGetter({
    getId: () => process.env.TEAM_SHEET_ID,
});

const processRow = row => {
    const { name, detail, imageUrl } = row;
    return { name, detail, imageUrl };
};

export const getTeam = async () => {
    const sheetData = await getTeamSheet();
    return sheetData.map(processRow);
};
