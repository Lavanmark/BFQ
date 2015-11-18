var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var App = React.createClass({
  render: function() {
    return (
      <div>
        { this.props.children || <Login />}
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
            <li className="active" id="login"><Link to="#">Login<span className="sr-only">(current)</span></Link></li>
            <li id="p2link"><Link to="p2">Page Two</Link></li>
          </ul>
        </div>
      </div>
    </nav>
    );
  }
});


var Login = React.createClass({


  componentDidMount: function() {
    $("#login-form").fadeIn(1);
    $("#register-form").fadeOut(1);
    $('#register-form-link').removeClass('active');
    $("#login-form-link").addClass('active');

    $('#login-form-link').click(function(e) {
      $("#login-form").delay(100).fadeIn(100);
      $("#register-form").fadeOut(100);
      $('#register-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    })

    $('#register-form-link').click(function(e) {
      $("#register-form").delay(100).fadeIn(100);
      $("#login-form").fadeOut(100);
      $('#login-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    })

  },
  render: function() {
    return (
        <div className="container">
              <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <div className="panel panel-login">
                  <div className="panel-heading">
                    <div className="row">
                      <div className="col-xs-6">
                        <a href="#" className="active" id="login-form-link">Login</a>
                      </div>
                      <div className="col-xs-6">
                        <a href="#" id="register-form-link">Register</a>
                      </div>
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <form id="login-form" action="" method="post" role="form" >
                          <div className="form-group">
                            <input type="text" name="username" id="username" tabIndex="1" className="form-control" placeholder="Username" />
                          </div>
                          <div className="form-group">
                            <input type="password" name="password" id="password" tabIndex="2" className="form-control" placeholder="Password" />
                          </div>
                          <div className="form-group text-center">
                            <input type="checkbox" tabIndex="3" className="" name="remember" id="remember" />
                            <label htmlFor="remember"> Remember Me</label>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-sm-6 col-sm-offset-3">
                                <input type="submit" name="login-submit" id="login-submit" tabIndex="4" className="form-control btn btn-login" value="Log In" />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="text-center">
                                  <Link to="recover" tabIndex="5" className="forgot-password">Forgot Password?</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                        <form id="register-form" action="" method="post" role="form" >
                          <div className="form-group">
                            <input type="text" name="username" id="username" tabIndex="1" className="form-control" placeholder="Username" />
                          </div>
                          <div className="form-group">
                            <input type="email" name="email" id="email" tabIndex="1" className="form-control" placeholder="Email Address" />
                          </div>
                          <div className="form-group">
                            <input type="password" name="password" id="password" tabIndex="2" className="form-control" placeholder="Password" />
                          </div>
                          <div className="form-group">
                            <input type="password" name="confirm-password" id="confirm-password" tabIndex="2" className="form-control" placeholder="Confirm Password" />
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-sm-6 col-sm-offset-3">
                                <input type="submit" name="register-submit" id="register-submit" tabIndex="4" className="form-control btn btn-register" value="Register Now" />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    }
});

var Register = React.createClass({
  render: function() {

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

var Recover = React.createClass({
  render: function() {
    return (
      <h1>Talk to a TA to reset your password</h1>
      );
  }
});

var TA = React.createClass({
  render: function() {
    return (
      <h1>TA Page</h1>
    );
  }
});

var Student = React.createClass({
  render: function() {
    return (
      <h1>Student Page</h1>
    );
  }
});
var routes = (
  <Router>
    <Route path="/" component={App}>
      <Route path="recover" component={Recover}/>
    </Route>
    <Route path="/ta" component={TA}>
    </Route>
    <Route path="/student" component={Student}>
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('content'));