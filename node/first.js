/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   first.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/14 03:13:00 by caguillo          #+#    #+#             */
/*   Updated: 2025/06/14 04:00:52 by caguillo         ###   ########.fr       */
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