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
import {Grid,Row,Col,} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import ChartistGraph from "react-chartist";

import avatar from "assets/img/faces/face-0.jpg";
import axios from 'axios';

import {
  optionsSales,
  responsiveSales,
  legendSales,
} from "variables/Variables.jsx";


class UserProfile extends Component {

  state = {
    patientInfo: '',
    observations: []
}

  componentDidMount(){
    axios.get(`http://localhost:5000/api/Patient/8f789d0b-3145-4cf2-8504-13159edaa747`)
    .then(res => this.setState({patientInfo: res.data}))  
    axios.get(`http://localhost:5000/api/Observation/8f789d0b-3145-4cf2-8504-13159edaa747`)
    .then(res => this.setState({observations: res.data}))
}

calAvg = (val) => {
  var sum = 0;
  var res = 0;
  for(var i = 0; i < val.length; i++){
      sum += parseInt(val[i], 10)
  }
  res = sum / val.length
  return res
}

blood = (code,type) => {
  var res = []
  this.state.observations.forEach((observation) => {
      observation.entry.forEach((entry) => {
        if(entry.resource.code.coding[0].code === code){
            entry.resource.component.forEach((comp) => {
              if(comp.code.coding[0].code === type){
                res.push(comp.valueQuantity.value)
                }
            }
            )
          }
      }
      )
  }
  )
  return res
}

getStat = (code) => {
  var res = []
  this.state.observations.forEach((observation) => {
      observation.entry.forEach((entry) => {
          if (entry.resource.code.coding[0].code === code) {
              res.push(entry.resource.valueQuantity.value)
          }
      }
      )
  }
  )
  return res
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

getLabel = (l) => {
  var res = [];
  for(var i=1; i < l+1; i++) {
      res.push(i)
  }
  return res
}


  render() {
    var dataBlood = {
      labels: this.getLabel(this.blood("85354-9", "8462-4").length),
      series: [this.blood("85354-9", "8462-4")] 
    };

    
    if(this.state.patientInfo.length === 0 | this.state.observations.length === 0){
      return (
        <div></div>
      )

    }else{
      return (
        <div className="content">
          <Grid fluid>
            <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph3 text-warning" />}
                statsText="Average Weight"
                statsValue={this.calAvg(this.getStat("29463-7"))}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-info" />}
                statsText="Height"
                statsValue={this.calAvg(this.getStat("8302-2"))}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>

            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-gleam text-success" />}
                statsText="Blood Glucose"
                statsValue={this.calAvg(this.getStat("15074-8"))}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
 
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-stopwatch text-danger" />}
                statsText="Heart rate"
                statsValue={Math.round(this.calAvg(this.getStat("8867-4")))}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
      
            </Col>
              <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Blood Pressure"
                category="All observations"
                stats="Just now"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBlood}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
              <Col md={4}>
                <UserCard
                  bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                  avatar={avatar}
                  name={`${this.state.patientInfo.name[0].given} ${this.state.patientInfo.name[0].family}`}
                  description={
                    <span>
                      Date of birth: {this.state.patientInfo.birthDate}
                      <br />
                      Gender: {this.state.patientInfo.gender}
                      <br />
                      Marital status: {this.state.patientInfo.maritalStatus.text}
                    </span>
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


export default UserProfile;
