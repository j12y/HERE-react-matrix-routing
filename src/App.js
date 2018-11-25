import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import StartLocation from './StartLocation.js';
import PlacePlanner from './PlacePlanner.js';

const Wrapper = styled.section`
  padding: 1em;
`;

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      here: {
        app_id: 'APP_ID_HERE',
        app_code: 'APP_CODE_HERE',
      },
      start: {
        lat: 30.25869,
        lng: -97.74633,
      },
    }

    this.onLocate = this.onLocate.bind(this);
    this.onLocationChanged = this.onLocationChanged.bind(this);
  }

  // Set geocordinates using HTML5 geolocation for current location
  onLocate(e) {
      e.preventDefault();

      const self = this;
      navigator.geolocation.getCurrentPosition(function(position) {
        self.setState({
          start : {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            }
        });
      });
  }

  // User manually changing latitude or longitude
  onLocationChanged(e) {
    e.preventDefault();

    let state = this.state;
    state['start'][e.target.id] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div className="App">

        <StartLocation
            lat={this.state.start.lat}
            lng={this.state.start.lng}
            key="MyLocator"
            onChange={this.onLocationChanged}
            onLocate={this.onLocate}
            />

        <Wrapper>
          <p>Search for nearby places.</p>
          <PlacePlanner
            app_id={this.state.here.app_id}
            app_code={this.state.here.app_code}
            lat={this.state.start.lat}
            lng={this.state.start.lng}
          />
        </Wrapper>

      </div>
    );
  }
}

export default App;
