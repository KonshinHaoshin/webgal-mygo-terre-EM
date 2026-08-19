import { commandType } from '../completion/commandArgs';
import { getArgsKey } from './getArgsKey';
import { getCommands } from './getCommands';

describe('Dragonspring language extensions', () => {
  it('offers custom commands without removing official commands', () => {
    const labels = getCommands().map((item) => item.label);

    expect(labels).toContain('return');
    expect(labels).toContain('callSteam');
    expect(labels).toContain('manopedia');
    expect(labels).toContain('presentTheEvidence');
    expect(labels).toContain('clearTestimony');
  });

  it('resolves custom argument hints from command text', () => {
    const judgmentKeys = getArgsKey('judgment:begins -', commandType.say).map((item) => item.label);
    const testimonyKeys = getArgsKey('testimony:text -', commandType.say).map((item) => item.label);

    expect(judgmentKeys).toEqual(expect.arrayContaining(['timer', 'timeout']));
    expect(testimonyKeys).toEqual(expect.arrayContaining(['left', 'right', 'refutes', 'colors', 'y']));
  });

  it('offers Mano and LUT parameters on official visual commands', () => {
    const figureKeys = getArgsKey('changeFigure:test.json -', commandType.changeFigure).map((item) => item.label);
    const backgroundKeys = getArgsKey('changeBg:test.png -', commandType.changeBg).map((item) => item.label);

    expect(figureKeys).toEqual(expect.arrayContaining(['pose', 'lut', 'blink', 'focus', 'blendMode']));
    expect(backgroundKeys).toContain('lut');
  });
});
