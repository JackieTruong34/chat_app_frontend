import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import Grid from '@material-ui/core/Grid'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,

  },
}));

const LoginSignupTabs = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs></Grid>
      <Grid item xs sm={6} md={5} lg={4} xl={3} style={{ border: '1px solid lightgrey', margin: 'auto', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, height: 'fit-content'}}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" TabIndicatorProps={{style: {backgroundColor: '#FA3E3E'}}}>
            <Tab label="Login" {...a11yProps(0)} style={{flexGrow: 1}}/>
            <Tab label="Sign up" {...a11yProps(1)} style={{flexGrow: 1}}/>
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <LoginForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SignupForm />
        </TabPanel>
      </Grid>
      <Grid item xs></Grid>

    </Grid>
  );
}

export default LoginSignupTabs