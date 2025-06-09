import "reflect-metadata"
import { TeacherService } from "../services/TeacherService";
import { IUnitOfWork } from "../interfaces/repository-interfaces/uow.interface";
import { IUserService } from "../interfaces/service-interfaces/user-service.interface";
import { TeacherAttributes } from "../models/entities/Teacher.model";
import { RolesEnum } from "../enums/RolesEnum";

const mockUow = {
  getTeacherRepository: jest.fn(),
  getUserRepository: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  getTransaction: jest.fn(),
} as unknown as IUnitOfWork;

const mockUserService = {
  getUserByEmail: jest.fn() as jest.Mock,
  createUser: jest.fn() as jest.Mock,
} as any as IUserService;

const mockTeacherRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

describe("TeacherService", () => {
  let service: TeacherService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUow.getTeacherRepository = jest.fn(() => mockTeacherRepo);
    service = new TeacherService(mockUow, mockUserService);
  });

  it("should return all teachers", async () => {
    const teachers: TeacherAttributes[] = [
      { id: 1, firstName: "Taras", lastName: "Shevchenko", userId: 2 },
    ];
    mockTeacherRepo.findAll.mockResolvedValue(teachers);

    const result = await service.getAllTeachers();

    expect(mockTeacherRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(teachers);
  });

  it("should return teacher by id", async () => {
    const teacher = { id: 1, firstName: "Ivan", lastName: "Franko", userId: 3 };
    mockTeacherRepo.findById.mockResolvedValue(teacher);

    const result = await service.getTeacherById(1);

    expect(mockTeacherRepo.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(teacher);
  });

  it("should create a teacher", async () => {
    const email = "teacher@example.com";
    const password = "securePass";
    const firstName = "Lesya";
    const lastName = "Ukrainka";

    (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (mockUserService.createUser as jest.Mock).mockResolvedValue({ id: 10 });
    mockTeacherRepo.create.mockResolvedValue({
      id: 99,
      firstName,
      lastName,
      userId: 10,
    });

    const result = await service.createTeacher(email, password, firstName, lastName);

    expect(mockUow.beginTransaction).toHaveBeenCalled();
    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
    expect(mockUserService.createUser).toHaveBeenCalledWith(
      email,
      password,
      RolesEnum.TEACHER
    );
    expect(mockTeacherRepo.create).toHaveBeenCalledWith(
      { firstName, lastName, userId: 10 },
      undefined
    );
    expect(mockUow.commit).toHaveBeenCalled();
    expect(result).toEqual({
      id: 99,
      firstName,
      lastName,
      userId: 10,
    });
  });

  it("should return null if teacher already exists by email", async () => {
    (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await service.createTeacher("test@mail.com", "1234", "Name", "Surname");

    expect(mockUow.rollback).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
