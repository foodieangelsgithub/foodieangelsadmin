import { TestBed, async, inject } from '@angular/core/testing';

import { ActivateLoginGuard } from './activate-login.guard';

describe('ActivateLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivateLoginGuard]
    });
  });

  it('should ...', inject([ActivateLoginGuard], (guard: ActivateLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
