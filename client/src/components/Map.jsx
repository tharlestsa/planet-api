import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { defaults as defaultInteractions } from 'ol/interaction';
import XYZ from 'ol/source/XYZ';
import '../App.css';
import 'ol/ol.css';
import 'antd/dist/antd.css';
import '../react-geo.css';


class Map extends React.Component {

  constructor(props) {

    super(props);
    
    this.state = {
      projection: 'EPSG:4326',
      name: this.props.image.name, 
      center: this.props.center,
      url: this.props.image._links.tiles,
    };

    this.mapDivId = `map-${Math.random()}`;

    let iconFeature = new Feature({
      geometry: new Point(this.state.center),
    });
    
    let iconStyle = new Style({
      image: new Icon({
        scale: [1.5, 1.5],
        crossOrigin: '*',
        opacity:"0.4",
        src: './marker.png',
      }),
    });
    
    iconFeature.setStyle(iconStyle);
    
    let vectorSource = new VectorSource({
      features: [iconFeature],
    });
    
    let vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    
    let rasterLayer =  new TileLayer({
      source: new XYZ({
        url:this.state.url,
      }),
    });
    
    this.layers = [
      rasterLayer,
      vectorLayer,
    ];

    this.map = new OlMap({
      view: new OlView({
        center: this.state.center,
        projection:this.state.projection,
        zoom: 15,
        minZoom: 13,
        maxZoom: 16,
      }),
      layers: this.layers,
      interactions: defaultInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
        dragPan: false,
        mouseWheelZoom: false,
      })
    });
    let extent = vectorLayer.getSource().getExtent();
    this.map.getView().fit(extent, this.map.getSize());
  }

  handlePointChange(e){

  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <div
        id={this.mapDivId}
        style={{
          position: 'relative',
          height: '300px'
        }}
      >
      </div>
    );
  }
}
export default Map
