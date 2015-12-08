var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;
//var ReactRouter = require("react-router");
var History = ReactRouter.History;
var Modal = ReactBootstrap.Modal;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var Navbar = ReactBootstrap.Navbar;
var Input = ReactBootstrap.Input;


var App = React.createClass({
  mixins: [ History ],
  // initial state
  getInitialState: function() {
      return {
        // the user is logged in
          loggedIn: auth.loggedIn(),
          items: null,
          count: 0
      };
  },
    setCount: function() {
        this.setState({count: navBarStore.count});
    },
    setNavItems: function() {
        this.setState({items: navBarStore.items});
    },
  // callback when user is logged in
  setStateOnAuth: function(loggedIn) {
      this.setState({loggedIn: loggedIn});
  },

  // when the component loads, setup the callback
  componentWillMount: function() {
      auth.onChange = this.setStateOnAuth;
      navBarStore.addChangeListener(this.setNavItems, 'items');
      navBarStore.addChangeListener(this.setCount, 'count');
  },

    componentWillUnmount: function() {
        navBarStore.removeChangeListener(this.setNavItems);
    },

    componentDidMount: function() {
    },

  // logout the user and redirect to home page
  logout: function(event) {
      auth.logout();
      this.history.pushState(null, '/');
  },
    toLogin: function() {
        this.history.pushState(null, '/login');
    },
  render: function() {
    return (
      <div style={{height: "100vh"}}>
          <Navbar>
              <Navbar.Header>
                  <Navbar.Brand>
                      <a>BFQ </a>
                      <span className="badge">{this.state.count}</span>
                  </Navbar.Brand>
                  <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                  <Nav>
                      {this.state.items != null ?
                          this.state.items.map(function(item) {
                              return (<NavItem onClick={item.callback}>{item.label}</NavItem>);
                          }) : null
                      }
                  </Nav>
                  <Nav pullRight>
                      {this.state.loggedIn ?
                          <NavItem onClick={this.logout}>Logout</NavItem> :
                          <NavItem onClick={this.toLogin}>Login/Register</NavItem>
                      }
                  </Nav>
              </Navbar.Collapse>
          </Navbar>
        { this.props.children}
          <footer className="footer">
              <div className="container-fluid">
                  <div className="row">
                      <div className="col-xs-12 col-md-6 col-md-offset-3">
                          <p> </p>
                          <p className="text-center">Powered by <strong>Node.js</strong>, <strong>MongoDB</strong>, and <strong>React</strong>. You can see the source <a href="https://github.com/Lavanmark/BFQ">here</a>.</p>
                          <p className="text-center">© 2015 Levi Rodriguez and Tyler Draughon.</p>
                      </div>
                  </div>
              </div>
          </footer>
      </div>
    );
  }
});

