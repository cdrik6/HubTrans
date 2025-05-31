/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/28 00:42:02 by caguillo          #+#    #+#             */
/*   Updated: 2025/05/30 21:25:40 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const fastify = require('fastify')( {logger: true} );

// Declare a route
fastify.get('/hello',
  function (request, reply)
  {
    reply.send( {message: 'hello world'} )    
  }
);

fastify.get('/',
  function (request, reply)
  {
    reply.send( {message: 'global route here'} )    
  }
);

// Run the server!
fastify.listen({ port: 3000 },
  function (err, address)
  {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  // Server is now listening on ${address}
  }
);
