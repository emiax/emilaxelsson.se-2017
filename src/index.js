import React from 'react';
import { render } from 'react-dom'

import MainContainer from './templates/maincontainer';
import NotFound from './templates/notfound'
import StartPage from './templates/startpage';
import StainsPage from './templates/stainspage';

import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

const routes = ((
  <div>
  
  <Router history={hashHistory}>
    <Route path='/' component={MainContainer}>
      <IndexRoute component={StartPage}/>
      <Route path='start' component={StartPage}/>
      <Route path='stains' component={StainsPage}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
  </div>
));

render(routes, document.getElementById('main-container'));