var Home = React.createClass({
    componentDidMount: function() {
        navBarStore.setItems(null);
    },
   render: function() {
       return (
         <div className="row">
             <div className="col-xs-12 col-md-4 col-md-offset-4">
                 <h3> </h3>
                 <img className="center-block" src="BFQ.png" alt="BFQ View" style={{width: "240px", height: "240px"}} />
                 <h3 className="text-center">The Big Friendly Queue</h3>
             </div>
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
      navBarStore.setItems(null);
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
    componentDidMount: function() {
        navBarStore.setItems(null);
    },
  render: function() {
    return (
      <h1>Talk to a TA to reset your password</h1>
      );
  }
});

var TA = React.createClass({
  getInitialState: function() {
    return {student: null, queue: null, size: 0, active: false, emptyQueue: false, showMessage: false, messageText: ""};
  },
    getNext: function() {
        var url = "/ta/next";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                token: localStorage.token
            },
            // on success, update queue
            success: function(res) {
                this.setState({student: res.student, queue: res.queue, size: res.size});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
  getQueue: function() {
      var url = "/q/queue";
      $.ajax({
          url: url,
          dataType: 'json',
          type: 'GET',
          // on success, update queue
          success: function(res) {
              navBarStore.setCount(res.size);
              this.setState({queue: res.queue, size: res.size, active: res.active});
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(url, status, err.toString());
          }.bind(this)
      });
  },
  getQueueStatus: function() {
      var url = "/q/status";
      $.ajax({
          url: url,
          dataType: 'json',
          type: 'GET',
          // on success, update queue
          success: function(res) {
              if (this.state.active != res.active || this.state.size != res.size) {
                  this.getQueue();
              }
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(url, status, err.toString());
          }.bind(this)
      });
  },
    closeEmpty: function() {
        this.setState({emptyQueue: false});
    },
    closeMessage: function() {
        this.setState({showMessage: false});
    },
    closeModal: function() {
        this.setState({student: null});
    },
  disableQueue: function() {
      console.log("disabling queue");
      var url = "/ta/stop";
      $.ajax({
          url: url,
          type: 'POST',
          data: {
            token: localStorage.token
          },
          // on success, update queue
          success: function(res) {
              this.setState({queue: null, size: 0, active: false});
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(url, status, err.toString());
          }.bind(this)
      });
  },
    emptyQueue: function() {
      var url = "/ta/empty";
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                token: localStorage.token
            },
            success: function() {
                this.setState({emptyQueue: false});
                this.getQueue();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        })
    },
    enableQueue: function() {
        console.log("enabling queue");
        var url = "/ta/start";
        $.ajax({
          url: url,
            type: 'POST',
            data: {
            token: localStorage.token
        },
        // on success, update queue
        success: function() {
            this.getQueue();
        }.bind(this),
            error: function(xhr, status, err) {
            console.error(url, status, err.toString());
        }.bind(this)});
    },
    removeStudent: function(position) {
        var url = "/ta/remove";
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                token: localStorage.token,
                position: position
            },
            // on success, update queue
            success: function(res) {
                // TODO: Show modal
                this.getQueue();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)});
    },
    sendMessage: function() {
        var url = "/ta/message";
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                token: localStorage.token,
                message: this.state.messageText
            },
            success: function(res) {
                this.setState({messageText: "", showMessage: false});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        })
    },
    showEmpty: function() {
      this.setState({emptyQueue: true});
    },
    showMessage: function() {
        this.setState({showMessage: true});
    },
    toggleQueue: function() {
        this.state.active ? this.disableQueue() : this.enableQueue();
        var items = navBarStore.items;
        var itemIndex = items.findIndex(function(e, i, a) {
            return e.callback == this.toggleQueue;
        }.bind(this));
        items[itemIndex] = {
            callback: this.toggleQueue,
            label: this.state.active ? "Start" : "Stop"
        };
        navBarStore.setItems(items);
    },
    updateMessageText: function(event) {
        this.setState({messageText: event.target.value});
    },
  componentDidMount: function() {
      var items = [
          {callback: this.toggleQueue, label: (this.state.active ? "Start" : "Stop")},
          {callback: this.getNext, label: "Next"},
          {callback: this.showEmpty, label: "Empty"},
          {callback: this.showMessage, label: "Message"}];
      navBarStore.setItems(items);
      this.getQueue();
      setInterval(this.getQueueStatus, 2000);
  },
  onChange: function() {},

  render: function() {
      console.log("rendering");
      var index = 0;
    return (
        <div className="container-fluid" style={{height: "71%", overflow: "auto"}}>
            <div className="row">
                <div className="col-xs-10 col-xs-offset-1">
                    <table className="table table-responsive">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Room</th>
                            <th>Description</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.queue != null ? this.state.queue.map(function(student) {
                            ++index;
                            return(<tr>
                                <td>{index}</td>
                                <td>{student.user.name}</td>
                                <td>{student.room}</td>
                                <td>{student.description}</td>
                                <td><button className="btn btn-default" onClick={this.removeStudent.bind(this, index - 1)}>Remove</button></td>
                            </tr>);
                        }.bind(this)) : null}
                        </tbody>
                    </table>
                </div>
            </div>
            {this.state.student != null ?
                <Modal show="true" onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.student.name} in Room {this.state.student.room}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Description: {this.state.student.description}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-info" onClick={this.closeModal}>Close</button>
                    </Modal.Footer>
                </Modal>: null}
            {this.state.emptyQueue ?
                <Modal show="true" onHide={this.closeEmpty}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Empty Queue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>WARNING: This action is not undoable.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-default" onClick={this.closeEmpty}>Cancel</button>
                        <button className="btn btn-info" onClick={this.emptyQueue}>Confirm</button>
                    </Modal.Footer>
                </Modal>
                : null}
            {this.state.showMessage ?
                <Modal show="true" onHide={this.closeMessage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Send Message to All Students</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Input type="textarea" placeholder="Please enter your message" onChange={this.updateMessageText}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-default" onClick={this.closeModal}>Close</button>
                        <button className="btn btn-info" onClick={this.sendMessage}>Send</button>
                    </Modal.Footer>
                </Modal>: null}
        </div>
    );
  }
});

