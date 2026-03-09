import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Story {
  _id?: string;
  title: string;
  description: string;
  author: any;
  coverImage: string;
  isPublished: boolean;
  startNodeId: string | null;
  create_date?: Date;
}

export interface Choice {
  _id?: string;
  text: string;
  nextNodeId: string | null;
}

export interface StoryNode {
  _id?: string;
  storyId: string;
  title: string;
  content: string;
  imageUrl: string;
  choices: Choice[];
  isEnding: boolean;
  create_date?: Date;
}

@Injectable({ providedIn: 'root' })
export class StoryService {
  private apiUrl = `${environment.apiEndpoint}`;

  constructor(private http: HttpClient) {}

  // Story CRUD
  getAllStories(): Observable<Story[]> {
    return this.http.get<any>(`${this.apiUrl}/stories`).pipe(map(r => r.data));
  }

  getPublishedStories(): Observable<Story[]> {
    return this.http.get<any>(`${this.apiUrl}/stories/published`).pipe(map(r => r.data));
  }

  getMyStories(): Observable<Story[]> {
    return this.http.get<any>(`${this.apiUrl}/stories/mine`).pipe(map(r => r.data));
  }

  getStoryById(id: string): Observable<Story> {
    return this.http.get<any>(`${this.apiUrl}/story/${id}`).pipe(map(r => r.data));
  }

  createStory(story: Partial<Story>): Observable<Story> {
    return this.http.post<any>(`${this.apiUrl}/stories`, story).pipe(map(r => r.data));
  }

  updateStory(id: string, story: Partial<Story>): Observable<Story> {
    return this.http.put<any>(`${this.apiUrl}/story/${id}`, story).pipe(map(r => r.data));
  }

  deleteStory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/story/${id}`);
  }

  // Node CRUD
  getNodesByStory(storyId: string): Observable<StoryNode[]> {
    return this.http.get<any>(`${this.apiUrl}/story/${storyId}/nodes`).pipe(map(r => r.data));
  }

  createNode(storyId: string, node: Partial<StoryNode>): Observable<StoryNode> {
    return this.http.post<any>(`${this.apiUrl}/story/${storyId}/nodes`, node).pipe(map(r => r.data));
  }

  getNodeById(nodeId: string): Observable<StoryNode> {
    return this.http.get<any>(`${this.apiUrl}/node/${nodeId}`).pipe(map(r => r.data));
  }

  updateNode(nodeId: string, node: Partial<StoryNode>): Observable<StoryNode> {
    return this.http.put<any>(`${this.apiUrl}/node/${nodeId}`, node).pipe(map(r => r.data));
  }

  deleteNode(nodeId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/node/${nodeId}`);
  }
}
