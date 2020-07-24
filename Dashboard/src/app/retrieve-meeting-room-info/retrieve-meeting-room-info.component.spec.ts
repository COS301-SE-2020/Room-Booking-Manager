import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveMeetingRoomInfoComponent } from './retrieve-meeting-room-info.component';

describe('RetrieveMeetingRoomInfoComponent', () => {
  let component: RetrieveMeetingRoomInfoComponent;
  let fixture: ComponentFixture<RetrieveMeetingRoomInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrieveMeetingRoomInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveMeetingRoomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
