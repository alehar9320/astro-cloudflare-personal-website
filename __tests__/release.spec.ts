import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as child_process from 'child_process';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
  appendFileSync: vi.fn(),
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    appendFileSync: vi.fn(),
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
  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should generate a version based on current date', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from('tag1'));

    await import('../scripts/release.js?t=' + Date.now());

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'src/data/version.json',
      expect.stringContaining('2023.01.01.1200')
    );
  });

  it('should create src/data directory if it does not exist', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(false);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from(''));

    await import('../scripts/release.js?t=' + (Date.now() + 1));

    expect(fs.default.mkdirSync).toHaveBeenCalledWith('src/data', { recursive: true });
  });

  it('should handle missing tags gracefully', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n'
    );
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) throw new Error('No tags');
      return Buffer.from('commit1');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 2));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringContaining('## [2023.01.01.1200]')
    );
  });

  it('should format changelog entry correctly with commits', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log'))
        return Buffer.from('feat: new feature\nfix: bug fix');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 3));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringContaining('- feat: new feature\n- fix: bug fix')
    );
  });

  it('should skip [skip ci] commits', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log'))
        return Buffer.from('feat: new feature\nchore: update [skip ci]');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 4));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.not.stringContaining('chore: update [skip ci]')
    );
  });

  it('should use internal CI updates message if all commits are skipped', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log'))
        return Buffer.from('chore: update [skip ci]');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 10));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringContaining('- Internal CI updates.')
    );
  });

  it('should write to GITHUB_OUTPUT if available', async () => {
    process.env.GITHUB_OUTPUT = 'mock_github_output';
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from('tag1'));

    await import('../scripts/release.js?t=' + (Date.now() + 5));

    expect(fs.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('version=2023.01.01.1200')
    );
    expect(fs.default.appendFileSync).toHaveBeenCalledWith(
      'mock_github_output',
      expect.stringContaining('changelog<<EOF')
    );
    delete process.env.GITHUB_OUTPUT;
  });

  it('should handle GITHUB_OUTPUT write error gracefully', async () => {
    process.env.GITHUB_OUTPUT = 'invalid_path';
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from('tag1'));
    vi.mocked(fs.default.appendFileSync).mockImplementation(() => {
      throw new Error('Write failed');
    });

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    await import('../scripts/release.js?t=' + (Date.now() + 6));

    expect(exitSpy).toHaveBeenCalledWith(1);
    delete process.env.GITHUB_OUTPUT;
    exitSpy.mockRestore();
  });

  it('should handle missing CHANGELOG.md gracefully', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockImplementation((path) => {
      if (path === 'CHANGELOG.md') throw new Error('Not found');
      return 'existing';
    });
    vi.mocked(child_process.execSync).mockReturnValue(Buffer.from(''));

    await import('../scripts/release.js?t=' + (Date.now() + 7));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringContaining('## [2023.01.01.1200]')
    );
  });

  it('should handle git log error gracefully', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log')) throw new Error('Git log failed');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 8));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringContaining('- No documented changes.')
    );
  });

  it('should handle git describe error gracefully', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue('existing changelog');
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags'))
        throw new Error('Git describe failed');
      if (typeof cmd === 'string' && cmd.includes('log --oneline'))
        return Buffer.from('feat: initial commit');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 9));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringContaining('- feat: initial commit')
    );
  });

  it('should keep the changelog header at the top and insert entries below it', async () => {
    vi.mocked(fs.default.existsSync).mockReturnValue(true);
    vi.mocked(fs.default.readFileSync).mockReturnValue(
      '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n## [2022.12.31.2359] - 2022-12-31\n\n- Previous entry\n'
    );
    vi.mocked(child_process.execSync).mockImplementation((cmd) => {
      if (typeof cmd === 'string' && cmd.includes('describe --tags')) return Buffer.from('v1.0.0');
      if (typeof cmd === 'string' && cmd.includes('log'))
        return Buffer.from('feat: new release metadata');
      return Buffer.from('');
    });

    await import('../scripts/release.js?t=' + (Date.now() + 11));

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      'CHANGELOG.md',
      expect.stringMatching(
        /^# Changelog\n\nAll notable changes to this project will be documented in this file\.\n\n## \[2023\.01\.01\.1200\] - 2023-01-01/
      )
    );
  });
});
