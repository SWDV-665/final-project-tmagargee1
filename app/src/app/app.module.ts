import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssignmentServiceProvider } from './providers/assignment-service';
import { AudioServiceProvider } from './providers/audio-service';
import { CategoriesServiceProvider } from './providers/category-service';
import { SettingsServiceProvider } from './providers/settings-service';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AssignmentServiceProvider, CategoriesServiceProvider, SettingsServiceProvider, AudioServiceProvider, NativeAudio],
  bootstrap: [AppComponent],
})
export class AppModule { }
