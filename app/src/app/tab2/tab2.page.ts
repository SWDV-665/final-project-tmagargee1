import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { Category } from '../models/category';
import { CategoriesServiceProvider } from '../providers/category-service';
import { convertDateToString, convertStringToDate } from '../utilities/date-functions';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  public formModel: Category;

  public categories: Array<Category> = [];
  public errorMessage: string;
  public modalTitle: string;

  public dateString: string;
  public nameList: string[];
  public nameInList: boolean = false;
  public colorInList: boolean = false;

  constructor(private categoryService: CategoriesServiceProvider, public alertCtrl: AlertController) {
    categoryService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadCategories();
    })
  }

  public loadCategories() {
    return this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categories.forEach(x => x.defaultTime = new Date(x.defaultTime))
    }
    );
  }

  public ngOnInit() {
    this.loadCategories()
  }

  public newItem() {
    this.formModel = {
      _id: undefined,
      name: '',
      color: '#FF0000',
      defaultTime: new Date()
    }

    this.setRandomColor()
    this.formModel.defaultTime.setMinutes(0);
    this.formModel.defaultTime.setHours(12);

    this.dateString = convertDateToString(this.formModel.defaultTime);

    this.modalTitle = "Add Class"
    this.nameList = this.categories.map((x) => x.name)
    this.modal.present();
  }

  public editItem(item: Category) {
    this.formModel = JSON.parse(JSON.stringify(item));
    this.dateString = convertDateToString(item.defaultTime);
    this.modalTitle = "Edit Class"
    this.nameList = this.categories.map((x) => x.name).filter(x => x !== this.formModel.name)
    this.modal.present();
  }

  public async deleteItem(item: Category) {
    const alert = await this.alertCtrl.create({
      header: `Delete ${item.name}?`,
      message: 'This will delete all assignments in the class as well',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            return this.categoryService.deleteCategory(item._id);
          },
        },
      ],
    });

    await alert.present();
  }

  public setRandomColor() {
    var length = 6;
    const chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    this.formModel.color = hex;
    this.checkColor();
    if (this.colorInList) {
      this.setRandomColor();
    }
  }

  public confirm() {
    this.formModel.defaultTime = convertStringToDate(this.dateString)// ;

    if (this.formModel._id) {
      this.categoryService.editCategory(this.formModel);
    } else {
      this.categoryService.addCategory(this.formModel);
    }
    this.modal.dismiss(null, 'confirm');
  }

  public cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  public checkName() {
    this.nameInList = this.nameList.includes(this.formModel.name);
  }

  public checkColor() {
    this.colorInList = this.categories.map((x) => x.color).includes(this.formModel.color);
  }

  public isValid(): boolean {
    return !this.colorInList && !this.nameInList && this.formModel.name !== ''
  }
}
