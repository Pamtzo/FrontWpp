import React from 'react';

import Chat from './views/chat/chat.view'
import Pedido from './views/pedidos/pedidos.view'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Chat}/>
        <Route path="/sucursal" component={Pedido}/>
      </Switch>
    </Router>
  );
}

export default App;
