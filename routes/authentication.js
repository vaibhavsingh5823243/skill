const emailsender = require('./email');
const database = require('./databases');
const config = require('./config');
const tableName = config.userDb;

class Authentication {
    verification(req, res) {
        let email = req.body.email;
        database.isExist(email, tableName, (cbData) => {
            if (req.url === '/forgetpassword') {
                if (cbData) {
                    let otp = Math.floor((Math.random() * 1000000) + 1)
                    let data = `Your otp for password reset is:${otp}`;
                    emailsender.email(email, data, (cbvalue) => {
                        res.send(`${otp}`);
                    });
                }
                else {
                    res.send(false); // user does not exist
                }
            }
            else {
                if (cbData === false) {
                    let otp = Math.floor((Math.random() * 1000000) + 1)
                    let data = `Your otp for email verification is:${otp}`;
                    emailsender.email(email, data, (cbvalue) => {
                        res.send(`${otp}`);
                    });
                }
                else {
                    res.send(true);//user already exist
                }
            }
        })
    }

    registration(req, res) {
        let userInfo = req.body;
        delete userInfo['password1'];
        userInfo['user_role'] = 'student';
        userInfo['usercode'] = 'stu_' + `${new Date().getTime()}`;
        console.log(req.body);
        database.insert(userInfo, tableName, (cbData) => {
            res.send(cbData);
        });
    }

    login(req, res) {
        let userInfo = req.body;
        database.validate(userInfo, tableName, (cbData) => {
            res.send(`${cbData}`);
        });

    }

    update(req, res) {
        let userInfo = req.body;
        database.update(userInfo, tableName, (cbData) => {
            res.send(cbData);
        })
    }
}

module.exports = new Authentication();