import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-settings-boards',
  templateUrl: 'settings-boards.html',
})
export class SettingsBoardsPage {

  public boardSets:any[];
  public boardSet:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public prefProvider: PreferencesProvider,
    public events: Events,
    public toastCtrl: ToastController,
    public platform: Platform
  ) {

  }

  async ionViewDidLoad() {
    await this.loadPrefernces();
  }


  async ionViewWillUnload(){
    await this.savePrefernces();
  }

  public async loadPrefernces(){

    try{
      this.boardSets = this.prefProvider.getBoardsetsNames();
      this.boardSet = await this.prefProvider.getCurrentBoardSet();
    } catch {
      console.log("Loading the preferences has failed");
    }

  }

  public async savePrefernces(){
  // check for single preferences if they changed
  // and publish events which the home page has subscribed to
    try{

      let isChanged:boolean = false;
      if (this.boardSet !== await this.prefProvider.getCurrentBoardSet()) {
        await this.prefProvider.setCurrentBoardSet(this.boardSet);
        this.events.publish('boardSet:changed', this.boardSet, Date.now());
        isChanged = true;
      }

      if (isChanged){
        this.presentToast();
      }

    } catch {
      console.log("Saving the preferences has failed");
    }
  }

  public selectBoard(board:any){
    this.boardSet = board;
  }

  public async getScreenshotURL(boardName?:string){

    if (boardName != null) return '';
    if (await this.platform.ready()) {

      if (this.platform.is("cordova")){
        if ( this.platform.is("ios") || this.platform.is("android") ) {
          return '../www/assets/screenshots/'+ boardName +'.png';
        } else {
          return '../assets/cache/' + boardName + '.png';
        }
      } else {
        return '../assets/cache/' + boardName +'.png';
      }

    }

  }


  private presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Settings were saved successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
