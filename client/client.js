const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');

function callGreetings() {
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

function callSum() {
	let client = new calcService.CalculatorServiceClient(
		'localhost:5000',
		grpc.credentials.createInsecure()
	);

	let sumReqest = new calc.SumRequest();
	sumReqest.setFirstNumber(10);
	sumReqest.setSecondNumber(10);
	client.sum(sumReqest, (err, res) => {
		if (!err) {
			console.log(`Response; ${res.getSumResult()}`);
		} else {
			console.error(err.message);
		}
	});
}

function main() {
	console.log('hello from client.');
	// callGreetings();
	callSum();
}

main();
