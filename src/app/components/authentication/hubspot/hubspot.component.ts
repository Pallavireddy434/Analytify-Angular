import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-hubspot',
  standalone: true,
  imports: [],
  templateUrl: './hubspot.component.html',
  styleUrl: './hubspot.component.scss'
})
export class HubspotComponent implements OnInit {
  constructor(private router: Router,private authService :AuthService){}

  ngOnInit(): void {
    const hierarchyId = localStorage.getItem('hubspotHierarchyId');
    if (hierarchyId) {
      let payload = {
        "hierarchy_id":hierarchyId,
        "redirect_uri": window.location.href
      };
      this.authService.hubspotCallBack(payload)
        .subscribe(
          {
            next: (data: any) => {
              localStorage.removeItem('hubspotHierarchyId');
              const encoded = btoa(hierarchyId.toString());
              this.router.navigate(['/analytify/database-connection/hubspot/' + encoded]);
            },
            error: (error: any) => {
              console.log(error);
              if (error) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Oops!',
                  text: error.error.message,
                  width: '400px',
                })
              }
            }
          }
        )
    } else {
      this.router.navigate(['/analytify/datasources/view-connections']);
    }
  }
}
