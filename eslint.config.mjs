import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: {
                process: "readonly",
                console: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                Express: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            jsdoc,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "jsdoc/require-jsdoc": "error",
            "jsdoc/require-param-type": "error",
            "jsdoc/require-returns-type": "error",
        },
    },
    {
        files: ["test/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: {
                process: "readonly",
                console: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                Express: "readonly",
                describe: "readonly",
                it: "readonly",
                beforeEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                afterEach: "readonly",
                expect: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            jsdoc,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "jsdoc/require-jsdoc": "off",
        },
    },
    {
        files: ["**/*.interface.ts"],
        rules: {
            "jsdoc/require-jsdoc": "off",
        },
    },
];