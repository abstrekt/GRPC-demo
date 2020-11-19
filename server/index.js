const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const grpc = require('grpc');

// Implement the greet RPC method

function greet(call, callback) {
	let greeting = new greets.GreetResponse();

	greeting.setResult(
		'Hello ' +
			call.request.getGreeting().getFirstName() +
			' ' +
			call.request.getGreeting().getLastName()
	);

	callback(null, greeting);
}

function main() {
	let server = new grpc.Server();
	server.addService(service.GreetServiceService, { greet: greet });
	server.bind(
		'127.0.0.1:5000',
		grpc.ServerCredentials.createInsecure()
	);
	server.start();

	console.log(`Server running on port: 127.0.0.1:5000`);
}

main();
