// Mock expo-modules-core to avoid native module errors in unit tests
jest.mock('expo-modules-core', () => ({}), { virtual: true });
