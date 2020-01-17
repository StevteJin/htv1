import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpageComponet } from './newpage.component';

describe('NewpageComponet', () => {
  let component: NewpageComponet;
  let fixture: ComponentFixture<NewpageComponet>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpageComponet ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpageComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
