module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true
        }]
    },
    testMatch: ['**/*.test.ts'],
    extensionsToTreatAsEsm: ['.ts']
}; 