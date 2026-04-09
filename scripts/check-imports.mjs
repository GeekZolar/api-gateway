// Run: node scripts/check-imports.mjs
// No tsx - pure Node. If this hangs on step 2, the issue is loading @nestjs/core in Node.

const log = (msg) =>
  console.log(`[${new Date().toISOString().slice(11, 23)}] ${msg}`);

async function run() {
  log('1: start');
  await import('@nestjs/core').then(() => log('2: @nestjs/core'));
  await import('@nestjs/config').then(() => log('3: @nestjs/config'));
  await import('@nestjs/common').then(() => log('4: @nestjs/common'));
  log('5: done');
}
run();
