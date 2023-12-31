import { api } from "services/apis";
import { API } from "./../apis/constants";

export class ReportService {
  static async getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await api.get(API.SPACE);
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      } catch (error) {
        reject(error.message);
      }
    });
  }
  static async getWithParams(params, token) {
    return new Promise(async (resolve, reject) => {
      try {
		const headers = { Authorization: `Bearer ${token}` };  // Fix: Use an object for headers
        const response = await api.get(API.REPORT, {
          params: params,
          headers:  headers ,
        });
        if (response.status === 200) {
          resolve(response.data.data.content);
        } else {
          reject(response.data);
        }
      } catch (error) {
        reject(error.message);
      }
    });
  }
}
