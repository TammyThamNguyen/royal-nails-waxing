import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Task } from '../../models/task';
import { ToastController } from '@ionic/angular';
// import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  title:string = 'Royals Nail and Waxing';
  tasks:Array<Task> = [];
  taskInput:string = '';
  listTitle = 'My First App';
  // taskForm:FormGroup;
  now:number;
  constructor(
    public dataService:DataService,
    private toaster:ToastController
  )
  {
    this.readTasks();
    this.now = new Date().getTime();
    this.sortItems();
  }
  //create a new task object
  createTask(taskName:string){
    let taskDate:number = new Date().getTime();
    let task = {name: taskName, date: taskDate, status: false };
    return task;
  }
  //add a new task to list
  addTask(){
    console.log("..adding..");
    if( this.taskInput.length > 0 ){
      this.tasks.push( this.createTask( this.taskInput ) );
      this.taskInput = '';
      this.sortItems();
      this.dataService.storeList(this.tasks)
      .then( ( response ) => {
        this.showToast('item saved successfully');
      })
      .catch( (error) => {
        console.log( error );
      });
    }
  }

  //load tasks from storage
  readTasks(){
    this.dataService.loadList()
    .then( (response) => {
      if( response !== null ){
        this.tasks = <Array<Task>> response;
      }
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  //change a task's status
  changeStatus(date){
    this.tasks.forEach( (task) => {
      if( task.date == date ){
        task.status = task.status ? false : true;
      }
    });
    this.dataService.storeList(this.tasks);
    this.sortItems();
  }
  //delete a task
  deleteItem( date ){
    this.tasks.forEach( (task,index) => {
      if( task.date == date ){
        this.tasks.splice( index, 1 );
      }
    });
    this.sortItems();
    this.dataService.storeList( this.tasks )
    .then(  (response) => {
      //delete successful
    })
    .catch( (error) => {
      //there is an error
    });
  }
  //take a timestamp and return human readable interval
  formatDate( date:number ){
    let diff = this.now - date;
    let seconds = diff / 1000;
    //if less than 60 seconds, return 'just now'
    if( seconds < 60 ){
      return 'just now';
    }
    //if between 60 secs and 1 hour (3600 secs)
    else if( seconds >= 60 && seconds < 3600 ){
      let mins = Math.floor( seconds / 60 );
      let mUnit = mins == 1 ? 'minute' : 'minutes';
      return mins + ' ' + mUnit + ' ago';
    }
    //if between an hour and 1 day
    else if( seconds >= 3600 && seconds <= 24*3600 ){
      let hours = Math.floor( seconds / 3600 );
      let hUnit = hours == 1 ? 'hour' : 'hours';
      let mins = Math.floor( (seconds - ( hours * 3600 )) / 60 );
      let mUnit = mins == 1 ? 'minute' : 'minutes';
      return hours + ' ' + hUnit + ' ' + mins + ' ' + mUnit + ' ago';
    }
    //if between 1 day and 1 week
    else if( seconds >= 24 * 3600 ){
      let days = Math.floor( seconds / (3600 * 24) );
      let dUnit = days == 1 ? 'day' : 'days';
      let hours = Math.floor( (seconds - ( days * 24 * 3600 )) / 3600);
      let hUnit = hours == 1 ? 'hour' : 'hours';
      return days + ' ' + dUnit + ' ' + hours + ' ' + hUnit + ' ' + 'ago';
    }
  }

  //sort tasks first by date, then by status
  sortItems(){
    //add delay
    setTimeout( () => {
      //sort by date
      this.tasks.sort( ( task1, task2 ) => {
        if( task1.date < task2.date ){ return 1}
        if( task1.date > task2.date ){ return -1}
        if( task1.date == task2.date ){ return 0}
      });
      //sort by status
      this.tasks.sort( (task1, task2 ) => {
        let status1:number = task1.status ? 1 : 0;
        let status2:number = task2.status ? 1 : 0;
        return status1 - status2;
      });
    }, 1000);

  }

  async showToast(message:string){
    const toast = await this.toaster.create({
      message: message,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }
}
