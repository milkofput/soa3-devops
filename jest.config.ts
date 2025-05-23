/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
        '!src/**/*..spec.ts',
        '!**/node_modules/**',
        '!src/infrastructure/**',
    ],
    testMatch: ['**/*.jest.test.ts', '**/*.jest.spec.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text'],
    verbose: true,
};
