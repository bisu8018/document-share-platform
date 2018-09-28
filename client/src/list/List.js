import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import PageView from './PageView'
import SetString from "../SetString";

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const domain = "https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";
function handlePageView(fileid) {

  console.log(fileid);

}
class Album extends React.Component {

  imageUrl = (fileid, fileindex) => domain+ "/prod/document/get/" + fileid + "/" + fileindex;
  pageUrl = (fileid) => domain+ "/prod/document/get/" + fileid;

  goDetail = (viewName, e) => {
    //e.preventDefault();
    console.log("goDetail", e, viewName);
    console.log(this.props.currentView);
    this.props.handler("detail");

  }
  render(){

    const { classes, resultList, handle, currentView } = this.props;
    console.log("resultList", resultList);
    return (
      <React.Fragment>
        <main>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={40}>
              {cards.map(result => (
                <Grid item key={result.fileid} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={this.imageUrl(result.fileid, result.fileindex)}
                      title={result.fileid}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="headline" component="h2">
                        {result.fileid}
                      </Typography>
                      <Typography>
                        {domain}/{result.fileid}/{result.fileindex}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" onClick={this.goDetail.bind(this, "detail")}>
                        View
                      </Button>
                      <Button size="small" color="primary">
                        Vote
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <PageView />
          </div>
        </main>
      </React.Fragment>
    );
  }

}

Album.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Album);
