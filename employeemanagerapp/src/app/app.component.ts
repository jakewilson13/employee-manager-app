import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //employees will have all of the employees inside of it when we call getEmployees function
  //so we can use the 'employees' variable inside of the html document because it is the template for this component(line 8)
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  //injecting our service file into this file
  constructor(private employeeService: EmployeeService){}

  //whenever the component is initialized, ngOnInit will call the getEmployees function
  ngOnInit(){
    this.getEmployees();
  }

  public getEmployees(): void {
    //calling our method in employeeService & subscribing to the Observable(specified inside of getEmployee function)
    //subscribe notifies us after some data comes back from the server
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  //indexOf function is used to find the first index of a element if the element exists otherwise it's going to be -1 if ti doesn't exist
  //using a reverse check on the -1 to find out if an element actually exists or not

  //using the empty array to match the string when someone types a specific name inside of the searchbar
  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    //looping over every employees inside of the list, searching for the name
    for(const employee of this.employees) {
        if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          //adding the employee to the list
          results.push(employee);
        }
    }
    this.employees = results;
    //if there is nothing and no key (no search), then return all employees
    if(results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if(mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }
}
