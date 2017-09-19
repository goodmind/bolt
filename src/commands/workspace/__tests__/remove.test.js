// @flow
import { workspaceRemove, toWorkspaceRemoveOptions } from '../remove';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as fs from 'fs';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import pathExists from 'path-exists';

jest.mock('../../../utils/logger');
jest.mock('../../../utils/yarn');

describe('pyarn workspace remove', () => {
  test('removing a workspace dependency that exists', async () => {
    let { tempDir } = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );

    let workspaceDir = path.join(tempDir, 'packages', 'foo');

    await workspaceRemove(
      toWorkspaceRemoveOptions(['foo', 'foo-dep'], { cwd: tempDir })
    );

    expect(yarn.remove).toHaveBeenCalledTimes(0);
    expect(
      await pathExists(path.join(workspaceDir, 'node_modules', 'foo-dep'))
    ).toBe(false);
    expect(
      await pathExists(path.join(tempDir, 'node_modules', 'foo-dep'))
    ).toBe(true);
  });

  test('removing a workspace dependency that doesnt exist in that package', async () => {
    let { tempDir } = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );

    await expect(
      workspaceRemove(
        toWorkspaceRemoveOptions(['bar', 'foo-dep'], { cwd: tempDir })
      )
    ).rejects.toBeInstanceOf(Error);
  });
});
