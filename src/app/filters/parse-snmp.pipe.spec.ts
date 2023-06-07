import { ParseSnmpPipe } from './parse-snmp.pipe';

describe('ParseSnmpPipe', () => {
  it('create an instance', () => {
    const pipe = new ParseSnmpPipe();
    expect(pipe).toBeTruthy();
  });
});
