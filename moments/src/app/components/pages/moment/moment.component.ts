import { Component,OnInit } from '@angular/core';
import { Comment } from 'src/app/Comment';
import { Moment } from 'src/app/Moments';
import { CommentService } from 'src/app/services/comment.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { environment } from 'src/environments/environment.development';

import { MomentService } from 'src/app/services/moment.service';
import { Router,ActivatedRoute } from '@angular/router';
import { faTimes,faEdit } from '@fortawesome/free-solid-svg-icons';
import { MessagesService } from 'src/app/services/messages.service';


@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit {
moment?: Moment;
baseApiUrl = environment.baseApiUrl;

faTimes = faTimes;
faEdit = faEdit;

commentForm!: FormGroup;
CommentService: any;

constructor(private momentService: MomentService,
  private route: ActivatedRoute,
  private messagesService: MessagesService,
  private router: Router,
  private comment: CommentService){}

ngOnInit():void{
  const id = Number(this.route.snapshot.paramMap.get('id'));

  this.momentService.getMoment(id).subscribe((item) => (this.moment = item.data))

  this.commentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
  });

}

get text() {
  return this.commentForm.get('text')!;
}

get username() {
  return this.commentForm.get('username')!;
}


async removeHandler(id: Number){
  await this.momentService.removeMoment(id).subscribe();

    this.messagesService.add("Momento Excluido com Sucesso")
    this.router.navigate(["/"])

  }

  async onSubmit(formDirective: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return;
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.CommentService
      .createComment(data)
      .subscribe((comment: { data: { text: string; username: string; }; }) => this.moment!.comments!.push(comment.data));

    this.messagesService.add(`Comentário adicionado!`);

    this.commentForm.reset();

    formDirective.resetForm();

  }




}
