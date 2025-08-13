import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Đặt rootDir ở thư mục gốc của dự án
  rootDir: '.',

  // Cấu hình moduleNameMapper để Jest hiểu path alias từ tsconfig
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    // prefix sẽ trỏ đến thư mục gốc
    prefix: '<rootDir>/',
  }),

  // Các cấu hình khác
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};

export default jestConfig;
