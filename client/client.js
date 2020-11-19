const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const grpc = require('grpc');

function main() {
	console.log('hello from client.');
	let client = new service.GreetServiceClient(
		'localhost:5000',
		grpc.credentials.createInsecure()
	);

	// we do stuff
	let request = new greets.GreetRequest();
	// created a protocol buffer greeting msg
	let greeting = new greets.Greeting();
	greeting.setFirstName('Samiran');
	greeting.setLastName('Konwar');
	// set the greeting
	request.setGreeting(greeting);

	client.greet(request, (err, res) => {
		if (!err) {
			console.log('Greeting Response: ', res.getResult());
		} else {
			console.error(err);
		}
	});
}

main();
