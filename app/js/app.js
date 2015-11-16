var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar />
        {this.props.children || <Home />}
      </div>
    );
  }
});

var NavBar = React.createClass({displayName: 'NavBar',
  render: function() {
    return (
      React.createElement('div', {className: "navBar"},
        <nav className="navbar navbar-default">
		  <div className="container-fluid">
		    <div className="navbar-header">
		      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
		        <span className="sr-only">Toggle navigation</span>
		        <span className="icon-bar"></span>
		        <span className="icon-bar"></span>
		        <span className="icon-bar"></span>
		      </button>
		      <a className="navbar-brand" href="#">Brand</a>
		    </div>
		    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		      <ul className="nav navbar-nav">
		        <li className="active"><Link to="#">Home <span className="sr-only">(current)</span></Link></li>
		        <li><Link to="p2">Page Two</Link></li>
		      </ul>
		    </div>
		  </div>
		</nav>
      )
    );
  }
});


var Home = React.createClass({
    render: function() {
      return (
        <h1>Home</h1>
      );
    }
});

var PageTwo = React.createClass({
  render: function() {
    return (
      <h1>Page Two</h1>
    );
  }
});

var routes = (
  <Router>
    <Route path="/" component={App}>
      <Route path="p2" component={PageTwo}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('content'));