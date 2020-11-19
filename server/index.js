const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');
const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');

//! Implement the greet RPC method

function sum(call, callback) {
	let sumResponse = new calc.SumResponse();
	sumResponse.setSumResult(
		call.request.getFirstNumber() + call.request.getSecondNumber()
	);
	callback(null, sumResponse);
}

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
// studding
function GreetManyTimes(call, callback) {
	let firstName = call.request.getGreeting().getFirstName();

	let count = 0,
		intervalID = setInterval(function () {
			let GreetManyTimesResponse = new greets.GreetManyTimesResponse();

			GreetManyTimesResponse.setResult(firstName);

			// setup streaming
			call.write(GreetManyTimesResponse);
			if (++count > 9) {
				clearInterval(intervalID);
				call.end(); //we've sent all messages;
			}
		}, 1000);
}

function primeNumberDecomposition(call, callback) {
	let number = call.request.getNumber();
	let divisor = 2;

	while (number > 1) {
		if (number % divisor === 0) {
			const primeNumberDecompositionResponse = new calc.PrimeNumberDecompositionResponse();
			primeNumberDecompositionResponse.setPrimeFactor(divisor);
			number /= divisor;

			// write the message using call.write
			call.write(primeNumberDecompositionResponse);
		} else {
			divisor += 1;
			console.log('Divisor: ', divisor);
		}
	}
	call.end(); // all messages sent!;
}

function main() {
	let server = new grpc.Server();
	server.addService(calcService.CalculatorServiceService, {
		sum: sum,
		primeNumberDecomposition,
	});
	// server.addService(service.GreetServiceService, {
	// 	greet: greet,
	// 	GreetManyTimes: GreetManyTimes,
	// });
	server.bind(
		'127.0.0.1:5000',
		grpc.ServerCredentials.createInsecure()
	);

	server.start();

	console.log(`Server running on port: 127.0.0.1:5000`);
}

main();
