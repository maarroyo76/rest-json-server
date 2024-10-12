import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: any = [];

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
