import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import PlaceSearch from './PlaceSearch.js';
import axios from 'axios';

class PlacePlanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
          app_id : props.app_id,
          app_code: props.app_code,
          places: {},
          selected: {},
          nearest: {},
        }

        this.addPlaces = this.addPlaces.bind(this);
        this.findNearest = this.findNearest.bind(this);
    }

    addPlaces(idx, results, lat, lng) {

        // Update places with new search results
        let places = this.state.places;
        places[idx] = results;

        // Combine all results across searched places where a selection has
        // not yet been made as our options for next destination
        let options = [];
        for (var p in places) {
            if (typeof this.state.selected[p] === 'undefined') {
                for (var o in places[p]) {
                    options.push({
                        lat: places[p][o].position[0],
                        lng: places[p][o].position[1],
                        id: places[p][o].id,
                    });
                }
            }
        }

        // Final option selected so no need to continue
        if (options.length === 0) {
            return;
        }

        // Will build parameters including all of the potential destinations
        let params = {
            'app_id': this.state.app_id,
            'app_code': this.state.app_code,
            'mode': 'fastest;car;traffic:enabled',
            'matrixAttributes': 'ix,su',
            'summaryattributes': 'all',
            'start0': lat + ',' + lng,
        }
        for (var i = 0; i < options.length; i++) {
            params['destination' + i] = options[i].lat + ',' + options[i].lng;
        }

        // Calculate matrix routing among options to make a recommendation
        const self = this;
        axios.get(
            'https://matrix.route.api.here.com/routing/7.2/calculatematrix.json',
            {'params': params}).then(function(response) {
                const matrix = response.data.response.matrixEntry;

                let nearest = matrix[0].summary;
                nearest['id'] = options[0].id;

                for (var i = 0; i < matrix.length; i++) {
                    if (matrix[i].summary.costFactor < nearest.costFactor) {
                        nearest = matrix[i].summary;
                        nearest.id = options[i].id;
                    }
                }
                self.setState({
                    nearest: nearest
                })
            });

      // TODO: display costfactor / time estimate for next choice

      this.setState({places: places});
    }

    findNearest(idx) {
        let selected = this.state.selected;
        selected[idx] = true;
        this.setState({
            "selected": selected,
        });
        this.addPlaces(idx, [], this.props.lat, this.props.lng)
    }

    render() {
        return (
          <Grid>
            <Row>
              <Col xs={3} md={3}>
                <PlaceSearch
                    idx={0}
                    app_id={ this.state.app_id }
                    app_code={ this.state.app_code }
                    lat={ this.props.lat}
                    lng={ this.props.lng}
                    nearest={ this.state.nearest.id }
                    addPlaces={ this.addPlaces }
                    findNearest={ this.findNearest }
                    />
              </Col>
              <Col xs={3} md={3}>
                <PlaceSearch
                    idx={1}
                    app_id={ this.state.app_id }
                    app_code={ this.state.app_code }
                    lat={ this.props.lat}
                    lng={ this.props.lng}
                    nearest={ this.state.nearest.id }
                    addPlaces={ this.addPlaces }
                    findNearest={ this.findNearest }
                    />
              </Col>
              <Col xs={3} md={3}>
                <PlaceSearch
                    idx={2}
                    app_id={ this.state.app_id }
                    app_code={ this.state.app_code }
                    lat={ this.props.lat}
                    lng={ this.props.lng}
                    nearest={ this.state.nearest.id }
                    addPlaces={ this.addPlaces }
                    findNearest={ this.findNearest }
                    />
              </Col>
              <Col xs={3} md={3}>
                <PlaceSearch
                    idx={3}
                    app_id={ this.state.app_id }
                    app_code={ this.state.app_code }
                    lat={ this.props.lat}
                    lng={ this.props.lng}
                    nearest={ this.state.nearest.id }
                    addPlaces={ this.addPlaces }
                    findNearest={ this.findNearest }
                    />
              </Col>
            </Row>
          </Grid>
        );
    }
}

export default PlacePlanner;
