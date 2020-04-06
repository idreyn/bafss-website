import { getResponses } from './responses';
import { getEvents } from './events';
import { getBalanceData } from './balance';

const groupItemsByField = (items, fieldName) => {
    const res = {};
    items.forEach(item => {
        const itemValueAtField = item[fieldName];
        if (!res[itemValueAtField]) {
            res[itemValueAtField] = [];
        }
        res[itemValueAtField].push(item);
    });
    return res;
};

const parseDateFromString = (string, separator = '/') => {
    const [month, date, year] = string
        .split(separator)
        .map(piece => parseInt(piece));
    return new Date(year, month - 1, date);
};

const getDateString = date => {
    const monthInt = 1 + date.getMonth();
    const dateInt = date.getDate();
    const yearInt = date.getFullYear();
    return `${monthInt}/${dateInt}/${yearInt}`;
};

const sortByDateValueKey = entriesByDateValue =>
    Object.fromEntries(
        Object.entries(entriesByDateValue).sort(([k1], [k2]) => k1 - k2)
    );

const groupByDateValue = entries => {
    const sortValue = Symbol('sortValue');
    return sortByDateValueKey(
        groupItemsByField(
            entries
                .filter(entry => entry.date)
                .map(entry => {
                    const { date } = entry;
                    return {
                        ...entry,
                        [sortValue]: parseDateFromString(date).valueOf(),
                    };
                }),
            sortValue
        )
    );
};

const createEventsStream = (donations, notes) => {
    return groupByDateValue([
        ...donations.map(d => ({ ...d, type: 'donation' })),
        ...notes,
    ]);
};

const reduceTimeSeriesData = (
    dataByDateValue,
    subtotalReducer,
    initialSubtotal
) => {
    const augmentDateRange = (acc, fromDateValue, toDateValue) => {
        const ONE_DAY = 1000 * 86400;
        if (!fromDateValue) {
            return { [toDateValue]: acc };
        } else {
            const values = {};
            for (
                let dateValue = parseInt(fromDateValue) + ONE_DAY;
                dateValue < parseInt(toDateValue);
                dateValue += ONE_DAY
            ) {
                values[dateValue] = acc;
            }
            return values;
        }
    };

    const { totalsByDateValue: finalTotalsByDateValue } = Object.entries(
        sortByDateValueKey(dataByDateValue)
    ).reduce(
        (state, [dateValue, entryForDate]) => {
            const {
                runningTotal,
                totalsByDateValue,
                previousDateValue,
            } = state;

            console.log('dV', dateValue);

            const nextRunningTotal = subtotalReducer(
                runningTotal,
                entryForDate
            );

            const nextTotalsByDateValue = {
                ...totalsByDateValue,
                ...augmentDateRange(runningTotal, previousDateValue, dateValue),
                [dateValue]: nextRunningTotal,
            };

            return {
                totalsByDateValue: nextTotalsByDateValue,
                runningTotal: nextRunningTotal,
                previousDateValue: dateValue,
            };
        },
        {
            totalsByDateValue: {},
            runningTotal: initialSubtotal,
            previousDateValue: null,
        }
    );

    return finalTotalsByDateValue;
};

const getBalanceChartData = balance => {
    const { expenses, donations } = balance;

    const expensesByDate = groupByDateValue(expenses);
    const donationsByDate = groupByDateValue(donations);

    const allDateKeys = [
        ...new Set([
            ...Object.keys(expensesByDate),
            ...Object.keys(donationsByDate),
        ]),
    ];

    const collatedValuesByDate = {};

    allDateKeys.forEach(dateKey => {
        const expensesToday = expensesByDate[dateKey] || [];
        const donationsToday = donationsByDate[dateKey] || [];
        collatedValuesByDate[dateKey] = {
            expenses: expensesToday,
            donations: donationsToday,
        };
    });

    const sumOfAmounts = entries =>
        entries.reduce((subtotal, { amount }) => subtotal + amount, 0);

    const subtotalReducer = (currentSubtotal, valuesToday) => {
        const {
            donations: currentDonationsTotal,
            expenses: currentExpensesTotal,
        } = currentSubtotal;

        const {
            donations: donationsToday,
            expenses: expensesToday,
        } = valuesToday;

        return {
            donations: currentDonationsTotal + sumOfAmounts(donationsToday),
            expenses: currentExpensesTotal + sumOfAmounts(expensesToday),
        };
    };

    const timeSeriesData = reduceTimeSeriesData(
        collatedValuesByDate,
        subtotalReducer,
        {
            expenses: 0,
            donations: 0,
        }
    );

    return Object.fromEntries(
        Object.entries(timeSeriesData).map(([dateValueKey, dateValue]) => [
            getDateString(new Date(parseInt(dateValueKey))),
            dateValue,
        ])
    );
};

export const getPageData = async (showPrivateView = false) => {
    const [responses, { donations, notes }, balance] = await Promise.all([
        getResponses(showPrivateView),
        getEvents(),
        getBalanceData(),
    ]);

    return {
        chartData: {
            balance: getBalanceChartData(balance),
        },
        responses: groupItemsByField(responses, 'zip'),
        donations: groupItemsByField(donations, 'locationId'),
        events: createEventsStream(donations, notes),
    };
};
