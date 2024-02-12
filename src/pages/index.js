import {motion, AnimatePresence} from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Home() {
  const [rows, setRows] = useState([])
  const [symbol, setSymbol] = useState('')
  const [data, setData] = useState([])
  
  const fetchData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
      }
      const url = process.env.NEXT_PUBLIC_AWS_TS + `?symbol=${symbol}&barsback=100`
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setData(data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (symbol) {
     fetchData()
    }
    console.log(data)
  }, [symbol])

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
        const response = await fetch(process.env.NEXT_PUBLIC_AWS_SCRAPER, {
          method: 'GET',
          headers: headers
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRows(data.slice(0, 10)); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRows()
  }, [])

  return (
    <main className='w-full h-screen flex flex-col items-center mt-10'>
      <div>Welcome to the Chart!</div>
      <div id='scraper' className='w-3/4 flex flex-col items-center mt-10'>
        <div className='w-full max-w-xl'>Most Volatile Stocks Today</div>
        <table className="w-full mt-10">
          <thead>
            <tr>
              <td>Symbol</td>
              <td>Price</td>
              <td>IV</td>
            </tr>
          </thead>
          <tbody>
            {rows && rows.map((row, index) => (
              <tr key={index}>
                <td onClick={()=>{
                  setSymbol(row.Symbol)
                }}>{row.Symbol}</td>
                <td>{row.Price}</td>
                <td>{row.IV}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="plot">{symbol}</div>
    </main>
  );
}
