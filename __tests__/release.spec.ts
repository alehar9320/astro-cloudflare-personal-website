import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as child_process from 'child_process';

const fsMock = fs as typeof fs & {
  default: {
    appendFileSync: ReturnType<typeof vi.fn>;
    writeFileSync: ReturnType<typeof vi.fn>;
  };
};

vi.mock('fs', () => ({
  appendFileSync: vi.fn(),
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  default: {
    appendFileSync: vi.fn(),
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

vi.mock('child_process', () => {
  const execSync = vi.fn();
  return {
    execSync,
    default: {
      execSync,
    },
  };
});

describe('release script', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
    delete process.env.GITHUB_OUTPUT;
    vi.resetModules();
  });

  it('writes the version to GITHUB_OUTPUT without mutating tracked files', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from('v1.0.0'));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await import('../scripts/release.js?t=' + Date.now());

    expect(fsMock.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('version=2023.01.01.1200')
    );
    expect(fsMock.default.writeFileSync).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'release_script_start', version: '2023.01.01.1200' })
    );
  });

  it('formats changelog output from commits since the last tag', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log'))
        return Buffer.from('feat: new feature\nfix: bug fix');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 1));

    expect(fsMock.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('- feat: new feature\n- fix: bug fix')
    );
  });

  it('skips [skip ci] commits and falls back to internal CI updates when needed', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log'))
        return Buffer.from('chore: refresh metadata [skip ci]');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 2));

    expect(fsMock.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('- Internal CI updates.')
    );
  });

  it('handles missing tags by using the full git log', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) throw new Error('No tags');
      return Buffer.from('feat: initial release');
    });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await import('../scripts/release.js?t=' + (Date.now() + 3));

    expect(fsMock.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('- feat: initial release')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'release_script_no_tags', error: expect.stringContaining('No tags') })
    );
  });

  it('falls back to no documented changes when git log is unavailable', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log')) throw new Error('Git log failed');
      return Buffer.from('');
    });
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await import('../scripts/release.js?t=' + (Date.now() + 4));

    expect(fsMock.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('- No documented changes.')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'release_script_git_log_error', error: expect.stringContaining('Git log failed') })
    );
  });

  it('exits when writing GitHub output fails', async () => {
    process.env.GITHUB_OUTPUT = 'invalid_path';
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from('v1.0.0'));
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fsMock.default.appendFileSync.mockImplementation(() => {
      throw new Error('Write failed');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 5));

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'release_script_output_error', error: expect.stringContaining('Write failed') })
    );
  });

  it('handles non-Error exceptions in telemetry logging', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) throw 'Fatal Git Error';
      if (typeof cmd === 'string' && cmd.includes('log')) return Buffer.from('feat: test');
      return Buffer.from('');
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await import('../scripts/release.js?t=' + (Date.now() + 7));

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'release_script_no_tags',
        error: 'Fatal Git Error',
      })
    );
  });
  it('skips writing to GITHUB_OUTPUT if the environment variable is not set', async () => {
    delete process.env.GITHUB_OUTPUT;
    vi.resetModules();
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from('v1.0.0'));

    await import('../scripts/release.js?t=' + (Date.now() + 6));

    expect(fsMock.default.appendFileSync).not.toHaveBeenCalled();
  });
});
