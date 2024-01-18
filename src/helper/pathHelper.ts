import path from 'path';

export const getAbsolutePath = (...paths: string[]): string => {
  const rootDir = process.env.NODE_ENV === 'production' ? process.cwd() : path.join(process.cwd(), 'src');
  const finalPath = path.join(rootDir, ...paths);
  return finalPath;
};
