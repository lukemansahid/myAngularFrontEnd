import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {Task} from "./model/Task";
import {TaskServiceService} from "./service/task-service.service";
import {Form} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'Lukeman S. Kamara';

  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: '',
      cancelButton: 'btn btn-outline-secondary ml-4'
    },
    confirmButtonColor: '#f2b085',
    buttonsStyling: true
  });

  newTask : Task = new Task();
  allTasks : Task[] = new Array<Task>();
  editingTask: Boolean = false;
  showSpinnerSaveTask: boolean = false;
  deletingTaskFileId: number = 0;
  showTopSpinner: boolean = false;
  showSpinnerDeleteTask: boolean = false;

  constructor(private taskServiceService: TaskServiceService) {}

  ngOnInit() {
    this.getAllTasks();
  }

  //== Method to save new task
  saveTask(taskForm: Form) {
    this.swalWithBootstrapButtons.fire({
      title: '¿Seguro que desea guardar?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        if (!this.editingTask) {
          this.showSpinnerSaveTask = true;
          this.taskServiceService.saveTask(this.newTask)
            .subscribe(() => {
              this.swalWithBootstrapButtons.fire(
                'Guardado!',
                '',
                'success');
              this.showSpinnerSaveTask = false;
              this.cleanFormFields();
              this.getAllTasks();
            }, error => {
              console.log(error);
              this.swalWithBootstrapButtons.fire(
                'Error!',
                'Ha ocurrido un error a la hora de guardar los datos',
                'error');

              this.showSpinnerSaveTask = false;

            });
        }else {
          //TODO logic to update a task
        }
      }
    });

  }

  // start method to Delete a Task with confirmation
  deleteTask(taskId: number) {
    this.swalWithBootstrapButtons.fire({
      title: '¿Se borrará la dimensión?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        this.deletingTaskFileId = taskId;
        this.showSpinnerDeleteTask = true;
        this.taskServiceService.deleteTaskById(taskId)
          .subscribe(() => {
            this.swalWithBootstrapButtons.fire(
              'Guardado!',
              '',
              'success');
            this.deletingTaskFileId = 0;
            this.showSpinnerDeleteTask = false;
            this.getAllTasks();
          }, error1 => {
            console.log(error1);
            this.swalWithBootstrapButtons.fire(
              'Error!',
              'No se pudo borrar el registro.',
              'error'
            );
            this.deletingTaskFileId = 0;
            this.showSpinnerDeleteTask = false;
          });
      }
    });
  }


  // This method get the dim type from the api
  getAllTasks() {
    this.allTasks = [];
    this.showTopSpinner = true;
    this.taskServiceService.getAllTasks().subscribe(data => {

      this.allTasks = data;

      this.showTopSpinner = false;
    }, error1 => {
      console.log(error1);
      this.swalWithBootstrapButtons.fire(
        'Error!',
        'Sorry An error occure',
        'error'
      );
      this.showTopSpinner = false;
    });
  }

  //==Method to clean the form field after saving
  cleanFormFields() {
    this.newTask.description = '';
  }


}
