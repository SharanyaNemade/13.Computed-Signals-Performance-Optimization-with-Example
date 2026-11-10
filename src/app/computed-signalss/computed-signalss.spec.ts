import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedSignalss } from './computed-signalss';

describe('ComputedSignalss', () => {
  let component: ComputedSignalss;
  let fixture: ComponentFixture<ComputedSignalss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedSignalss],
    }).compileComponents();

    fixture = TestBed.createComponent(ComputedSignalss);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
