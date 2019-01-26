module.exports = {
    verbose: true,
    transform: {
        ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    },
    testEnvironment: "node",
    testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    setupTestFrameworkScriptFile: "./test/_setup.ts",
    moduleFileExtensions: ["ts", "tsx", "js"],
    coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
    collectCoverageFrom: ["src/*.{js,ts,tsx}"],
};