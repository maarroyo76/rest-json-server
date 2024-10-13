import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { last } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  editingUserId: number | null = null;
  editedUser: User = {
    id: 0,
    username: '',
    name: '',
    lastname: '',
    email: '',
    age: 0
  };

  searchUserId: number | null = null;

  constructor(
    private userService: UserService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  searchUser(userId: number | null){
    if(!userId){
      this.loadUsers();
    } else {
      this.userService.getUser(userId).subscribe(user => {
          console.log(user);
          this.users = [user];
        },
        async error => {
          if (error.status === 404) {
            const alert = await this.alertController.create({
              header: 'Usuario no encontrado',
              message: 'No se encontró un usuario con el ID proporcionado.',
              buttons: ['OK']
            });
            await alert.present();
            this.clearSearch();
          } else {
            console.error('Error fetching user', error);
          }
          this.users = [];
        }
      );
    }
  }

  clearSearch(){
    this.searchUserId = null;
    this.loadUsers();
  }

  editUser(user: User) {
    this.editingUserId = user.id;
    this.editedUser = { ...user };
  }

  saveUser() {
    if (this.editedUser) {
      if (!this.editedUser.name.trim() || !this.editedUser.lastname.trim() || !this.editedUser.email.trim() ||!this.editedUser.age.toString().trim()) {
        this.alertController.create({
          header: 'Error',
          message: 'Todos los campos son obligatorios.',
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }
      this.userService.putUser(this.editedUser).subscribe((updatedUser: any) => {
        updatedUser = updatedUser as User;
        const index = this.users.findIndex((u: User) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.cancelEdit();
      }, async error => {
        console.error('Error updating user', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema al actualizar el usuario.',
          buttons: ['OK']
        });
        await alert.present();
      });
    }
  }

  cancelEdit() {
  this.editingUserId = null;
  this.editedUser = {
      id: 0,
      username: '',
      name: '',
      lastname: '',
      email: '',
      age: 0
    };
  }


  private deleteUser(userId: number){
    this.userService.deleteUser(userId).subscribe(() => {
      console.log('User deleted');
      this.loadUsers();
    });
  }

  confirmDelete(userId: number){
    this.alertController.create({
      header: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteUser(userId);
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alert => alert.present());
  }

}
