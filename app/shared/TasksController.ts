// src/shared/TasksController.ts

import { BackendMethod, remult, Allow } from "remult"
import { Task } from "./Task"

export class TasksController {
  @BackendMethod({ allowed: Allow.authenticated })
  static async setAllCompleted(completed: boolean) {
    const taskRepo = remult.repo(Task)

    for (const task of await taskRepo.find()) {
      await taskRepo.save({ ...task, completed })
    }
  }
}