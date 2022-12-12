import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { Injectable } from "@angular/core";

@Injectable()
export class AudioServiceProvider {

    public completeSoundId = 'CompleteSound'
    constructor(private nativeAudio: NativeAudio) {
        this.nativeAudio.preloadSimple(this.completeSoundId, 'assets/audio/complete-assignment.mp3')
        .then(() => console.log(this.completeSoundId + ' loaded successfully'), () => console.log(this.completeSoundId + ' loading failed'));
    }

    public playCompleteItemSound() {
        this.nativeAudio.play(this.completeSoundId );
    }
}
