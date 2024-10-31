import http from '../http-common';
import UserDataService from '../services/UserDataService';

jest.mock('../http-common');

describe('UserDataService', () => {
  const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
  const mockUserId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should post user data', async () => {
    http.post.mockResolvedValue({ data: mockUserData });
    const result = await UserDataService.createUser(mockUserData);
    expect(http.post).toHaveBeenCalledWith('/users', mockUserData);
    expect(result.data).toEqual(mockUserData);
  });

  test('getAllUsers should fetch all users', async () => {
    const mockUsers = [mockUserData];
    http.get.mockResolvedValue({ data: mockUsers });
    const result = await UserDataService.getAllUsers();
    expect(http.get).toHaveBeenCalledWith('/users');
    expect(result.data).toEqual(mockUsers);
  });

  test('getUser should fetch a single user', async () => {
    http.get.mockResolvedValue({ data: mockUserData });
    const result = await UserDataService.getUser(mockUserId);
    expect(http.get).toHaveBeenCalledWith(`/users/${mockUserId}`);
    expect(result.data).toEqual(mockUserData);
  });

  test('updateUser should update user data', async () => {
    const updatedUserData = { ...mockUserData, username: 'updateduser' };
    http.put.mockResolvedValue({ data: updatedUserData });
    const result = await UserDataService.updateUser(mockUserId, updatedUserData);
    expect(http.put).toHaveBeenCalledWith(`/users/${mockUserId}`, updatedUserData);
    expect(result.data).toEqual(updatedUserData);
  });

  test('deleteUser should delete a user', async () => {
    const mockResponse = { data: { message: 'User deleted successfully' } };
    http.delete.mockResolvedValue(mockResponse);
    const result = await UserDataService.deleteUser(mockUserId);
    expect(http.delete).toHaveBeenCalledWith(`/users/${mockUserId}`);
    expect(result).toEqual(mockResponse);
  });
});