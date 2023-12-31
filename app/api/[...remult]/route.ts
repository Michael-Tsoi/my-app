// src/app/api/[...remult]/route.ts

import { remultNextApp } from "remult/remult-next";
import { Task } from "../../shared/Task"
import { TasksController } from "../../shared/TasksController"

import { getUserOnServer } from "../auth/[...nextauth]/route"
import { createPostgresDataProvider } from "remult/postgres"

const api = remultNextApp({ 
    entities: [Task],
    controllers: [TasksController],
    getUser: getUserOnServer,
    dataProvider: createPostgresDataProvider({
      connectionString: process.env["POSTGRES_URL"] || process.env["DATABASE_URL"],
      configuration: {
        ssl: Boolean(process.env["POSTGRES_URL"]),
      },
    })
  })

export const { POST, PUT, DELETE, GET } = api;


