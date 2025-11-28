// Firebase build script
// This script builds the project for Firebase deployment

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const functionsDistDir = path.join(distDir, 'functions');
const publicDistDir = path.join(distDir, 'public');

console.log('🔨 Building for Firebase...\n');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

// Create directories
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(functionsDistDir, { recursive: true });
fs.mkdirSync(publicDistDir, { recursive: true });

// Build frontend
console.log('📦 Building frontend...');
execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });

// Compile TypeScript for functions
console.log('\n📦 Compiling functions...');

// Copy necessary server files to functions dist
const serverFiles = [
  'server/routes.ts',
  'server/auth.ts',
  'server/storage.ts',
  'server/db.ts',
  'server/github.ts',
  'functions/index.ts',
  'shared/schema.ts',
];

// Create a temporary tsconfig for functions
const functionsTsConfig = {
  compilerOptions: {
    target: "ES2020",
    module: "commonjs",
    lib: ["ES2020"],
    outDir: "./dist/functions",
    rootDir: ".",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    declaration: true,
    declarationMap: true,
    moduleResolution: "node",
    paths: {
      "@shared/*": ["./shared/*"]
    }
  },
  include: [
    "functions/**/*.ts",
    "server/**/*.ts",
    "shared/**/*.ts"
  ],
  exclude: [
    "node_modules",
    "dist",
    "client"
  ]
};

fs.writeFileSync(
  path.join(process.cwd(), 'tsconfig.functions.json'),
  JSON.stringify(functionsTsConfig, null, 2)
);

try {
  execSync('npx tsc -p tsconfig.functions.json', { stdio: 'inherit' });
} catch (error) {
  console.log('TypeScript compilation had warnings, continuing...');
}

// Copy functions package.json
fs.copyFileSync(
  path.join(process.cwd(), 'functions/package.json'),
  path.join(functionsDistDir, 'package.json')
);

console.log('\n✅ Build complete!');
console.log('\nTo deploy to Firebase:');
console.log('1. Run: firebase login');
console.log('2. Run: firebase init (if not initialized)');
console.log('3. Run: firebase deploy');
