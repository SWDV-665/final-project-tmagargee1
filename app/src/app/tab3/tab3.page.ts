import { Component } from '@angular/core';
import { ColorForm } from '../models/color-form';
import { Settings } from '../models/settings';
import { SettingsServiceProvider } from '../providers/settings-service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public settings: Settings;
  public errorMessage: string;


  constructor(private settingsService: SettingsServiceProvider) {
    settingsService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadSettings();
    })
  }

  public loadSettings() {
    return this.settingsService.getSettings().subscribe(
      item => this.settings = item,
      error => this.errorMessage = <any>error
    );
  }

  public testFunc() {
    // // to check if we have permission
    // this.push.hasPermission()
    //   .then((res: any) => {

    //     if (res.isEnabled) {
    //       console.log('We have permission to send push notifications');
    //     } else {
    //       console.log('We do not have permission to send push notifications');
    //     }

    //   });

    // // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    // this.push.createChannel({
    //   id: "testchannel1",
    //   description: "My first test channel",
    //   // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
    //   importance: 3,
    //   //badge is used to if badge appears on the app icon see https://developer.android.com/reference/android/app/NotificationChannel.html#setShowBadge(boolean).
    //   //false = no badge on app icon.
    //   //true = badge on app icon
    //   badge: false
    // }).then(() => console.log('Channel created'));

    // // Delete a channel (Android O and above)
    // this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

    // // Return a list of currently configured channels
    // this.push.listChannels().then((channels) => console.log('List of channels', channels))

    // // to initialize push notifications

    // const options: PushOptions = {
    //   android: {},
    //   ios: {
    //     alert: 'true',
    //     badge: true,
    //     sound: 'false'
    //   },
    //   windows: {},
    //   browser: {
    //     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    //   }
    // }

    // const pushObject: PushObject = this.push.init(options);


    // pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    // pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    // pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}
