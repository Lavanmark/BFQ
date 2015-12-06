var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
//var ReactRouter = require("react-router");
var History = ReactRouter.History;


var App = React.createClass({
  mixins: [ History ],
  // initial state
  getInitialState: function() {
      return {
        // the user is logged in
          loggedIn: auth.loggedIn()
      };
  },

  // callback when user is logged in
  setStateOnAuth: function(loggedIn) {
      this.state.loggedIn = loggedIn;
  },

  // when the component loads, setup the callback
  componentWillMount: function() {
      auth.onChange = this.setStateOnAuth;
  },

  // logout the user and redirect to home page
  logout: function(event) {
      auth.logout();
      this.history.pushState(null, '/');
  },
  render: function() {
    return (
      <div>
        { this.props.children || <Login />}
      </div>
    );
  }
});

var Login = React.createClass({
  // context so the component can access the router
  mixins: [ History ],

  // initial state
  getInitialState: function() {
      return {
          // there was an error on logging in
          error: false
      };

  },

  register: function(event) {
    // prevent default browser submit
        event.preventDefault();
        // get data from form
        var name = this.refs.name.value;
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        var confpass = this.refs.confirmpassword.value;
        var classkey = this.refs.classkey.value;
        if (!name || !username || !password || !confpass || !classkey) {
            return;
        }
        if(password !== confpass)
          return;
        // register via the API
        auth.register(name, username, password, classkey, function(loggedIn, perm) {
            // register callback
            if (!loggedIn)
                return this.setState({
                    error: true
                });
            if(perm)
              this.history.pushState(null, '/ta');
            else
              this.history.pushState(null, '/student');
        }.bind(this));
  },
  login: function(event) {
        // prevent default browser submit
        event.preventDefault();
        // get data from form
        var username = this.refs.loginusername.value;
        var password = this.refs.loginpassword.value;
        if (!username || !password) {
            return;
        }
        // login via API
        auth.login(username, password, function(loggedIn, perm) {
            // login callback
            if (!loggedIn)
                return this.setState({
                    error: true
                });
            if (perm)
              this.history.pushState(null, '/ta');
            else
              this.history.pushState(null, '/student');
        }.bind(this));
  },
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
                        <form id="login-form" onSubmit={this.login}>
                          <div className="form-group">
                            <input type="text" ref="loginusername" id="loginusername" tabIndex="1" className="form-control" placeholder="Username" />
                          </div>
                          <div className="form-group">
                            <input type="password" ref="loginpassword" id="loginpassword" tabIndex="2" className="form-control" placeholder="Password" />
                          </div>
                          <div className="form-group text-center">
                            <input type="checkbox" tabIndex="3" className="" ref="remember" id="remember" />
                            <label htmlFor="remember"> Remember Me</label>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-sm-6 col-sm-offset-3">
                                <input type="submit" ref="login-submit" id="login-submit" tabIndex="4" className="form-control btn btn-login" value="Log In" />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="text-center">
                                  <Link to="/recover" tabIndex="5" className="forgot-password">Forgot Password?</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.error ? (
                          <div className="alert">Invalid username or password.</div>
                          ) : null }
                        </form>
                        <form id="register-form" onSubmit={this.register}>
                          <div className="form-group">
                            <input type="text" ref="name" id="name" tabIndex="1" className="form-control" placeholder="Name" />
                          </div>
                          <div className="form-group">
                            <input type="text" ref="username" id="username" tabIndex="2" className="form-control" placeholder="Username (BYU NetID)" />
                          </div>
                          <div className="form-group">
                            <input type="password" ref="password" id="password" tabIndex="4" className="form-control" placeholder="Password" />
                          </div>
                          <div className="form-group">
                            <input type="password" ref="confirmpassword" id="confirmpassword" tabIndex="4" className="form-control" placeholder="Confirm Password" />
                          </div>
                          <div className="form-group">
                            <input type="text" ref="classkey" id="classkey" tabIndex="5" className="form-control" placeholder="Class Key" />
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-sm-6 col-sm-offset-3">
                                <input type="submit" ref="register-submit" id="register-submit" tabIndex="6" className="form-control btn btn-register" value="Register Now" />
                              </div>
                            </div>
                          </div>
                          {this.state.error ? (
                          <div className="alert">Invalid username or password.</div>
                          ) : null }
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

var auth = {
    register: function(name, username, password, classkey, cb) {
        // submit request to server, call the callback when complete
        var url = "/register";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                name: name,
                username: username,
                password: password,
                classkey: classkey
            },
            // on success, store a login token
            success: function(res) {
                localStorage.token = res.token;
                localStorage.name = res.name;
                localStorage.username = username;
                localStorage.perm = res.perm;
                if (cb)
                    cb(true, res.perm);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                delete localStorage.username;
                delete localStorage.name;
                delete localStorage.perm;
                if (cb)
                    cb(false);
                this.onChange(false);
            }.bind(this)
        });
    },
    // login the user
    login: function(username, password, cb) {
        // submit login request to server, call callback when complete
        cb = arguments[arguments.length - 1];
        // check if token in local storage
        if (localStorage.token && localStorage.username == username) {
            if (cb) {
                cb(true, localStorage.perm);
            }
            this.onChange(true);
            return;
        }

        // submit request to server
        var url = "/login/verify";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(res) {
                // on success, store a login token
                localStorage.token = res.token;
                localStorage.username = username;
                localStorage.name = res.name;
                localStorage.perm = res.perm;
                if (cb)
                    cb(true,res.perm);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                delete localStorage.username;
                delete localStorage.name;
                delete localStorage.perm;
                if (cb)
                    cb(false);
                this.onChange(false);
            }.bind(this)
        });
    },
    // get the token from local storage
    getToken: function() {
        return localStorage.token;
    },
    // get the name from local storage
    getName: function() {
        return localStorage.name;
    },

    getPerm: function() {
        return localStorage.perm;
    },
    // logout the user, call the callback when complete
    logout: function(cb) {
        delete localStorage.token;
        delete localStorage.perm;
        delete localStorage.username;
        delete localStorage.perm;
        if (cb) cb();
        this.onChange(false);
    },
    // check if user is logged in
    loggedIn: function() {
        return !!localStorage.token;
    },
    // default onChange function
    onChange: function() {},
};

var routes = (
  <Router>
    <Route path="/" component={App}>
      <Route path="/recover" component={Recover}/>
       <Route path="/ta" component={TA}/>
    <Route path="/student" component={Student}/>
    </Route>
   
  </Router>
);

ReactDOM.render(routes, document.getElementById('content'));