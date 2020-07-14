import { TestBed, async, inject } from '@angular/core/testing';

import { DeactivateLoginGuard } from './deactivate-login.guard';

describe('DeactivateLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeactivateLoginGuard]
    });
  });

  it('should ...', inject([DeactivateLoginGuard], (guard: DeactivateLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
