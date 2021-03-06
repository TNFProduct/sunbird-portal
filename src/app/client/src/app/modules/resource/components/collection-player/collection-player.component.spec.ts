
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPlayerComponent } from './collection-player.component';
import { ContentService, PlayerService, CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WindowScrollService, ConfigService, SharedModule, ResourceService } from '../../../shared';
import { CollectionTreeComponent, AppLoaderComponent, PlayerComponent, FancyTreeComponent } from '../../../shared/components';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionHierarchyGetMockResponse } from './collection-player.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CollectionPlayerComponent', () => {
  let component: CollectionPlayerComponent;
  let fixture: ComponentFixture<CollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';

  const fakeActivatedRoute = {
    params: observableOf({ id: collectionId }),
    queryParams: observableOf({ contentId: contentId }),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };

  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0118': 'No content to play'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerComponent],
      imports: [SuiModule, HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot(), RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ ResourceService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showPlayer).toBeFalsy();
    // expect(component.serviceUnavailable).toBeFalsy();
    expect(component.loader).toBeTruthy();
    expect(component.loaderMessage).toEqual({
      headerMessage: 'Please wait...',
      loaderMessage: 'Fetching content details!'
    });
    expect(component.collectionTreeOptions).toEqual({
      fileIcon: 'sb-icon-content',
      customFileIcon: {
        'video': 'sb-icon-video',
        'pdf': 'sb-icon-doc',
        'youtube': 'sb-icon-video',
        'H5P': 'sb-icon-content',
        'audio': 'sb-icon-mp3',
        'ECML': 'sb-icon-content',
        'HTML': 'sb-icon-content',
        'collection': 'sb-icon-collection',
        'epub': 'sb-icon-doc',
        'doc': 'sb-icon-doc'
      }
    });
  });

  it('should call playContent method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const content = {
      id: 'do_112474267785674752118',
      title: 'Test'
    };
    component.playContent(content);
    expect(component.showPlayer).toBeTruthy();
    expect(component.contentTitle).toEqual(content.title);
  });

  it('should get content based on route/query params', () => {
    const playerService: PlayerService = TestBed.get(PlayerService);
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(playerService, 'getCollectionHierarchy').and
      .returnValue(observableOf(CollectionHierarchyGetMockResponse));
    component.ngOnInit();
    expect(component.collectionTreeNodes).toEqual({ data: CollectionHierarchyGetMockResponse.result.content });
    expect(component.loader).toBeFalsy();
  });


  xit('should navigate to error page on invalid collection id', () => {});
  xit('should navigate to error page on valid collection id but invalid content id', () => {});
  xit('should show service unavailable message on API server error', () => {});
});
