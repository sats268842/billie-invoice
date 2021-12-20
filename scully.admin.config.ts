import { ScullyConfig } from '@scullyio/scully';
export const config: ScullyConfig = {
  projectRoot: './projects/invoice-generator',
  projectName: 'invoice-generator',
  outDir: './dist/invoice-generator/static',
  routes: {},
  puppeteerLaunchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
};
