import Plot from '../components/Plot'


function PlotContainer({ plotShown, bars }) {
  if (!plotShown) {
    return (<div />)
  }

  return (
    <Plot bars={bars} className=""></Plot>
  )
}

export default PlotContainer