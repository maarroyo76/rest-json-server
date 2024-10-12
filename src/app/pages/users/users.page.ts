import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: any = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers().subscribe(users => {
      console.log(users);
      this.users = users;
    })
  }

}
