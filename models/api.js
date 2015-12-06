var app = require('./express.js');
var User = require('./user.js');

// setup body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));

//
// API
//


/********************************************************
*
* LOGIN
*
*********************************************************/


/**
* REGISTER
*   - register a new user.
*   params
*       - username
*       - password and conformation password
*       - name
*       - classkey
*   return
*       - name
*       - token
*       - permissions (true = ta, false = student)
*/
app.post('/register', function (req, res) {
    // find or create the user with the given username
    User.findOrCreate({username: req.body.username}, function(err, user, created) {
        if (created) {
            // if this username is not taken, then create a user record
            user.name = req.body.name;
            user.set_password(req.body.password);
            user.classkey = req.body.classkey;
            console.log(req.body.classkey);
            try{
                user.checkPerm(user.classkey, user);
            } catch(e){
                User.find(user).remove().exec(); // trying to delete user if bad key
                console.log(e);
                res.sendStatus("403");
                return;
            }
            user.timesInQ = 0;
            user.save(function(err) {
        		if (err) {
                    User.find(user).remove().exec(); //trying to delete user if bad key
        		    res.sendStatus("403");
        		    return;
        		}
                // create a token
        		var token = User.generateToken(user.username);
                // return value is JSON containing the user's name and token
                res.json({name: user.name, token: token, perm: user.perm});
            });
        } else {
            // return an error if the username is taken
            res.sendStatus("403");
        }
    });
});


/**
* LOGIN
*   - login a user.
*   params
*       - username
*       - password
*   return
*       - name
*       - token
*       - permissions (true = ta, false = student)
*/
app.post('/login/verify', function (req, res) {
    // find the user with the given username
    User.findOne({username: req.body.username}, function(err,user) {
	if (err) {
	    res.sendStatus(403);
	    return;
	}
        // validate the user exists and the password is correct
        if (user && user.checkPassword(req.body.password)) {
            // create a token
            var token = User.generateToken(user.username);
            // return value is JSON containing user's name and token
            res.json({name: user.name, token: token, perm: user.perm});
        } else {
            res.sendStatus(403);
        }
    });
});


/**
* PASSWORD RESET
*   - ta can reset a password.
*   params
*       - username
*       - new password
*   return
*       - status 
*/
app.post('/reset', function (req,res){
    User.findOne({username: req.body.username}, function(err,user) {
        if (err) {
            res.sendStatus(403);
            return;
        }
        if (user) {
            user.password = req.body.newPassword;
            user.save(function(err) {
                if (err) {
                    res.sendStatus(403);
                    return;
                }
                res.sendStatus(200)
            });
        } else {
            res.sendStatus(403);
        }
    });
});


/********************************************************
*
* QUEUE
*
*********************************************************/


//the queue
var q = []
//state of the queue
var qActive = false;


/**
* GET QUEUE INFO
*   - will send size of queue.
*   params - none
*   return
*       - queue size
*       - queue active
*/
app.get('/q/status', function(req,res){
    res.json({size: q.length, active: qActive});
});


/**
* GET POSITION
*   - will send users position.
*   params
*       - token
*   return
*       - position
*       - queue size
*       - queue active
*/
app.get('/q/get/position', function(req,res){
    var token = req.body.token;
    
    User.verifyToken(token, function(user){
        if(user){
            var pos = q.indexOf(user);
            res.json({position: pos, size: q.length, active: qActive});
        }else{
            res.sendStatus(403);
        }
    });
});



/********************************************************
*
* QUEUE CONTROL -- TA
*
*********************************************************/



/**
* START
*   - will signal for adding to be enabled.
*   params
*       - token
*   return
*       - status
*/
app.post('/ta/start', function(req,res){
    var token = req.body.token;
    
    User.verifyToken(token, function(user){
        if(user && user.perm){
            qActive = true;
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    });
});


/**
* STOP
*   - will signal for adding to be disabled.
*   params
*       - token
*   return
*       - status
*/
app.post('/ta/stop', function(req,res){
    var token = req.body.token;

    User.verifyToken(token, function(user){
        if(user && user.perm){
            qActive = false;
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    });
});


/**
* EMPTY
*   - will empty the queue.
*   params
*       - token
*   return
*       - status
*/
app.post('/ta/empty', function(req,res){
    var token = req.body.token;

    User.verifyToken(token, function(user){
        if(user && user.perm){
            q = [];
            res.sendStatus(200);
        }else{
            res.sendStatus(403);
        }
    });
});


/**
* GET NEXT / REMOVE TOP
*   - will remove the student from the front of the queue if it student is there
*   params
*       - token
*   return
*       - name
*       - queue length
*/
app.get('/ta/next', function(req,res){
    var token = req.body.token;

    if(qActive){
        User.verifyToken(token,function(user){
            if(user){
                if(user.perm && q.length > 0){
                    var nextStu = q.shift();
                    res.json({name: nextStu.name,size: q.length});
                }else
                    res.sendStatus(403);
            }else{
                res.sendStatus(403);
            }
        });
    }else
        res.sendStatus(403);
});



/********************************************************
*
* QUEUE CONTROL -- STUDENT
*
*********************************************************/


/**
* ADD
*   - will add the student to queue, if not already there.
*   params
*       - token
*   return
*       - status
*/
app.post('/student/add', function(req,res){
    var token = req.body.token;

    if(qActive){
        User.verifyToken(token, function(user){
            if(user){
                if(!user.perm){
                    if(q.indexOf(user) == -1){
                        q.push(user);
                        res.sendStatus(200);
                    }else
                        res.sendStatus(403);
                }
                else
                    res.sendStatus(403);
            }else{
                res.sendStatus(403);
            }
        });
    }else
        res.sendStatus(403);

});


/**
* REMOVE
*   - will remove the student from the queue if it student is there
*   params
*       - token
*   return
*       - status
*/
app.post('/student/remove', function(req,res){
    var token = req.body.token;

    if(qActive){
        User.verifyToken(token,function(req,res){
            if(user){
                var userPos = q.indexOf(user);
                if(userPos != -1){
                    q.splice(userPos,1);
                    res.sendStatus(200);
                }else
                    res.sendStatus(403);
                
            }else{
                res.sendStatus(403);
            }
        });
    }else
        res.sendStatus(403);
});