nuget = require '../index'
nuget.search 'jquery', (err,res) -> console.log JSON.stringify err || res, null, 2

