/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import {
  legendPie,
  optionsBar,
  responsiveBar
} from "variables/Variables.jsx";
import axios from 'axios';



class Dashboard extends Component {
  state = {
    data:[] 
}

  componentDidMount() {
    axios.get('http://localhost:5000/api/Patient/')
    .then(res => this.setState({data:res.data}))   
}


genderValue = () => {
  var male = 0;
  var female = 0;
  this.state.data.forEach((resource) => {
    resource.entry.forEach((entry) => {
      if (entry.resource.gender === "female"){
        female += 1
      } else if (entry.resource.gender === "male") {
        male += 1      
      }
    }
    )
  }
  )
  return [female,male]
}

multipleBirth = () => {
  var multipleBirth = 0; 
  this.state.data.forEach((resource) => {
    resource.entry.forEach((entry) => {
      if (entry.resource.multipleBirthBoolean !== false){
        multipleBirth +=1;
      } 
    }
    )
  }
  )
  return multipleBirth
}

totalPatients = () => {
  var total = 0; 
  this.state.data.forEach((resource) => {
    resource.entry.forEach((entry) => {
      if (entry.resource.gender){
       total +=1;
      } 
    }
    )
  }
  )
  return total
}

maritalStatus = () => {
  var married = 0;
  var single = 0;
  var neverMarried = 0;
  this.state.data.forEach((resource) => {
    resource.entry.forEach((entry) => {
        if(entry.resource.maritalStatus !== undefined){  

          if (entry.resource.maritalStatus.text === "S") {
                single += 1
            } else if (entry.resource.maritalStatus.text === "M") {
                married += 1
            } else if (entry.resource.maritalStatus.text === "Never Married"){
                neverMarried += 1
            }

          }      
      }
      )
  }
  )
  return [married,single,neverMarried]
}

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }


  render() {

    var dataPieChart = {
      labels: ["Female","Male"],
      series: this.genderValue()
    }
    var dataBarChart = {
      labels: ["Married","Single","Never Married"],
      series: [this.maritalStatus()]
    };
    

    if(this.state.data === undefined ){
      return (
        <div></div>
      )
    }else{
      return (
        <div className="content">
          <Grid fluid>
            <Row>
              <Col lg={true} sm={6}  >
                <StatsCard
                  bigIcon={<i className="pe-7s-users text-warning" />}
                  statsText="Patients"
                  statsValue={this.totalPatients()}
                  statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Updated now"
                />
              </Col>
              <Col lg={true} sm={6} >
                <StatsCard
                  bigIcon={<i className="pe-7s-plugin text-success" />}
                  statsText="People with kids"
                  statsValue={this.multipleBirth()}
                  statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="Updated now"
                />
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartMar"
                  title="Marital status"
                  category="All Patients"
                  stats="Just Now"
                  content={
                    <div className="ct-chart">
                      <ChartistGraph
                        data= {dataBarChart}
                        type="Bar"
                        options={optionsBar}
                        responsiveOptions={responsiveBar}
                      />
                    </div>
                  }
                />
              </Col>
              <Col md={4}>
                <Card
                  statsIcon="fa fa-clock-o"
                  title="Female to Male ratio"
                  
                  stats="Just now"
                  content={
                    <div
                      id="chartPreferences"
                      className="ct-chart ct-perfect-fourth"
                    >
                      <ChartistGraph data={dataPieChart} type="Pie" />
                    </div>
                  }
                  legend={
                    <div className="legend">{this.createLegend(legendPie)}</div>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
  }
}

export default Dashboard;
