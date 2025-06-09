import "reflect-metadata";
import express from "express";
import { StudentController } from "./controllers/StudentController";
import { container } from "./config/di";
import { connectToDatabase, initializeModels } from "./config/db";
import { GroupController } from "./controllers/GroupController";
import { DisciplineController } from "./controllers/DisciplineController";
import { GradeController } from "./controllers/GradeController";
import { TeacherController } from "./controllers/TeacherController";
import { UserController } from "./controllers/UserController";

initializeModels();
connectToDatabase();

const app = express();
const PORT = 3000;
const studentController: StudentController =
  container.resolve("StudentController");
const groupController: GroupController = container.resolve("GroupController");
const disciplineController: DisciplineController = container.resolve(
  "DisciplineController"
);
const gradeController: GradeController = container.resolve("GradeController");
const teacherController:TeacherController = container.resolve('TeacherController');
const userController: UserController = container.resolve('UserController');



app.use(express.json());

//#region Disciplines

app.post("/disciplines/", async (req, res, next) => {
  try {
    await disciplineController.create(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/disciplines/", async (req, res, next) => {
  try {
    await disciplineController.getAll(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/disciplines/:id", async (req, res, next) => {
  try {
    await disciplineController.getOne(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/disciplines/teacher/:teacherId", async (req, res, next) => {
  try {
    await disciplineController.getDisciplinesByTeacherId(req, res);
  } catch (err) {
    next(err);
  }
});

app.put("/disciplines/:id", async (req, res, next) => {
  try {
    await disciplineController.update(req, res);
  } catch (err) {
    next(err);
  }
});

app.delete("/disciplines/:id", async (req, res, next) => {
  try {
    await disciplineController.delete(req, res);
  } catch (err) {
    next(err);
  }
});
//#endregion

//#region Students
app.post("/students/", async (req, res, next) => {
  try {
    await studentController.create(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/students/", async (req, res, next) => {
  try {
    await studentController.getAll(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/students/:id", async (req, res, next) => {
  try {
    await studentController.getOne(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/students/user/:userId", async (req, res, next) => {
  try {
    await studentController.getOneByUserId(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/students/group", async (req, res, next) => {
  try {
    await studentController.getAllByGroupId(req, res);
  } catch (err) {
    next(err);
  }
});

app.put("/students/:id", async (req, res, next) => {
  try {
    await studentController.update(req, res);
  } catch (err) {
    next(err);
  }
});

app.delete("/students/:id", async (req, res, next) => {
  try {
    await studentController.deleteStudent(req, res);
  } catch (err) {
    next(err);
  }
});
//#endregion

//#region Groups
app.post("/groups/", async (req, res, next) => {
  try {
    await groupController.create(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/groups/", async (req, res, next) => {
  try {
    await groupController.getAll(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/groups/:id", async (req, res, next) => {
  try {
    await groupController.getOne(req, res);
  } catch (err) {
    next(err);
  }
});

app.put("/groups/:id", async (req, res, next) => {
  try {
    await groupController.update(req, res);
  } catch (err) {
    next(err);
  }
});

app.delete("/groups/:id", async (req, res, next) => {
  try {
    await groupController.delete(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/groups/link", async (req, res, next) => {
  try {
    await groupController.createGroupDisciplineLink(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/groups/disciplines/:groupId", async (req, res, next) => {
  try {
    await groupController.getAllDisciplinesByGroupId(req, res);
  } catch (err) {
    next(err);
  }
});
//#endregion

//#region Grades
app.post("/grades/", async (req, res, next) => {
  try {
    await gradeController.create(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/grades/", async (req, res, next) => {
  try {
    await gradeController.getAll(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/grades/:id", async (req, res, next) => {
  try {
    await gradeController.getOne(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/grades/student/:studentId", async (req, res, next) => {
  try {
    await gradeController.getAllByStudentId(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/grades/teacher/:teacherId", async (req, res, next) => {
  try {
    await gradeController.getAllByTeacherId(req, res);
  } catch (err) {
    next(err);
  }
});

app.put("/grades/:id", async (req, res, next) => {
  try {
    await gradeController.update(req, res);
  } catch (err) {
    next(err);
  }
});

app.delete("/grades/:id", async (req, res, next) => {
  try {
    await gradeController.delete(req, res);
  } catch (err) {
    next(err);
  }
});

//#endregion

//#region Teachers
app.post("/create", async (req, res, next) => {
  try {
    await teacherController.create(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/all", async (req, res, next) => {
  try {
    await teacherController.getAll(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/:id", async (req, res, next) => {
  try {
    await teacherController.getOne(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/user/:userId", async (req, res, next) => {
  try {
    await teacherController.getOneByUserId(req, res);
  } catch (err) {
    next(err);
  }
});

app.put("/:id", async (req, res, next) => {
  try {
    await teacherController.update(req, res);
  } catch (err) {
    next(err);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    await teacherController.delete(req, res);
  } catch (err) {
    next(err);
  }
});
//#endregion

//#region Users
app.post("/users/login", async (req, res, next) => {
  try {
    await userController.login(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/users/all", async (req, res, next) => {
  try {
    await userController.getAll(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    await userController.getOne(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/users/create", async (req, res, next) => {
  try {
    await userController.create(req, res);
  } catch (err) {
    next(err);
  }
});

app.put("/users/:id", async (req, res, next) => {
  try {
    await userController.update(req, res);
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    await userController.delete(req, res);
  } catch (err) {
    next(err);
  }
});

//#endregion

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
