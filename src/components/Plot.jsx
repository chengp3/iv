import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';


function Plot({bars}) {
  const chartRef = useRef(null);
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, { 
        autoSize: true,
        timeScale: {
            timeVisible: true
        }
    });
    chartRef.current = chart;
    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(bars);

    return () => {
        chart.remove();
    };
  }, [bars]);
  
  return (
  <div ref={chartContainerRef} className="w-7/12 h-2/4" />
  );
}

export default Plot