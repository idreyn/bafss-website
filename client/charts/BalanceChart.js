import React from 'react';

import Chart from './Chart';

const getChartData = balanceData => {
    const labels = Object.keys(balanceData);
    const entries = Object.values(balanceData);
    const donations = entries.map(e => e.donations);
    const expenses = entries.map(e => e.expenses);
    return {
        labels,
        datasets: [
            {
                label: 'Donations',
                data: donations,
                borderColor: 'rgba(61, 219, 103)',
                backgroundColor: `rgba(61, 219, 103, 0.1)`,
            },
            {
                label: 'Expenses',
                data: expenses,
                borderColor: 'rgb(219, 62, 68)',
                backgroundColor: `rgba(219, 62, 68, 0.1)`,
            },
        ],
    };
};

const chartOptions = {
    scales: {
        yAxes: [
            {
                ticks: {
                    callback: v => `$${v}`,
                },
            },
        ],
    },
};

const BalanceChart = props => {
    const { balanceData } = props;
    return (
        <Chart
            chartData={getChartData(balanceData)}
            chartOptions={chartOptions}
        />
    );
};

export default BalanceChart;
