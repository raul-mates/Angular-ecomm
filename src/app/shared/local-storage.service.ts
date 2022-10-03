import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly base = 'ECOMM';

  private readonly changeSubject: BehaviorSubject<Record<
    string,
    unknown | null
  > | null> = new BehaviorSubject<Record<string, unknown | null> | null>(null);

  constructor() {
    if (!localStorage.getItem(this.base)) {
      localStorage.setItem(this.base, JSON.stringify({}));
    }
  }

  get valueChanges(): BehaviorSubject<Record<string, unknown | null> | null> {
    return this.changeSubject;
  }

  read<T>(): Record<string, unknown | null> | null {
    try {
      const baseObject: Record<string, unknown | null> | null = JSON.parse(
        localStorage.getItem(this.base) as string
      );
      return baseObject;
    } catch (err) {
      return null;
    }
  }

  get<T>(key: string): unknown | null {
    try {
      const baseObject = this.read();
      return baseObject![key];
    } catch (err) {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    const baseObject = this.read();
    try {
      baseObject![key] = value;
      localStorage.setItem(this.base, JSON.stringify(baseObject));
    } catch (err) {
      console.warn(`${key} not found in local storage   !`);
    }

    this.changeSubject.next(baseObject);
  }

  clear(): void {
    localStorage.setItem(this.base, JSON.stringify({}));
  }
}
