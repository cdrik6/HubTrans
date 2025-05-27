/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fastify.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 05:58:03 by caguillo          #+#    #+#             */
/*   Updated: 2025/05/09 06:08:00 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// server.js
import Fastify from 'fastify';

const fastify = Fastify();

fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify!' };
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});