import React, { useEffect, useState } from 'react';
import ChartJs from 'chart.js';

import './chart.scss';

const baseChartOptions = {
    animation: {
        duration: 0,
    },
};

const Chart = props => {
    const {
        chartData: { labels, datasets },
        chartOptions = {},
    } = props;

    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        if (canvas) {
            const chart = new ChartJs(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    datasets: datasets,
                    labels,
                },
                options: { ...baseChartOptions, ...chartOptions },
            });
            return () => chart.destroy();
        }
        return () => {};
    }, [canvas, datasets, labels, chartOptions]);

    return (
        <div className="chart-component">
            <canvas ref={setCanvas} />
        </div>
    );
};

export default Chart;
