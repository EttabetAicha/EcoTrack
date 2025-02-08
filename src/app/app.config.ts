import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // ✅ Import properly

import { CollectionService } from './core/services/collection.service';
import { routes } from './app.routes';
import { collectionReducer } from './state/reducers/collectionReq.reducer';
import { CollectionEffects } from './state/effects/collectionReq.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    CollectionService,
    provideStore({ collection: collectionReducer }),
    provideEffects(CollectionEffects),
    importProvidersFrom(StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })), // ✅ Fix DevTools
    provideRouter(routes),
    provideAnimations()
  ]
};
