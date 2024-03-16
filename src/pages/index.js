import { useState, useEffect } from 'react'
import Menu from '../components/Menu'
import PlotContainer from '../components/PlotContainer'


export default function Home() {
  const [rows, setRows] = useState([])  // volatile stock chart data
  const [symbol, setSymbol] = useState('')  // currently selected symbol
  const [interval, setInterval] = useState('5m')  // currently selected plot parameters
  const [plotShown, setPlotShown] = useState(false)  // plot visible ?
  const [bars, setBars] = useState([])  // stock chart data
  
  /*
   * retrieves initial volatile stock data using microservice call
   * sets return data in "rows" state var
   */
  const fetchStocks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/most_volatile_stock', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const parsed = JSON.parse(data)
      setRows(parsed.slice(0, 10)); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchStocks()
  }, [])

  const [isHovered, setHover] = useState(false);

  return (
    <main className='w-full h-screen flex flex-col items-center my-20'>
      <div className="text-5xl"><i>Welcome to the Chart!</i></div>
      <div className='w-3/4 flex flex-col items-center mt-4'>
        <div id="i" onMouseEnter={() => setHover(true)} 
          onMouseLeave={() => {setHover(false)}}>Hover here for tips or click around at your leisure!
        </div>
        <div className='w-1/2 text-sm m-2' 
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          Use this to find juicy investing opportunities. Listed below are the top 10 companies in the S&P500 
          based on their recent change (last 24 hours). High volatility represents opportunity. Click on a row 
          in the chart to fetch a price chart. Data source is Tradestation, a financial broker.
        </div>
        <div className='text-xl'>Most Volatile Stocks Today</div>
        <table className="w-full mt-10">
          <thead>
            <tr>
              <td>Symbol</td>
              <td>Name</td>
              <td>Price</td>
              <td>Volatility</td>
            </tr>
          </thead>
          <tbody>
            {rows && rows.map((row, index) => (
              <tr key={index} onClick={()=>{
                setSymbol(row.Stock)
              }}>
                <td>{row.Stock}</td>
                <td>{row.Name}</td>
                <td>{row.StockPrice}</td>
                <td>{row.ImpliedVolatility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Menu symbol={symbol} setSymbol={setSymbol} rows={rows} interval={interval} 
        setInterval={setInterval} setPlotShown={setPlotShown} setBars={setBars}></Menu>
      <PlotContainer id="plot" plotShown={plotShown} bars={bars} className='mb-10'></PlotContainer>
    </main>
  );
}
