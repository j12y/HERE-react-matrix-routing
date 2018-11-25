import React, { Component, Fragment } from 'react';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';

class PlaceSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
          q: '',
          results: [],
          selected: '',
        }

        this.onChange = props.onChange || this.onChange.bind(this);
        this.onSelect = props.onSelect || this.onSelect.bind(this);
        this.onSearch = props.onSearch || this.onSearch.bind(this);
        this.addPlaces = props.addPlaces;
    }


    onSearch(e) {
        const self = this;
        axios.get(
          'https://places.api.here.com/places/v1/discover/search',
          {'params': {
            'app_id': self.props.app_id,
            'app_code': self.props.app_code,
            'q': self.state.q,
            'size': 10,
            'at': self.props.lat + ',' + self.props.lng
          }}).then(function (response) {
            // console.log(response);
            self.setState({results: response.data.results.items});
            self.addPlaces(self.props.idx, response.data.results.items, self.props.lat, self.props.lng);
          });
    }

    onSelect(e) {
        this.setState({'selected': e.currentTarget.id});
        this.props.findNearest(this.props.idx);
    }

    onChange(e) {
        e.preventDefault();
        this.setState({
          'q': e.target.value,
        })
    }

    render() {
      const self = this;

        // Get the local address from the vicinity
        const decode = function(raw) {
          var e = document.createElement('div');
          e.innerHTML = raw;
          return e.childNodes[0].nodeValue;
        }

        // Build up listing of locations that match query
        let destinations = [];
        if (self.state.results.length > 0) {
          self.state.results.forEach(function(item) {
            let option = (
              <ListGroupItem
                  id={item.id}
                  key={item.id}
                  onClick={self.onSelect}
                  header={item.title}
                  className={self.state.selected === item.id ? "active" : ""}
                  bsStyle={self.props.nearest === item.id ? "success" : "info" }
                  >
              <Fragment>{decode(item.vicinity)}</Fragment>
              </ListGroupItem>
            );
            destinations.push(option);
            // ({item.position[0]}, {item.position[1]})
          });
        }

        return (
          <div>
            <FormGroup><InputGroup>
                <FormControl
                  type="text"
                  bsSize="sm"
                  id={"destination" + this.props.idx}
                  key={"destination" + this.props.idx}
                  placeholder="Store Name"
                  onChange={ this.onChange }
                  onKeyPress={ e => { if (e.key === 'Enter') { this.onSearch(e); }}}
                />
                <InputGroup.Addon>
                  <Glyphicon glyph="search" onClick={ this.onSearch } />
                </InputGroup.Addon>
            </InputGroup></FormGroup>

            <ListGroup>
              { destinations }
            </ListGroup>
          </div>
        );
    }
}

export default PlaceSearch;
