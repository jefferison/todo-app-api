import { ITask } from './task.interface';

describe('ITask', () => {
    let ITask: ITask = {
        _id: 'id',
        title: 'Task title',
        description: 'Task description',
        userId: 'user-id',
        sharedWith: ['user-id-1', 'user-id-2'],
    } as unknown as ITask;;

    it('should be defined', () => {
        expect(ITask).toBeDefined();
    });

    it('should have the correct properties', () => {
        const task: ITask = {
        _id: 'id',
        title: 'Task title',
        description: 'Task description',
        userId: 'user-id',
        sharedWith: ['user-id-1', 'user-id-2'],
        } as unknown as ITask;
        expect(task._id).toEqual('id');
        expect(task.title).toEqual('Task title');
        expect(task.description).toEqual('Task description');
        expect(task.userId).toEqual('user-id');
        expect(task.sharedWith).toEqual(['user-id-1', 'user-id-2']);
    });

});
