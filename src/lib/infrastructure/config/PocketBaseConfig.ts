import PocketBase from 'pocketbase';

/**
 * PocketBase configuration and client setup
 */
export class PocketBaseConfig {
  private static instance: PocketBase;

  static getInstance(): PocketBase {
    if (!this.instance) {
      const url = import.meta.env.VITE_POCKETBASE_URL || 'https://devpiece.com/';
      this.instance = new PocketBase(url);
    }
    return this.instance;
  }

  static getUrl(): string {
    return this.getInstance().baseUrl;
  }

  static isAuthenticated(): boolean {
    return this.getInstance().authStore.isValid;
  }

  static getCurrentUser() {
    return this.getInstance().authStore.model;
  }

  static getToken(): string {
    return this.getInstance().authStore.token;
  }
}