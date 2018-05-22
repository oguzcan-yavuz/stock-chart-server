# stock-chart-server
Freecodecamp Dynamic Web Application Project: Chart the Stock Market

### My Notes:

- Using `json: true` option with request-promise messes up the data structure
when working with WebSockets. After I delete that option and send the data 
returned from request-promise directly to the client without any parsing, 
I was able to `JSON.parse()` it at the client side without any problems.
