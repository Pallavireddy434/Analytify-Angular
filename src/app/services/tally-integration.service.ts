import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TallyIntegrationService {
  private baseUrl = 'http://13.57.231.251:50/v1/tally_authentication';
  private token = 'OqDuhqGDLhMjgGqMQkCUxFl3027oQ9';

  constructor(private http: HttpClient) { }

  create(config: any) {
    return this.http.post<any>(`${this.baseUrl}/${this.token}`, config);
  }

  update(config: any) {
    return this.http.put<any>(`${this.baseUrl}/${this.token}`, config);
  }

  get() {
    return this.http.get<any>(`${this.baseUrl}/${this.token}`);
  }

  delete(id?: any) {
    const url = id ? `${this.baseUrl}/${this.token}/${id}` : `${this.baseUrl}/${this.token}`;
    return this.http.delete<any>(url);
  }
}
