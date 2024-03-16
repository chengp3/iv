function Menu({ symbol, setSymbol, rows, interval, setInterval, setPlotShown, setBars }) {
  if (!symbol) return null; 

  const handleSymbol = (event) => {
      setSymbol(event.target.value);
  };

  const handleInterval = (event) => {
      setInterval(event.target.value)
  }

  const transformIntervalString = (intervalString) => {
    const intervals = {
      '5m': {'num': 5, 'unit': 'minute'},
      '60m': {'num': 60, 'unit': 'minute'},
      '240m': {'num': 240, 'unit': 'minute'},
      '1d': {'num': 1, 'unit': 'daily'},
      '7d': {'num': 7, 'unit': 'daily'}
    }
    return intervals[intervalString]
  }

  const transformBars = (rawBars) => {
    const bars = rawBars.map(bar => ({
      time: parseInt(bar['Epoch']) / 1000,
      open: parseFloat(bar['Open']),
      high: parseFloat(bar['High']),
      low: parseFloat(bar['Low']),
      close: parseFloat(bar['Close'])
    }))
    return bars
  }
  
  /*
    * callback to fetch price data
    * fetches data with microservice call symbol[str], num[int],
    *   unit[str], setBars[function(obj)]
    * sets stat variable "bars" with list of bar objs formatted for lightweight-charts
    */
  const fetchBars = (symbol, num, unit, setBars) => {
    fetch(`http://localhost:8000/api/get_data?symbol=${symbol}&interval=${num}&unit=${unit}`)
      .then(response => response.json())
      .then(data => {
        const rawBars = JSON.parse(data.body).Bars
        const bars = transformBars(rawBars)
        setBars(bars);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  /*
    * callback for Submit button press in plot controls panel
    * fetches data with microservice call and "interval" state variable
    * triggers plot to be shown by fetch data, then setting stat variables
    *   "plotShown" and "bars"
    */
  const handleSubmit = () => {
      setPlotShown(true);
      const { num, unit } = transformIntervalString(interval);
      fetchBars(symbol, num, unit, setBars);
  }

  return (
    <div style={{borderStyle: 'solid', borderWidth: '3px', padding: '20px'}}>
      <div style={{marginBottom: '.5rem'}}><b>Plot Controls</b></div>
      <div id="symbol-options" className="flex">
        <div>Symbol:</div>
        <select id="symbol-list" value={symbol} onChange={handleSymbol}> 
          {rows.map((row, index) => (
            <option key={`option-${index}`} value={row.symbol}> 
              {row.Stock}
            </option>
          ))}
        </select>
      </div>
      <div id="interval-options" className="flex">
          <div>Interval:</div>
          <select id="interval-list" value={interval} onChange={handleInterval}>
              <option key="5m" value="5m">5 minutes</option>
              <option key="1h" value="60m">1 hour</option>
              <option key="4h" value="240m">4 hours</option>
              <option key="1d" value="1d">1 day</option>
          </select>
      </div>
      <button onClick={handleSubmit} 
        className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Generate Plot
      </button>
    </div>
  )
};

export default Menu