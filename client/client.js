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

function callGreetManyTimes() {
	let client = new service.GreetServiceClient(
		'localhost:5000',
		grpc.credentials.createInsecure()
	);

	// create request
	let request = new greets.GreetManyTimesRequest();
	let greeting = new greets.Greeting();
	greeting.setFirstName('Paeolo');
	greeting.setLastName('Sereo');

	request.setGreeting(greeting);

	let call = client.greetManyTimes(request, () => {});

	call.on('data', res => {
		console.log('Client Streaming Response: ', res.getResult());
	});

	call.on('status', status => {
		console.log(`Status: ${status}`);
	});

	call.on('error', err => {
		console.log(`error: ${err.message}`);
	});

	call.on('end', () => {
		console.log('Streaming Ended.');
	});
}

function callPrimeNumberDecomposition() {
	const client = new calcService.CalculatorServiceClient(
		'localhost:5000',
		grpc.credentials.createInsecure()
	);

	const request = new calc.PrimeNumberDecompositionRequest();

	const number = 567890;

	request.setNumber(number);

	const call = client.primeNumberDecomposition(request, () => {});

	call.on('data', res => {
		console.log('Prime factor: ', res.getPrimeFactor());
	});

	call.on('status', status => {
		console.log(`Status: ${status}`);
	});

	call.on('error', err => {
		console.log(`error: ${err.message}`);
	});

	call.on('end', () => {
		console.log('Streaming Ended.');
	});
}

function main() {
	console.log('hello from client.');
	// callGreetings();
	// callSum();
	// callGreetManyTimes();
	callPrimeNumberDecomposition();
}

main();
