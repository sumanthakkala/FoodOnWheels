import './App.css';
import Sidebar from './components/sidebar/Sidebar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Orders from './pages/orders/Orders'
import Restaurants from './pages/restaurants/Restaurants'
import Categories from './pages/categories/Categories'

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Switch>
          <Route path='/' exact component={Dashboard} />
          <Route path='/orders' component={Orders} />
          <Route path='/restaurants' component={Restaurants} />
          <Route path='/categories' component={Categories} />
        </Switch>
      </div>


    </Router>

  );
}

export default App;
