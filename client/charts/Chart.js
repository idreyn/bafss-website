import React, { useEffect, useState } from 'react';

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
    const [ChartJs, setChartJs] = useState(null);

    useEffect(() => {
        import(/* webpackChunkName: "chart-js" */ 'chart.js').then(
            ({ default: theChartJs }) => {
                // theChartJs is itself a function so we have to set state using a callback.
                setChartJs(() => theChartJs);
            }
        );
    }, []);

    useEffect(() => {
        if (canvas && ChartJs) {
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
    }, [canvas, datasets, labels, chartOptions, ChartJs]);

    return (
        <div className="chart-component">
            <canvas ref={setCanvas} />
        </div>
    );
};

export default Chart;
