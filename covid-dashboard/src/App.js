import { useEffect, useState } from 'react';
import './App.css';

import Plot from 'react-plotly.js';
import axios from 'axios';

function App() {

const [stateData,setStateData] = useState([])
const [variable,setVariable] = useState('tot_cases')
const [zmaxvalue,setZmaxvalue] = useState(9000000)

useEffect(()=>{

  axios({
    url: 'http://localhost:4000/graphql',
    method: 'post',
    data: {
      query: `
      query{
        covid19Payload{
          id,
          state,
          tot_cases,
          new_case,
          tot_death,
          new_death
        }
      }
        `
    }
  }).then((result) => {
    console.log(result.data.data.covid19Payload)
    setStateData(result.data.data.covid19Payload)
  })

},[])

function setVariableValue(e){
  setVariable(e.target.value)
  if(e.target.value === 'new_case'){
    setZmaxvalue(20000)
  }else if(e.target.value === 'tot_death'){
    setZmaxvalue(120000)
  }else if(e.target.value === 'new_death'){
    setZmaxvalue(1500)
  }else{
    setZmaxvalue(9000000)
  }
  console.log(variable)
  console.log(zmaxvalue)
}

  return (
    <div className="App">
       
        <div class="container text-center">
  <div class="row mt-5 pt-5">
    <div class="col">
    <select class="form-select m-3 p-3" style={{width:'150px',top:'50%'}} onChange={(e)=>{setVariableValue(e)}}>
              <option value="tot_cases" defaultValue>Total Cases</option>
              <option value="new_case">New Cases</option>
              <option value="tot_death">Total Deaths</option>
              <option value="new_death">New Deaths</option>
        </select>
    </div>
    <div class="col">
    <Plot
        data={[
          {
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: stateData.map(x => x['state']),
            z: stateData.map(x => x[variable]),
            text:stateData.map(x => x['state']),
            zauto: false,
            zmin: 0,
            zmax: zmaxvalue,
          colorbar: {
            title: 'Millions USD',
            thickness: 50
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
          }
        }
        ]}


        layout={{width: 800, height: 500,
          geo:{
            scope: 'usa',
            countrycolor: 'rgb(255, 255, 255)',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: 'rgb(255, 255, 255)',
            subunitcolor: 'rgb(255, 255, 255)',
            lonaxis: {},
            lataxis: {}
        }

      }}

      />
    </div>

  </div>
</div>


    </div>

    
  );
}

export default App;
