var Database = require("../classes/Database.js");

var fs = require("fs");

var LogController = function() {
  function getLogs(req, res, path) {
    var dateTime = new Date().toLocaleString();
    
    // Database.select('id, err, badge, created_at, is_read', 'tbl_logs', null, 'id DESC', 20, (data) => {
    //   res.render(path, data);
    // });

    fs.readFile('./db/logs.json', 'utf8', (err, fdata) => {
      if (err) throw err;
      var data = [];
      var datas = fdata.split('\n');
      var len = datas.length < 100 ? datas.length : 100;
      for(var i = len-1;i > 0;i--) {
        var d = JSON.parse(datas[i]);
        d.info = JSON.stringify(d);
        data.push(d);
      }
      var result = {data: data};
      res.render(path, result);
    });

  }
  
  function addLog(io, req, res) {
    var params = req.body;
    
    var d = new Date(params.datetime),
        dformat = [d.getFullYear() ,d.getMonth()+1, d.getDate()].join('-') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

    var logException = {
      err: params.error,
      file_name: params.filename,
      line_no: params.line,
      col_no: params.column,
      stack_trace: params.stackTrace,
      referrer_url: req.headers.referer,
      created_at: new Date(),
      updated_at: new Date(),
      client_time: dformat,
      user_agent: params.userAgent,
      all_params: JSON.stringify(params),
      badge: params.badge
    };
    
    // TODO: Validate
    // Database.insert('tbl_logs', logException, (data) => {
    //   var sendData = data.record;
    //       sendData.id = data.id;
      
    //   io.emit('exception-logged', {
    //     data: sendData
    //   });
      
    //   res.send(JSON.stringify({
    //     success: true
    //   }));
    // });

    var path = './db/logs.json',
        states = fs.statSync(path);
    console.log(states.size)
    if(states.size > 10*1024*1024) {
      fs.unlinkSync(path);
    }
    fs.appendFile('./db/logs.json', '\n'+JSON.stringify(logException), (err) => {
      if (err) throw err;
      var sendData = logException;
      // sendData.id = data.id;
      
      io.emit('exception-logged', {
        data: sendData
      });
      
      res.send(JSON.stringify({
        success: true
      }));
    });

  }
  
  function getExceptionData(req, res) {
    var params = req.body;
    
    Database.select('*', 'tbl_logs', 'id = ' + params.id, 'id DESC', 20, (data) => {
      res.send(data);
    });
  }
  
  function markExceptionAsRead(req, res) {
    var params = req.body;
    
    Database.update('tbl_logs', ['is_read'], [1], ['id'], [params.id], (data) => {
      res.send(data);
    });
  }
  
  return {
    getLogs: getLogs,
    addLog: addLog,
    getExceptionData: getExceptionData,
    markExceptionAsRead: markExceptionAsRead
  }
}

module.exports = LogController();