import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const originalCwd = process.cwd();
const originalContainerImage = process.env.CONTAINER_IMAGE;
const originalContainerImageBase = process.env.CONTAINER_IMAGE_BASE;

async function loadConfigFrom(cwd: string) {
  process.chdir(cwd);
  delete process.env.CONTAINER_IMAGE;
  delete process.env.CONTAINER_IMAGE_BASE;
  vi.resetModules();
  return import('./config.js');
}

describe('container image config', () => {
  afterEach(() => {
    process.chdir(originalCwd);
    if (originalContainerImage === undefined) delete process.env.CONTAINER_IMAGE;
    else process.env.CONTAINER_IMAGE = originalContainerImage;
    if (originalContainerImageBase === undefined) delete process.env.CONTAINER_IMAGE_BASE;
    else process.env.CONTAINER_IMAGE_BASE = originalContainerImageBase;
  });

  it('reads CONTAINER_IMAGE from .env for host CLI rebuilds', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nanoclaw-config-'));
    fs.writeFileSync(path.join(tmp, '.env'), 'CONTAINER_IMAGE=nanoclaw-agent-v2-test:ssh-client\n');

    const config = await loadConfigFrom(tmp);

    expect(config.CONTAINER_IMAGE).toBe('nanoclaw-agent-v2-test:ssh-client');
  });
});
