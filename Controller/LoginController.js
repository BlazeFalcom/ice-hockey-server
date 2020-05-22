var ws = require('ws');
var UserClass = require('../Model/User');
var LoginRecordClass = require('../Model/LoginRecord');
var UserSerivce = require('../Service/UserSerivce');
var LoginRecordSerivce = require('../Service/LoginRecordSerivce');
var server=new ws.Server({
    host: "192.168.1.6",
    port: "12001",
});

server.on('connection', function (conn) {

    conn.on('message', function (message) {
        var userjson = JSON.parse(message);
        var user = UserClass.User(userjson.username, userjson.password, null, null);
        var loginRecord = LoginRecordClass.LoginRecord(null, userjson.username);
        UserSerivce.Login(user, function(result) {
            if(result) {
                conn.send("登录成功");
                LoginRecordSerivce.AddRecord(loginRecord,function(result){
                    if(result > 0) {
                        console.log("登录记录成功");
                    } else {
                        console.log("登录记录失败");
                    }
                });
            } else {
                conn.send("登录失败");
            }
        })
    });
    //断开连接时调用
    conn.on("close", function() {
        console.log("client close");
    });

    // 发生错误时调用
    conn.on("error", function(err) {
        console.log("client error", err);
    });
});