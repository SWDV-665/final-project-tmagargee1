import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { DatePipe } from "@angular/common";
import { Category } from '../models/category';
import { AssignmentBase, AssignmentDto } from '../models/assignment';
import { TimeOption } from '../enums/timeOption';
import { AssignmentServiceProvider } from '../providers/assignment-service';
import { CategoriesServiceProvider } from '../providers/category-service';
import { combineLatest } from 'rxjs';
import { ListItem } from '../models/listItem';
import { convertDateToString, convertStringToDate } from '../utilities/date-functions';
import { AudioServiceProvider } from '../providers/audio-service';

interface AssignmentModel extends AssignmentBase {
  category: Category;
  leaveDateBlank: boolean;
  timeChoice: TimeOption;
  dateString: string;
  timeString: string;
}

interface AssignmentListItem extends ListItem {
  showDescription: boolean
  dto: AssignmentDto
  className: string
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonModal) modal: IonModal;

  public formModel: AssignmentModel;
  public categories: Array<Category> = [];
  public modalTitle: string;
  public assignments: Array<AssignmentDto> = [];
  public listItems: Array<AssignmentListItem> = [];
  public errorMessage: string;
  private datepipe: DatePipe = new DatePipe('en-US');

  public isEditting: boolean = false;
  public sortByClass: boolean = false;
  public hasCompletedItems: boolean = false;

  constructor(private assignmentService: AssignmentServiceProvider, private categoryService: CategoriesServiceProvider, private audioService: AudioServiceProvider) {
    assignmentService.dataChanged$.subscribe((change) => {
      if (change) {
        this.reloadAssignments();
      }
    })
  }
  public ionViewWillEnter() {
    combineLatest(this.assignmentService.getAssignments(), this.categoryService.getCategories()).subscribe(([assignments, categories]) => {
      this.categories = categories
      this.categories.forEach(x => x.defaultTime = new Date(x.defaultTime))
      this.assignAssignments(assignments);
    })
  }

  public reloadAssignments() {
    this.assignmentService.getAssignments().subscribe((assignments) => {
      this.assignAssignments(assignments);
    })
  }

  private assignAssignments(assignments: Array<AssignmentDto>) {
    this.assignments = assignments
    this.assignments.forEach(x => {
      x.dueDate = new Date(x.dueDate)

      if (x.dueDate.getTime() === 0) {
        x.dueDate = null;
      }
    })
    this.createLabels()
    this.sortLabels()
    this.hasCompletedItems = this.assignments.filter(x => x.isCompleted).length > 0;
  }

  private createLabels() {
    this.listItems = this.assignments.map(x => {
      const category = this.findCategory(x.categoryId);
      return { label: this.createAssignmentLabel(x, category), color: x.isCompleted ? this.darkenColor(category.color) : category.color, dto: x, className: category.name } as AssignmentListItem
    })
  }

  private sortLabels() {
    if(this.sortByClass){
      this.listItems.sort(function (a, b) {
        var sortNum = a.className.localeCompare(b.className);
        if(sortNum == 0){
          if (a.dto.isCompleted && !b.dto.isCompleted) {
            return 1
          }
          else if (!a.dto.isCompleted && b.dto.isCompleted) {
            return -1
          }
          else if (a.dto.dueDate && b.dto.dueDate) {
            return a.dto.dueDate.getTime() - b.dto.dueDate.getTime();
          }
        }else{
          return sortNum;
        }

        return 0;
      });
    }else{
      this.listItems.sort(function (a, b) {
        if (a.dto.isCompleted && !b.dto.isCompleted) {
          return 1
        }
        else if (!a.dto.isCompleted && b.dto.isCompleted) {
          return -1
        }
        else if (a.dto.dueDate && b.dto.dueDate) {
          return a.dto.dueDate.getTime() - b.dto.dueDate.getTime();
        }
        return 0;
      });
    }
  }

  public switchSort(){
    console.log('here');
    console.log(this.sortByClass);
    this.sortByClass = !this.sortByClass
    this.sortLabels();
  }

  public clearCompleted(){
    this.assignmentService.deleteCompleted();
  }
  private darkenColor(col: string) {
    const amt = 30;
    col = col.slice(1);
    var bigint = parseInt(col, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    r -= amt;
    b -= amt;
    g -= amt;

    return(`#${this.convertToHex(r)}${this.convertToHex(g)}${this.convertToHex(b)}`)
  }


  private convertToHex(num : number){
    if(num < 0){
      return '00';
    }
    var hex = num.toString(16);
    if(num < 16){
      return '0' + hex;
    }
    return hex;
  }

  private createAssignmentLabel(assign: AssignmentDto, category: Category) {
    let label = '';
    if (assign.dueDate) {
      if (assign.dueDate.getHours() == 0 && assign.dueDate.getMinutes() == 0) {
        label += this.datepipe.transform(assign.dueDate, 'MM/dd')
      } else {
        label += this.datepipe.transform(assign.dueDate, 'MM/dd h:mm a')
      }
      if (assign.isDueDateUncertain) {
        label += '?'
      }
    }
    label += ` ${assign.name} (${category.name})`
    return label;
  }

  public newItem() {
    this.formModel = {
      _id: undefined,
      categoryId: undefined,
      name: '',
      category: null,
      description: '',
      isDueDateUncertain: false,
      dateString: convertDateToString(new Date()),
      timeString: convertDateToString(new Date()),
      isCompleted: false,
      leaveDateBlank: false,
      timeChoice: TimeOption.default
    }
    this.isEditting = false;
    this.modalTitle = "Add Assignment"
    this.modal.present();
  }

  public editItem(item: AssignmentDto) {
    this.formModel = {
      _id: item._id,
      categoryId: item.categoryId,
      name: item.name,
      category: this.findCategory(item.categoryId),
      description: item.description,
      isDueDateUncertain: item.isDueDateUncertain,
      dateString: convertDateToString(item.dueDate),
      timeString: convertDateToString(item.dueDate),
      isCompleted: item.isCompleted,
      leaveDateBlank: item.dueDate == null,
      timeChoice: TimeOption.custom
    }
    this.isEditting = true;
    this.modalTitle = "Edit Assignment"
    this.modal.present();
  }

  public deleteAssignment() {
    this.assignmentService.removeItem(this.formModel._id);
    this.modal.dismiss(null, 'delete');
  }

  public flipCompletion(item: AssignmentDto) {
    item.isCompleted = !item.isCompleted;
    if (item.isCompleted) {
      this.audioService.playCompleteItemSound();
    }
    this.assignmentService.editItem(item);
  }

  public getDefaultTime() {
    return this.datepipe.transform(this.formModel.category.defaultTime, 'hh:mm a');
  }

  public cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  public setFormCategory() {
    this.formModel.category = this.findCategory(this.formModel.categoryId);
  }

  private findCategory(id: string): Category {
    return this.categories.find(y => y._id == id)
  }

  public confirm() {
    var dto = {
      _id: this.formModel._id,
      name: this.formModel.name,
      description: this.formModel.description,
      isDueDateUncertain: this.formModel.isDueDateUncertain,
      isCompleted: this.formModel.isCompleted,
      categoryId: this.formModel.categoryId,
      dueDate: this.getAssignmentDate()
    } as AssignmentDto
    if (dto._id) {
      this.assignmentService.editItem(dto);
    } else {
      this.assignmentService.addItem(dto);
    }
    this.modal.dismiss(null, 'confirm');
  }

  public getAssignmentDate(): Date {
    if (this.formModel.leaveDateBlank) {
      return null;
    }

    var date = convertStringToDate(this.formModel.dateString);

    switch (this.formModel.timeChoice) {
      case TimeOption.default: {
        date.setHours(this.formModel.category.defaultTime.getHours());
        date.setMinutes(this.formModel.category.defaultTime.getMinutes());
        break;
      }
      case TimeOption.endOfDay: {
        date.setHours(23);
        date.setMinutes(59);
        break;
      }
      case TimeOption.unknown: {
        date.setHours(0);
        date.setMinutes(0);
        break;
      }
      case TimeOption.custom: {
        var timeDate = convertStringToDate(this.formModel.timeString);
        date.setHours(timeDate.getHours());
        date.setMinutes(timeDate.getMinutes());
      }
    }
    return date;
  }

  public isValid(): boolean{
    return this.formModel.name !== '' && this.formModel.categoryId != undefined
  }
}
