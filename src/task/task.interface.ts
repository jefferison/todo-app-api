import { Document } from 'mongoose';

export interface ITask extends Document{
    readonly _id: string;
    readonly title: string;
    readonly description: string;
    readonly userId: string;
    readonly sharedWith: [String],
}