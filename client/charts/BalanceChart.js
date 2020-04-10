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
                borderColor: 'green',
                backgroundColor: `rgba(0,255,0,0.1)`,
            },
            {
                label: 'Expenses',
                data: expenses,
                borderColor: 'red',
                backgroundColor: `rgba(255,0,0,0.1)`,
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
