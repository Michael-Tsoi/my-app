// src/shared/Task.ts

import { Entity, Fields, Allow } from "remult"

@Entity("tasks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: 'admin',
  allowApiDelete: 'admin'
})
export class Task {
  @Fields.uuid()
  id!: string

  @Fields.string({

    validate: (task) => {
      if ( task.title.length < 3) throw 'too short'
    },
    //allowApiUpdate: "admin"
  })
  title = ""

  @Fields.boolean()
  completed = false

  @Fields.createdAt()
  createdAt?: Date
}