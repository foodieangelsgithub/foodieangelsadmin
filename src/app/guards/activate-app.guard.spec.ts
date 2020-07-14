import { TestBed, async, inject } from '@angular/core/testing';

import { ActivateAppGuard } from './activate-app.guard';

describe('ActivateAppGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivateAppGuard]
    });
  });

  it('should ...', inject([ActivateAppGuard], (guard: ActivateAppGuard) => {
    expect(guard).toBeTruthy();
  }));
});
