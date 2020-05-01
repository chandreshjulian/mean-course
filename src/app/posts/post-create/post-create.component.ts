// import { Component, EventEmitter, Output } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';

// import { Post } from '../post.model'
import {
  FormGroup,
  FormControl,
  Validators,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

// Decorator is the typescript feature
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private mode = 'create';
  private postId: string;
  private authStatusSubs: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((responseData) => {
          this.isLoading = false;
          const post = responseData.post;
          this.post = {
            id: post.id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creator: post.creator,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) return;

    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.form.reset();
    } else if (this.mode == 'edit')
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
  }

  onImagePicked(event: Event) {
    // INFO: this is type convertion. this `event.target` is of type `HTMLInputElement` and it has `files` property
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.form.patchValue({
        image: file,
      });
      this.form.get('image').updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}

// this is working with event emitters
// @Output() postCreated = new EventEmitter<Post>()

/**
 * postInput: this is HTMLTextAreaElement type argument
 */
// OLD_onAddPost(postInput: HTMLTextAreaElement) {
//   this.newPost = postInput.value
// }

// in onSavePost
// const post: Post = {
//   title: form.value.title,
//   content: form.value.content
// }
// this.postCreated.emit(post)
