import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home/index'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Switch>
          <Route path="/" component={Home} exact/>
          <Route render={(renderProps) => <div style={{ textAlign: 'center', color: 'red'}}>Error</div>} />
      </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;
