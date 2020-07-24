import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeetingRoomInfoComponent } from './edit-meeting-room-info.component';

describe('EditMeetingRoomInfoComponent', () => {
  let component: EditMeetingRoomInfoComponent;
  let fixture: ComponentFixture<EditMeetingRoomInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMeetingRoomInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeetingRoomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
