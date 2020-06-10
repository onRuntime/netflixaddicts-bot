import { ParsedMessage } from 'discord-command-parser';
import { PermissionResolvable, Message } from "discord.js";

export class CommandMap extends Map<string, ICommand> {
    
    on(cmd: string, handler: Function, aliases?: string[], permissions: PermissionResolvable = []): this {
        const command: ICommand = new Command(cmd, handler, aliases, permissions);
        if(!this.has(cmd))
            this.set(cmd, command);
        else
            this.get(cmd).handlers.push(handler);
        if(aliases) aliases.forEach((aliase: string) => this.on(aliase, handler, null, permissions));
        return this;
    }

    off(cmd: string, handler?: Function): this {
        if(!handler) {
            this.delete(cmd);
        } else {
            let array = this.get(cmd).handlers;
            if(array) {
                let idx = array.indexOf(handler);
                if(idx > -1)
                    array.splice(idx, 1);
            }
        }
        return this;
    }
}

export interface ICommand {
    command: string;
    aliases?: string[];
    permissions?: PermissionResolvable;
    handlers: Function[];
    cmdDelete: boolean;

    handle(parsed: ParsedMessage<Message>, message: Message): Promise<void>;
}

class Command implements ICommand {
    command: string;
    permissions?: PermissionResolvable;
    handlers: Function[];
    cmdDelete: boolean;

    constructor(command: string, handler: Function, permissions?: PermissionResolvable, cmdDelete: boolean = true) {
        this.command = command;
        this.permissions = permissions;
        this.handlers = [handler];
        this.cmdDelete = cmdDelete;
    }

    handle(parsed: ParsedMessage<Message>, message: Message): Promise<void> {
        return new Promise((resolve) => {
            this.handlers.forEach((handler) => handler(parsed, message));
            resolve();
        });
    }
}