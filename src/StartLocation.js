import React, { Component } from 'react';
import styled from 'styled-components';
import { FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Glyphicon } from 'react-bootstrap';
import { Grid, Col, Row } from 'react-bootstrap';

// StyleD components must be external from component
// to prevent re-render
const Wrapper = styled.section`
  padding: 1em;
  background: papayawhip;
`;

class StartLocation extends Component {
    constructor(props) {
      super(props);

      this.onChange = props.onChange || this.onChange.bind(this);
      this.onLocate = props.onLocate || this.onLocate.bind(this);
    }

    onLocate() {
        console.log("onLocate not given as property");
    }

    onChange(e) {
        console.log("onChange not given as property");
    }

    render() {
      return (
        <Wrapper>

          <Grid>

            <Row>

            <Col xs={4} md={4}>
              <ControlLabel>Latitude</ControlLabel>
              <FormControl
                type="text"
                bsSize="sm"
                id="lat"
                key="lat"
                value={this.props.lat}
                onChange={ this.onChange }
              />
            </Col>

            <Col xs={4} md={4}>
              <ControlLabel>Longitude</ControlLabel>
              <FormControl
                type="text"
                bsSize="sm"
                id="lng"
                key="lng"
                value={this.props.lng}
                onChange={ this.onChange }
              />
            </Col>

            <Col xs={4} md={4}>
              <br/>
              <Button onClick={this.onLocate}>
                <Glyphicon glyph="globe"/>
              </Button>
            </Col>

            </Row>

            <Row>
            <FormControl.Feedback />
            </Row>

            </Grid>
        </Wrapper>
      );
    }
}

export default StartLocation;
