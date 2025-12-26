const mockServerLocationData = {
  IAD: "Ashburn",
  LAX: "Los Angeles",
  JFK: "New York"
};

const mockCdnCgiTrace = {
  ip: "192.168.1.1",
  loc: "US",
  colo: "IAD",
  ts: "1234567890.123"
};

const mockHttpsResponse = {
  headers: {
    "server-timing": "cfRequestDuration;dur=50.0"
  }
};

const mockPerformanceTiming = [
  100,  // started
  110,  // dnsLookup
  120,  // tcpHandshake
  130,  // sslHandshake
  140,  // ttfb
  200,  // ended
  50.0  // server processing time
];

function createMockResponse(data) {
  const mockResponse = {
    on: jest.fn(),
    once: jest.fn(),
    headers: mockHttpsResponse.headers
  };

  // Simulate data events
  setTimeout(() => {
    const dataCallback = mockResponse.on.mock.calls.find(call => call[0] === 'data')?.[1];
    if (dataCallback) dataCallback();

    const endCallback = mockResponse.on.mock.calls.find(call => call[0] === 'end')?.[1];
    if (endCallback) endCallback();

    const readableCallback = mockResponse.once.mock.calls.find(call => call[0] === 'readable')?.[1];
    if (readableCallback) readableCallback();
  }, 10);

  return mockResponse;
}

function createMockRequest() {
  const mockRequest = {
    on: jest.fn(),
    write: jest.fn(),
    end: jest.fn()
  };

  // Simulate socket events
  setTimeout(() => {
    const mockSocket = {
      on: jest.fn()
    };

    const socketCallback = mockRequest.on.mock.calls.find(call => call[0] === 'socket')?.[1];
    if (socketCallback) {
      socketCallback(mockSocket);

      // Simulate socket events
      setTimeout(() => {
        const lookupCallback = mockSocket.on.mock.calls.find(call => call[0] === 'lookup')?.[1];
        if (lookupCallback) lookupCallback();

        const connectCallback = mockSocket.on.mock.calls.find(call => call[0] === 'connect')?.[1];
        if (connectCallback) connectCallback();

        const secureConnectCallback = mockSocket.on.mock.calls.find(call => call[0] === 'secureConnect')?.[1];
        if (secureConnectCallback) secureConnectCallback();
      }, 5);
    }
  }, 5);

  return mockRequest;
}

module.exports = {
  mockServerLocationData,
  mockCdnCgiTrace,
  mockHttpsResponse,
  mockPerformanceTiming,
  createMockResponse,
  createMockRequest
};
