import { IsUserDeviceAdminPipe } from './is-user-device-admin.pipe';

describe('IsUserDeviceAdminPipe', () => {
  it('create an instance', () => {
    const pipe = new IsUserDeviceAdminPipe();
    expect(pipe).toBeTruthy();
  });
});
