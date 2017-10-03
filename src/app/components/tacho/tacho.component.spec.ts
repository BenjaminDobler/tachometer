import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachoComponent } from './tacho.component';

describe('TachoComponent', () => {
  let component: TachoComponent;
  let fixture: ComponentFixture<TachoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
