import { HttpClient } from '@angular/common/http';
import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';
import { Router } from '@angular/router';

const BACKEND_URL = `${environment.apiUrl}/posts`;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage, currentPage) {
    // return [...this.posts]

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${BACKEND_URL}${queryParams}`
      )
      .pipe(
        map(({ posts, maxPosts }) => {
          return {
            posts: posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts,
          };
        })
      )
      .subscribe(({ posts, maxPosts }) => {
        this.posts = posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p.id === id)}
    return this.http.get<{ message: string; post: any }>(
      `${BACKEND_URL}/${id}`
    );
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title, content }

    // to upload file
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: any }>(`${BACKEND_URL}`, postData)
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post._id,
        //   title: responseData.post.title,
        //   content: responseData.post.content,
        //   imagePath: responseData.post.imagePath
        // }
        // console.log(responseData.message)
        // this.posts.push(post)
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image, creator: null };
    }

    this.http
      .put<{ message: string; post: any }>(`${BACKEND_URL}/${id}`, postData)
      .subscribe((responseData) => {
        // console.log(responseData.message)
        // const updatedPosted = [...this.posts]
        // const oldPostIndex = this.posts.findIndex(p => p.id === id)
        // const post: Post = {
        //   id, title, content, imagePath: responseData.post.imagePath
        // }
        // updatedPosted[oldPostIndex] = post
        // this.posts = updatedPosted
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`${BACKEND_URL}/${postId}`);
    // .subscribe(() => {
    //   const updatedPosted = this.posts.filter(post => post.id !== postId)
    //   this.posts = updatedPosted
    //   this.postsUpdated.next([...this.posts])
    // })
  }
}
