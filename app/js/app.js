var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var App = React.createClass({
  render: function() {
    return (
      <div>
        { this.props.children || <Home />}
      </div>
    );
  }
});

var NavBar = React.createClass({displayName: 'NavBar',
  render: function() {
    return (
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
            <li className="active" id="home"><Link to="#">Home <span className="sr-only">(current)</span></Link></li>
            <li id="p2link"><Link to="p2">Page Two</Link></li>
          </ul>
        </div>
      </div>
    </nav>
    );
  }
});


var Home = React.createClass({
    render: function() {
      return (
        <div>
          <h1>Home</h1>
          <li><Link to="p2">Page Dos</Link></li>
        </div>
      );
    }
});

var PageTwo = React.createClass({

  componentDidMount: function() {
    $(".nav").find(".active").removeClass("active");
    $("#p2link").addClass("active");
    
  },
  render: function() {
    return (
      <div>
        <NavBar />
        <h1>Page Two</h1>
      </div>
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