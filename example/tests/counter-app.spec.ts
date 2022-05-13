import {AppConnection, pollUntil, sleep} from '../../source/ts';
import {appPath} from './app-path';

describe('Count App tests', () => {
  let appConnection: AppConnection;

  beforeEach(async () => {
    appConnection = new AppConnection({appPath});
    await appConnection.launch();
    await appConnection.waitForComponentToBeVisible('value-label');
  });

  afterEach(async () => {
    await appConnection.quit();
  });

  it('Starts at 0', async () => {
    const value = await appConnection.getComponentText('value-label');
    expect(value).toEqual('0');
  });

  it('Increments using the increment button', async () => {
    await appConnection.clickComponent('increment-button');

    const value = await appConnection.getComponentText('value-label');
    expect(value).toEqual('1');
  });

  it('Decrements using the decrement button', async () => {
    await appConnection.clickComponent('decrement-button');

    const value = await appConnection.getComponentText('value-label');
    expect(value).toEqual('-1');
  });

  it('Can be disabled', async () => {
    expect(
      await appConnection.getComponentEnablement('increment-button')
    ).toBeTruthy();
    expect(
      await appConnection.getComponentEnablement('decrement-button')
    ).toBeTruthy();

    await appConnection.clickComponent('enable-button');

    expect(
      await appConnection.getComponentEnablement('increment-button')
    ).toBeFalsy();
    expect(
      await appConnection.getComponentEnablement('decrement-button')
    ).toBeFalsy();
  });

  it('Can set slider value', async () => {
    const expectedValue = 6;
    await appConnection.setSliderValue('slider', expectedValue);
    const value = await appConnection.getSliderValue('slider');
    expect(value).toBe(expectedValue);
  });

  it('Can download content', async () => {
    const downloadButtonId = 'download-button';
    const downloadResultId = 'download-result';

    await appConnection.clickComponent(downloadButtonId);

    await pollUntil(
      (text) => text === 'Content downloaded',
      async () => await appConnection.getComponentText(downloadResultId),
      5000
    );
  });
});