var Student = React.createClass({
    getInitialState: function() {
        return {room: null, description: null, position: -1, size: 0, active: false, message: null};
    },
    closeModal: function() {
      this.setState({message: null});
    },
    getPosition: function() {
      var url = "/student/position";
        $.ajax({
           url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                token: localStorage.token
            },
            success: function(res) {
                if (res.message) {
                    navBarStore.setCount(res.size);
                    this.setState({active: res.active, size: res.size, position: res.position, message: res.message});
                } else if (this.state.active != res.active || this.state.size != res.size || this.state.position != res.position) {
                    navBarStore.setCount(res.size);
                    this.setState({active: res.active, size: res.size, position: res.position});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    },
    join: function() {
        console.log("joining queue");
        var url = "/student/add";
        $.ajax({
            url: url,
            type: 'POST',
            data: {
              token: localStorage.token,
                room: this.state.room,
                description: this.state.description
            },
            // on success, update queue
            success: function() {
                this.getPosition();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    leave: function() {
        var url = "/student/remove";
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                token: localStorage.token
            },
            success: function() {
                this.getPosition();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    updateRoom: function(event) {
      this.setState({room: event.target.value});
    },
    updateDescription: function(event) {
        this.setState({description: event.target.value});
    },
    componentDidMount: function() {
        navBarStore.setItems(null);
        this.getPosition();
        setInterval(this.getPosition, 2000);
    },
    testing: function() {
        console.log("testing!");
    },
    render: function() {
        console.log("rendering");
        return (
            <div className="container-fluid">
                <div className="row">
                    {this.state.active ?
                        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
                            {this.state.position != -1 ?
                                <div className="text-center">
                                    {this.state.position == 0 ?
                                        <h2>You are next</h2>:
                                        (this.state.position == 1 ?
                                            <h2>There is 1 person in front of you</h2>:
                                            <h2>There are {this.state.position} people in front of you</h2>)}
                                    <button className="btn btn-danger" onClick={this.leave}>Leave Queue</button>
                                </div>:
                                <div className="row">
                                    <div className="col-xs-5">
                                        <input type="text" className="form-control" placeholder="Room (ie. 1030)" onChange={this.updateRoom}/>
                                    </div>
                                    <div className="col-xs-5">
                                        <input type="text" className="form-control" placeholder="Description" onChange={this.updateDescription}/>
                                    </div>
                                    <div className="col-xs-2">
                                        <button className="btn btn-info" onClick={this.join}>Join Queue</button>
                                    </div>
                                </div>}
                        </div>:
                        <h2>Queue not active</h2>}
                </div>
                {this.state.message != null ?
                    <div>
                        <Modal show={this.state.message.type == "helping"} onHide={this.closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>The TA should arrive shortly</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Please do not add yourself back onto the queue until the TA arrives.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-info" onClick={this.closeModal}>Close</button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.message.type == "removed"} onHide={this.closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>You have been removed from the queue</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>If you feel you have been removed without reason, please contact a TA.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-info" onClick={this.closeModal}>Close</button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.message.type == "message"} onHide={this.closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Message from the TAs</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>{this.state.message.value}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-info" onClick={this.closeModal}>Close</button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                : null}

            </div>
        );
    }
});

var navBarStore = {
    items: null,
    listeners: [],
    count: 0,

    emitChange(trigger) {
        this.listeners.forEach(function(listener) {
            if (listener.trigger == trigger) {
                listener.callback();
            }
        });
    },

    addChangeListener(cb, trigger) {
        this.listeners.push({callback: cb, trigger: trigger});
    },

    removeChangeListener(cb, trigger) {
        this.listeners.splice(this.listeners.indexOf({callback: cb, trigger: trigger}), 1);
    },

    setItems(items) {
        this.items = items;
        this.emitChange('items');
    },

    setCount(count) {
        this.count = count;
        this.emitChange('count');
    }
}

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
    <Route component={App}>
    <Route path="/" component={Home}/>
    <Route path="/login" component={Login}/>
    <Route path="/recover" component={Recover}/>
    <Route path="/ta" component={TA}/>
    <Route path="/student" component={Student}/>
    </Route>
   
  </Router>
);

ReactDOM.render(routes, document.getElementById('content'));