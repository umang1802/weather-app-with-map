
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import Autocomplete from "react-google-autocomplete";
let INITIAL_LAT = ''
let INITIAL_LNG = ''

const mapStyles = {
  width: '40%',
  height: '50%'
};

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,  // Hides or shows the InfoWindow
      activeMarker: {},          // Shows the active marker upon click
      selectedPlace: {},
      updatedLat: INITIAL_LAT,
      updatedLng: INITIAL_LNG         // Shows the InfoWindow to the selected place upon a marker
    };
  }
  
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          updatedLat: position.coords.latitude,
          updatedLng: position.coords.longitude
        }, () => {
          this.props.getLatLong(this.state.updatedLat, this.state.updatedLng)
        })
      });
    } else {
      this.setState({
        updatedLat: '28.704060',
        updatedLng: '77.102493'
      }, () => {
          this.props.getLatLong(this.state.updatedLat, this.state.updatedLng)
       })
    }
  }

  onMarkerClick = (props, marker, e) =>{
    console.log(e)
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  getPosition = (value) => {
    console.log(value)

  }

  mapClicked = (mapProps, map, clickEvent) => {
    this.setState({
      updatedLat: clickEvent.latLng.lat(),
      updatedLng: clickEvent.latLng.lng()
    }, () => {
      this.props.getLatLong(this.state.updatedLat, this.state.updatedLng)
    })
  }

  centerMoved = (mapProps, map, dragend) => {
    this.setState({
      updatedLat: map.getCenter().lat(),
      updatedLng: map.getCenter().lng()
    }, () => {
      this.props.getLatLong(this.state.updatedLat, this.state.updatedLng)
    })
  }

  moveMarker(map, event) {
    this.setState({
      updatedLat: event.position.lat(),
      updatedLng: event.position.lng()
    }, () => {
      this.props.getLatLong(this.state.updatedLat, this.state.updatedLng)
    })
  }


  render() {
    return (
      <div>
        <div className="mb-10 outline">
        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
          style={{ border: '2px solid blue',
            borderRadius: '4px', width: '400px', padding: '15px' }}
          onPlaceSelected={(place) => {
            this.setState({
              updatedLat: place.geometry.location.lat(),
              updatedLng: place.geometry.location.lng()
            }, () => {
              this.props.getLatLong(this.state.updatedLat, this.state.updatedLng)
            })
          }}
        />
        </div>
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={
          {
            lat: INITIAL_LAT,
            lng: INITIAL_LNG
          }
        }
        center={{lat: this.state.updatedLat, lng: this.state.updatedLng}}
        onClick={this.mapClicked}
        onDragend={this.centerMoved}
      >
         
        <Marker
          onClick={this.onMarkerClick}
          position={{lat: this.state.updatedLat, lng: this.state.updatedLng}}
          draggable={true}
          onDragend={this.moveMarker.bind(this)}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
})(MapContainer);
