import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles, withTheme } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Map from './Map';
import { Drawer } from 'antd';
import axios from 'axios';

import {
  SimpleButton,
} from '@terrestris/react-geo';

import 'antd/dist/antd.css';
import '../react-geo.css';

const styles = (theme) => ({
  app:{
    padding: '20px',
  },
  point:{
    padding: '15px',
  },
  root: {
    justifyContent: 'center',
    '& .MuiTextField-root': {
      margin: theme.spacing(0.8),
      width: '25ch',
    },
  },
  grid :{
    flexGrow: 1,
  },
});

class SideBar extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      visible: false,
      images: [],
      center: [],
      lat:'',
      lon:'',
    };

    this.loadImages = this.loadImages.bind(this);
    this.latHandler = this.latHandler.bind(this);
    this.lonHandler = this.lonHandler.bind(this);
  }

  toggleDrawer = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  getBasemaps = async () => {  
    const response = await axios.get('https://api.planet.com/basemaps/v1/mosaics?api_key=d6f957677fbf40579a90fb3a9c74be1a');  
    const data = response.data;
    let mosaics = data.mosaics;

    if (response.data._links.hasOwnProperty('_next')) {
      let _mosaics = await this.getNext(data._links._next)
      for (let [index] of _mosaics.entries()) {
        if(_mosaics[index].name.includes('hancock') || _mosaics[index].name.includes('global_quarterly')){
         //continua
        }else{
          mosaics.push(_mosaics[index]);
        }
      }
      this.setState({
        images: mosaics,
      });
    } else {
      this.setState({
        images: mosaics,
      });
    }
  }

  getNext = async (url) => {  
    const response = await axios.get(url);
    return response.data.mosaics;
  }


  loadImages(){
    this.setState({
      center:[this.state.lat, this.state.lon],
    });
    this.getBasemaps();
  }

  latHandler = (event) => {
    this.setState({lat: event.target.value, center:[]});
  }

  lonHandler = (event) => {
    this.setState({lon: event.target.value, center:[]});
  }

  render() {
    const { classes } = this.props;
    
    return(
      <div className={classes.app}>

        { (this.state.lat && this.state.lon)  ?
            <Typography className={classes.point} align="center" variant="h6" color="textPrimary">
            Point: {this.state.lat}, {this.state.lon}
            </Typography> : null
        }
        
        <div className={classes.grid}>
          <Grid container spacing={1}>

          {this.state.center.length > 1 ? this.state.images.map((image, index) =>
            <Grid item xs={3} key={index}>
              <Card className={classes.root}>
                <CardActionArea>
                  <Map center={this.state.center} image={image} />
                </CardActionArea>
                <CardActions>
                <Typography align="center" variant="subtitle1" color="textPrimary">
                  {image.name}
                </Typography>
                </CardActions>
              </Card>
             
            </Grid>
          ):  <Typography className={classes.point} align="center" variant="h6" color="textPrimary">
                      Insert a coordinate to search images
            </Typography>}
          </Grid>
        </div>
        <SimpleButton
          style={{position: 'fixed', top: '30px', left: '30px'}}
          onClick={this.toggleDrawer}
          iconName="bars"
        />
        <Drawer
          title="Point to Search"
          placement="left"
          onClose={this.toggleDrawer}
          visible={this.state.visible}
          mask={false}
        >
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="lat"
            label="Latitude"
            type="number"
            variant="outlined"
            onChange={this.latHandler}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="lon"
            label="Longitude"
            type="number"
            variant="outlined"
            onChange={this.lonHandler}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            style={{margin: '0 auto', display:'block'}}
            variant="outlined"
            onClick={this.loadImages}
            color="primary">
              Load Images
          </Button>
        </form>
      </Drawer>
    </div>
    );
  }
}
export default withTheme(withStyles(styles)(SideBar))