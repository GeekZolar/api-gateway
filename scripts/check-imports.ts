// Run: npx tsx scripts/check-imports.ts
// Shows which import is slow or hanging.

const log = (msg: string) =>
  console.log(`[${new Date().toISOString().slice(11, 23)}] ${msg}`);

(async () => {
  log('1: start');
  await import('@nestjs/core').then(() => log('2: @nestjs/core'));
  await import('@nestjs/config').then(() => log('3: @nestjs/config'));
  await import('@nestjs/common').then(() => log('4: @nestjs/common'));
  await import('reflect-metadata').then(() => log('5: reflect-metadata'));
  await import('typeorm').then(() => log('6: typeorm'));
  await import('pg').then(() => log('7: pg'));
  await import('bcrypt').then(() => log('8: bcrypt'));
  await import('../src/config/gateway.config').then(() => log('9: gateway.config'));
  await import('../src/app.module').then(() => log('10: app.module'));
  log('11: done');
})();
