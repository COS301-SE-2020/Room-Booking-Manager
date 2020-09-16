import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingRoomInfoComponent } from './add-meeting-room-info.component';

describe('AddMeetingRoomInfoComponent', () => {
  let component: AddMeetingRoomInfoComponent;
  let fixture: ComponentFixture<AddMeetingRoomInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeetingRoomInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingRoomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
