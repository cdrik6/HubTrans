/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   first.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/14 03:13:00 by caguillo          #+#    #+#             */
/*   Updated: 2025/07/20 03:57:50 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let http = require('http');
let dt = require('./mymodule');

const reqHandler = function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write("The date and time are currently: " + dt.myDateTime());
    res.write("Hello World!");
    res.write(req.url);
    res.end();
}

http.createServer(reqHandler).listen(8080); 

// Summary of Differences
// Feature	package.json	package-lock.json
// Written by:	You (or tools like npm init)	Automatically by npm
// Purpose:	Describes what your project needs	Describes exactly what was installed
// Contains version ranges:	Yes (^, ~, etc.)	No, exact versions only
// Tracks nested deps:	No	Yes
// Should be committed?:	✅ Yes	✅ Yes
// Used for install:	✅ Yes	✅ Yes — for reproducibility